import { Octokit } from '@octokit/core';
import humanizeDuration from 'humanize-duration';

export interface PullRequest {
    id: string,
    title: string,
    state: string,
    url: string,
    mergedAt: string,
    createdAt: string,
    additions: number,
    deletions: number,
    headRefName: string,
    timeToMerge: string,
    timeToMergeRaw: number,
    JIRA: string,
    author: {
        avatarUrl: string,
        login: string
    }
    repository: {
        name: string,
        owner: {
            login: string,
        }
        primaryLanguage: {
            name: string
        }
    }
    commits: {
        nodes: Commit[],
        totalCount: number
    }
    timelineItems: {
        nodes: { createdAt: string }[]
    }
}

interface Commit {
    message: string
}

interface PullRequestsResponse {
    user: {
        pullRequests: {
            nodes: PullRequest[],
            pageInfo: {
                endCursor: string,
                hasNextPage: boolean
            }
        }
    }
}
interface Team {
    slug: string
    name: string
}
interface Organization {
    login: string,
    teams: {
        nodes: Team[],
        pageInfo: {
            endCursor: string,
            hasNextPage: boolean
        }
    }
}
interface TeamsResponse {
    organization: Organization
}

interface MembersResponse {
    organization: {
        team: {
            members: {
                nodes: { login: string }[],
                pageInfo: {
                    endCursor: string,
                    hasNextPage: boolean
                }
            }
        }
    }
}

interface OrganizationsResponse {
    viewer: {
        organizations: {
            nodes: { login: string }[],
        }
    }
}

const TEAM_MEMBERS_QUERY = `
    query($organization: String!, $slug: String!, $after: String) {
        organization(login: $organization) {
            team(slug: $slug) {
                name
                members(first: 100, after: $after) {
                    nodes {
                        login
                    }
                    pageInfo {
                        endCursor
                        hasNextPage
                    }
                }
            }
        }
    }
`;

// GraphQL query to fetch pull requests of a specific author with additional details
const PULL_REQUESTS_QUERY = `
  query ($author: String!, $after: String) {
    user(login: $author) {
        pullRequests(
            after: $after
            first: 100
            orderBy: {field: CREATED_AT, direction: DESC}
            states: MERGED
            baseRefName: "main"
            ) {
                nodes {
                    id
                    title
                    state
                    url
                    mergedAt
                    createdAt
                    additions
                    deletions
                    headRefName
                    author {
                        avatarUrl
                        login
                    }
                    repository {
                        name
                        owner {
                            login
                        }
                        primaryLanguage {
                            name
                        }
                    }
                    commits(first: 100) {
                        nodes {
                            commit {
                                message
                            }
                        }
                        totalCount
                    }
                    timelineItems(itemTypes: REVIEW_REQUESTED_EVENT, first: 1) {
                        nodes {
                            ... on ReviewRequestedEvent {
                                createdAt
                            }
                        }
                    }
                }
                pageInfo {
                    hasNextPage
                    endCursor
                }
            }
        }
    }
`;

const ORGANIZATION_TEAMS_QUERY = `
    query($organization: String!, $after: String) {
        organization(login: $organization) {
            teams(first: 100, after: $after) {
                nodes {
                    name
                    slug
                }
                pageInfo {
                    hasNextPage
                    endCursor
                }
                totalCount
            }
        }
    }
`;

const ORGANIZATIONS_QUERY = `
    query {
        viewer {
            organizations(first: 100) {
                nodes {
                    login
                }
            }
        }
    }
`;

const findJiraKeys = (pr: PullRequest) => {
    const toBeSearched: string[] = [pr.headRefName, pr.title, ...pr.commits.nodes.map((x: Commit) => x.message)];
    let keys: string[] = [];
    while (toBeSearched.length) {
        const value: string = toBeSearched.shift() || '';
        let searched = [...value.matchAll(/(?![revert])[A-Za-z]{2,6}\-[0-9]{1,5}|NO\-JIRA/g)];
        if (searched) {
            keys = keys.concat(searched.flat());
        }
    }

    return keys.length ? [...new Set(keys)].join(',') : 'NO-JIRA';
};

