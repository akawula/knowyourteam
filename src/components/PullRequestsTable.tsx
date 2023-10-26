import humanizeDuration from "humanize-duration";
import { PullRequest } from "../helpers/graphql";
import { Link, Typography } from "@mui/joy";
import React, { ReactElement } from "react";
import CustomTable from "./CustomTable";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';

export default function PullRequestsTable({ prsList, setPrsList }: { prsList: PullRequest[], setPrsList: Function }) {
    const [sortField, setSortField] = React.useState('Merged At');
    const [sortDirection, setSortDirection] = React.useState('DESC');

    const setSortFieldAndOrder = (name: string): void => {
        if (sortField === name) {
            setSortDirection(sortDirection === 'ASC' ? 'DESC' : 'ASC');
        } else {
            setSortDirection('ASC');
        }

        setSortField(name);
    };

    const HeaderSort = (name: string): string | ReactElement => {
        if (sortField !== name) {
            return name;
        }

        let arrow: ReactElement = <ArrowDropUpIcon />;
        if (sortDirection === 'DESC') {
            arrow = <ArrowDropDownIcon />;
        }

        return <React.Fragment>{name} {arrow}</React.Fragment>
    };

    const sortByTitle = (): void => {
        setSortFieldAndOrder('Title');
        if (sortDirection === 'DESC') {
            setPrsList([...prsList.sort((a, b) => a.title.localeCompare(b.title))]);
            return;
        }
        setPrsList([...prsList.sort((b, a) => a.title.localeCompare(b.title))]);
    };

    const sortByRepository = () => {
        setSortFieldAndOrder('Repository');
        if (sortDirection === 'DESC') {
            setPrsList([...prsList.sort((a, b) => `${a.repository.owner}/${a.repository.name}`.localeCompare(`${b.repository.owner}/${b.repository.name}`))])
            return;
        }

        setPrsList([...prsList.sort((b, a) => `${a.repository.owner}/${a.repository.name}`.localeCompare(`${b.repository.owner}/${b.repository.name}`))])
    };

    const sortByAuthor = () => {
        setSortFieldAndOrder('Author');
        if (sortDirection === 'DESC') {
            setPrsList([...prsList.sort((a, b) => a.author.login.localeCompare(b.author.login))])
            return;
        }

        setPrsList([...prsList.sort((b, a) => a.author.login.localeCompare(b.author.login))])
    };

    const sortByTimeToMerge = () => {
        setSortFieldAndOrder('Time To Merge');
        if (sortDirection === 'DESC') {
            setPrsList([...prsList.sort((a, b) => a.timeToMergeRaw > b.timeToMergeRaw ? 1 : -1)])
            return;
        }

        setPrsList([...prsList.sort((b, a) => a.timeToMergeRaw > b.timeToMergeRaw ? 1 : -1)])
    };

    const sortByCode = () => {
        setSortFieldAndOrder('Code');
        if (sortDirection === 'DESC') {
            setPrsList([...prsList.sort((a, b) => a.additions + a.deletions > b.additions + b.deletions ? 1 : -1)])
            return;
        }

        setPrsList([...prsList.sort((b, a) => a.additions + a.deletions > b.additions + b.deletions ? 1 : -1)])
    };

    const sortByJira = () => {
        setSortFieldAndOrder('JIRA');
        if (sortDirection === 'DESC') {
            setPrsList([...prsList.sort((a, b) => a.JIRA.localeCompare(b.JIRA))])
            return;
        }

        setPrsList([...prsList.sort((b, a) => a.JIRA.localeCompare(b.JIRA))])
    };

    const sortByCommits = () => {
        setSortFieldAndOrder('Commits');
        if (sortDirection === 'DESC') {
            setPrsList([...prsList.sort((a, b) => a.commits.totalCount > b.commits.totalCount ? 1 : -1)])
            return;
        }

        setPrsList([...prsList.sort((b, a) => a.commits.totalCount > b.commits.totalCount ? 1 : -1)])
    };

    const sortByMergedAt = () => {
        setSortFieldAndOrder('Merged At');
        if (sortDirection === 'DESC') {
            setPrsList([...prsList.sort((a, b) => a.mergedAt > b.mergedAt ? 1 : -1)])
            return;
        }

        setPrsList([...prsList.sort((b, a) => a.mergedAt > b.mergedAt ? 1 : -1)])
    };

    const filteredTableHeaders = [
        { size: '380px', title: HeaderSort('Title'), sort: sortByTitle },
        { size: '180px', title: HeaderSort('Repository'), sort: sortByRepository },
        { size: '150px', title: HeaderSort('Author'), sort: sortByAuthor },
        { size: '150px', title: HeaderSort('Time To Merge'), sort: sortByTimeToMerge },
        { size: '110px', title: HeaderSort('Code'), sort: sortByCode },
        { size: '110px', title: HeaderSort('JIRA'), sort: sortByJira },
        { size: '100px', title: HeaderSort('Commits'), sort: sortByCommits },
        { size: '180px', title: HeaderSort('Merged At'), sort: sortByMergedAt },
    ];

    const filteredTableContent = prsList.map((pr: PullRequest) => {
        return [
            <Link href={pr.url} target="_blank">{pr.title}</Link>,
            `${pr.repository.owner.login}/${pr.repository.name}`,
            pr.author.login,
            humanizeDuration(pr.timeToMergeRaw),
            <React.Fragment><Typography display='inline' color='success'>+{pr.additions} ({Math.round(pr.additions / (pr.additions + pr.deletions) * 100)}%)</Typography><br />
                <Typography display='inline' color='danger'>-{pr.deletions} ({Math.round(pr.deletions / (pr.additions + pr.deletions) * 100)}%)</Typography></React.Fragment>,
            pr.JIRA,
            pr.commits.totalCount,
            <React.Fragment>{(new Date(pr.mergedAt)).toLocaleString()}<br />{(new Date(pr.mergedAt)).toLocaleString('en-us', { weekday: 'long' })}</React.Fragment>
        ];
    });

    return <CustomTable
        list={filteredTableContent}
        headers={filteredTableHeaders} />
}
