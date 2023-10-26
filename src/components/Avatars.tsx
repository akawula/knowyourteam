import { Avatar, AvatarGroup, Badge, Box } from "@mui/joy";
import { PullRequest } from "../helpers/graphql";
import CardBlock from "./Card";

export default function Avatars({ prsList }: { prsList: PullRequest[] }) {
    let allAvatars = prsList
        .map(pr => pr.author.avatarUrl)
        .reduce((acc: any, v: string) => {
            v in acc ? acc[v] += 1 : acc[v] = 1;
            return acc;
        }, {});
    allAvatars = Object.keys(allAvatars)
        .map((v) => [v, allAvatars[v]])
        .sort((a, b) => a[1] > b[1] ? -1 : 1);

    const avatars = allAvatars.slice(0, 10);
    let additionalAvatars = allAvatars.slice(11);
    if (additionalAvatars.length) {
        additionalAvatars = <Avatar>+{additionalAvatars.length}</Avatar>
    } else {
        additionalAvatars = null;
    }

    return (
        <CardBlock header="Authors">
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <AvatarGroup>
                    {avatars.map((avatar: string[]) => <Badge max={999} anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'left',
                    }} badgeContent={avatar[1]}><Avatar src={avatar[0]} /></Badge>)}
                    {additionalAvatars}
                </AvatarGroup>
            </Box>
        </CardBlock>
    );
}
