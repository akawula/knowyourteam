import { PropsWithChildren, useState } from "react";
import { createContext, useContextSelector } from "use-context-selector";
import { PullRequest } from "../helpers/graphql";

interface Team {
    name: string,
    slug: string,
    org: string
}

interface StoreContext {
    prs: PullRequest[],
    setPrs: Function,
    teamName: string,
    setTeamName: Function,
    progress: number,
    setProgress: Function,
    teams: Team[],
    setTeams: Function
}

const initialValue: StoreContext = {
    prs: [],
    setPrs: () => { },
    teamName: '',
    setTeamName: () => { },
    progress: -1,
    setProgress: () => { },
    teams: [],
    setTeams: () => { }
};

const useStore = (): StoreContext => {
    const [prs, setPrs] = useState<PullRequest[]>(initialValue.prs);
    const [teamName, setTeamName] = useState<string>('');
    const [progress, setProgress] = useState<number>(-1);
    const [teams, setTeams] = useState<{ name: string, slug: string, org: string }[]>([]);

    return {
        prs,
        setPrs: (prs: PullRequest[]) => setPrs(prs),
        teamName,
        setTeamName: (name: string) => setTeamName(name),
        progress,
        setProgress: (number: number) => setProgress(number),
        teams,
        setTeams: (teams: Team[]) => setTeams(teams)
    }
}

export const StoreContext = createContext<StoreContext>(initialValue);

export const StoreContextProvider = ({ children }: PropsWithChildren) => (
    <StoreContext.Provider value={useStore()}>{children}</StoreContext.Provider>
);

export const usePrs = (): PullRequest[] => useContextSelector(StoreContext, (s) => s.prs);
export const useSetPrs = () => useContextSelector(StoreContext, (s) => s.setPrs);
export const useTeamName = (): string => useContextSelector(StoreContext, (s) => s.teamName);
export const useSetTeamName = () => useContextSelector(StoreContext, (s) => s.setTeamName);
export const useProgress = (): number => useContextSelector(StoreContext, (s) => s.progress);
export const useSetProgress = () => useContextSelector(StoreContext, (s) => s.setProgress);
export const useTeams = (): Team[] => useContextSelector(StoreContext, (s) => s.teams);
export const useSetTeams = () => useContextSelector(StoreContext, (s) => s.setTeams);
