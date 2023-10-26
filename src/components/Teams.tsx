import React from "react";
import { Store } from "tauri-plugin-store-api";
import fetchAuthorPullRequests, { fetchOrganizations, fetchTeamMembers, fetchTeams } from "../helpers/graphql";
import { drip } from "../helpers/throttle";
import { useProgress, useSetProgress, useSetPrs, useSetTeamName, useSetTeams, useTeams } from "../context/StoreContext";
import { Autocomplete, FormControl, FormLabel } from "@mui/joy";

const store = new Store(".settings");

export default function Teams() {

    const [githubToken, setGithubToken] = React.useState<string>('');
    const [orgs, setOrgs] = React.useState<string[]>([]);
    const [team, setTeam] = React.useState<string>('');

    const progress = useProgress();
    const setProgress = useSetProgress();
    const updatePRs = useSetPrs();
    const setTeamName = useSetTeamName();
    const setTeamsContext = useSetTeams();
    const teamsContext = useTeams();

    React.useEffect(() => {
        store.get<string>('githubToken').then(result => setGithubToken(result || ''));
    }, []);

    React.useEffect(() => {
        if (teamsContext.length) {
            return;
        }
        if (!githubToken.length) {
            return;
        }
        fetchOrganizations(githubToken)
            .then(orgs => setOrgs(orgs))
    }, [githubToken]);

    React.useEffect(() => {
        if (teamsContext.length) {
            return;
        }
        Promise.allSettled(orgs.map(org => fetchTeams(githubToken, org)))
            .then(results => {
                const result = results
                    .map(x => x.status === 'fulfilled' ? x.value : [])
                setTeamsContext(result.flat());
            });
    }, [orgs]);

    React.useEffect(() => {
        if (!team.length) {
            return;
        }
        setProgress(() => 0);
        const [organization, slug] = team.split('|||');

        fetchTeamMembers(githubToken, organization, slug).then(members => {
            drip(members.map(m => [githubToken, m]), fetchAuthorPullRequests, 2, setProgress)
                .then(results => {
                    setProgress(() => -1);
                    const result = results
                        .sort((a, b) => Date.parse(a.mergedAt) < Date.parse(b.mergedAt) ? 1 : -1)
                    updatePRs(result);
                    setTeamName(`${organization}/${slug}`);
                }).catch((err) => {
                    setProgress(() => -1);
                    console.log(err); // TODO refactor it later to show errors in UI
                });
        });
    }, [team]);

    return (
        <FormControl>
            <FormLabel>
                Select team
            </FormLabel>
            <Autocomplete
                disabled={progress > -1}
                onChange={(_x, v) => { setTeam(v?.value || '') }}
                isOptionEqualToValue={(option, value) => option.value === value.value}
                placeholder={progress > -1 ? `Pick a team` : `Loading...`}
                options={teamsContext.map(team => ({ label: `${team.org}/${team.slug}`, value: `${team.org}|||${team.slug}` }))}
                sx={{ width: 300 }}
            />
        </FormControl>
    );
}
