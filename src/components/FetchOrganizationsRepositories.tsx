import { Button, Grid, Table, Typography } from "@mui/joy";
import { useProgress, useSetProgress } from "../context/StoreContext";
import { fetchOrganizationRepositories, fetchOrganizations } from "../helpers/graphql";

import { Store } from "tauri-plugin-store-api";
import React from "react";
import getDb from "../helpers/sql";
const store = new Store(".settings");

export default function FetchOrganizationsRepositories() {
    const setProgress = useSetProgress();
    const progress = useProgress();

    const [orgs, setOrgs] = React.useState<{ slug: string, repositories: number }[]>([]);

    const setOrgsQuery = async () => {
        try {
            const db = await getDb();
            const result = await db.select<{ slug: string, repositories: number }[]>(`
                    SELECT organizations.slug, count(repositories.name) as repositories FROM organizations
                    LEFT JOIN repositories ON repositories.owner = organizations.slug
                    GROUP BY organizations.slug
                `);
            setOrgs(result);
        } catch (err) {
            console.log(err);
        }
    };

    React.useEffect(() => {
        (setOrgsQuery)();
    }, []);

    const fetchOrgs = () => {
        setProgress(40);
        (async () => {
            try {
                const token = await store.get<string>("githubToken") || "";
                const db = await getDb();
                const organizations = await fetchOrganizations(token);
                await db.execute(`INSERT OR IGNORE INTO organizations (slug) VALUES ` + organizations.map(o => `('${o}')`).join(','));
                await setOrgsQuery();
            } catch (err) {
                console.log('catch error', err)
            } finally {
                console.log('Finally!')
                setProgress(-1);
            }
        })();
    };

    const fetchRepositories = async (organization: string) => {
        const token = await store.get<string>('githubToken') || "";
        const results = await fetchOrganizationRepositories(token, organization, setProgress);
        const db = await getDb();
        await db.execute('INSERT OR IGNORE INTO repositories (name, owner, language) VALUES ' + results.map(repo => `('${repo.name}', '${organization}', '${repo?.primaryLanguage?.name || 'Unknown'}')`).join(','));
        await setOrgsQuery();
    };

    return <React.Fragment>
        <Grid xs={6} marginY={3} container>
            <Grid xs={12}><Typography>To use this tool we need to know a little bit about your organizations and repositories.</Typography></Grid>
            <Grid xs={12}><Button disabled={progress > -1} onClick={() => fetchOrgs()}>Fetch organizations</Button></Grid>
        </Grid>
        <Grid>
            <Table>
                <thead>
                    <tr>
                        <th>Organization</th>
                        <th>repositories</th>
                        <th>fetch repositories</th>
                    </tr>
                </thead>
                <tbody>
                    {orgs.map(org => <tr key={org.slug}>
                        <td>{org.slug}</td>
                        <td>{org.repositories}</td>
                        <td><Button onClick={() => fetchRepositories(org.slug)}>Fetch repositories</Button></td>
                    </tr>)}
                </tbody>
            </Table>
        </Grid>
    </React.Fragment>
}