const retryPromise = async (token: string, query: string, args: any, retry: number = 5): Promise<any> => {
    try {
        const octokit = new Octokit({ auth: token });
        return await octokit.graphql(query, args);
    } catch (err) {
        if (retry) {
            console.log(`retrying...`, args);
            return retryPromise(token, query, args, --retry);
        }
        throw Error('No more retry! Sorry!');
    }
};

// Function to fetch pull requests of a specific author created within the past year
export default async function fetchAuthorPullRequests(token: string, author: string): Promise<any[]> {
    try {
        let hasNextPage = true;
        let endCursor = null;
        let allPullRequests: any[] = [];

        while (hasNextPage) {
            const response: PullRequestsResponse = await retryPromise(token, PULL_REQUESTS_QUERY, {
                author,
                after: endCursor,
            });

            const pullRequests = response.user.pullRequests.nodes;
            endCursor = response.user.pullRequests.pageInfo.endCursor;
            hasNextPage = response.user.pullRequests.pageInfo.hasNextPage;

            allPullRequests = allPullRequests.concat(pullRequests);

            if (!hasNextPage) {
                break;
            }
        }

        allPullRequests.map(x => {
            const diff = calculateDiff(x);
            x.JIRA = findJiraKeys(x);
            x.timeToMerge = humanizeDuration(diff);
            x.timeToMergeRaw = diff;
            return x;
        });

        return allPullRequests;
    } catch (error) {
        throw new Error(`Error fetching pull requests for ${author}: ${error}`);
    }
}

const removeWeekendsFromDiff = (startDay: string, endDay: string): number => {
    const a = new Date(startDay);
    const b = new Date(endDay);

    let diff = b.getTime() - a.getTime();
    const diffHours = diff / 1000 / 60 / 60;
    let daysToCheck = Math.ceil(diffHours / 24);

    if (diffHours < 48) {
        return diff;
    }

    while (daysToCheck !== 0) {
        daysToCheck--;
        b.setDate(b.getDate() - 1);
        if ([0, 6].includes(b.getUTCDay())) {
            diff = diff - (1000 * 60 * 60 * 24)
        }
    }

    return diff;
}

const calculateDiff = (x: PullRequest): number => {
    const startDate = x.timelineItems.nodes.length && x.timelineItems.nodes[0].createdAt ? x.timelineItems.nodes[0].createdAt : x.createdAt;
    const endDate = x.mergedAt;

    return removeWeekendsFromDiff(startDate, endDate);
}

export async function fetchOrganizations(token: string) {
    try {
        const octokit = new Octokit({ auth: token });
        const response: OrganizationsResponse = await octokit.graphql(ORGANIZATIONS_QUERY);
        return response.viewer.organizations.nodes.map(org => org.login);
    } catch (error) {
        console.log(error);
        throw new Error(`Error fetching organizations: ${error}`);
    }
}

export async function fetchTeams(token: string, organization: string) {
    try {
        const octokit = new Octokit({ auth: token });

        let hasNextPage = true;
        let endCursor = null;
        let teams: any[] = [];

        while (hasNextPage) {
            const response: TeamsResponse = await octokit.graphql(ORGANIZATION_TEAMS_QUERY, {
                organization,
                after: endCursor,
            });

            teams = teams.concat(response.organization.teams.nodes.map(team => ({ org: organization, slug: team.slug, name: team.name })));

            endCursor = response.organization.teams.pageInfo.endCursor;
            hasNextPage = response.organization.teams.pageInfo.hasNextPage;

            if (!hasNextPage) {
                break;
            }
        }

        return teams;
    } catch (error) {
        throw new Error(`Error fetching teams: ${error}`);
    }
}

export async function fetchTeamMembers(token: string, organization: string, slug: string) {
    try {
        const octokit = new Octokit({ auth: token });

        let hasNextPage = true;
        let endCursor = null;
        let members: string[] = [];

        while (hasNextPage) {
            const response: MembersResponse = await octokit.graphql(TEAM_MEMBERS_QUERY, {
                organization,
                slug,
                after: endCursor,
            });

            members = members.concat(response.organization.team.members.nodes.map(member => member.login));

            endCursor = response.organization.team.members.pageInfo.endCursor;
            hasNextPage = response.organization.team.members.pageInfo.hasNextPage;

            if (!hasNextPage) {
                break;
            }
        }

        return members;
    } catch (error) {
        throw new Error(`Error fetching teams: ${error}`);
    }
}
