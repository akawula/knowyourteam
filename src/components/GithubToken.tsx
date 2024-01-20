import * as React from 'react';
import { Typography, Button, Input, FormControl, FormLabel, Link, List, ListItem, ListItemDecorator, ListItemContent } from '@mui/joy';
import { Link as RouterLink } from 'react-router-dom';
// import and use store
import { Store } from "tauri-plugin-store-api";
const store = new Store(".settings");
// icons
import { GitHub } from '@mui/icons-material';
import FolderCopyIcon from '@mui/icons-material/FolderCopy';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import CorporateFareIcon from '@mui/icons-material/CorporateFare';

export default function GithubToken() {
    const [value, setValue] = React.useState<string>('');

    React.useEffect(() => {
        store.get<string>("githubToken").then((setting) => setValue(setting || ''))
    }, [])

    const onUpdate = async () => {
        await store.set('githubToken', value);
    };

    const onKeyDown = (event: { code: string; }) => {
        if (event.code !== 'Enter') {
            return;
        }

        onUpdate();
    }

    const info = value.length ? <RouterLink to='/settings/github'><Link>configure github</Link></RouterLink> : null;

    return (
        <React.Fragment>
            <List size="sm" component="ol" sx={{ flexGrow: 'initial' }}>
                <ListItem>
                    <ListItemDecorator><FolderCopyIcon /></ListItemDecorator>
                    <ListItemContent>repo:full - needed to read the public and private repositories</ListItemContent>
                </ListItem>
                <ListItem>
                    <ListItemDecorator><CorporateFareIcon /></ListItemDecorator>
                    <ListItemContent>Organization:read - needed to read the organization's teams</ListItemContent>
                </ListItem>
                <ListItem>
                    <ListItemDecorator><AccountCircleIcon /></ListItemDecorator>
                    <ListItemContent>User:read - needed to start searching from user perspective</ListItemContent>
                </ListItem>
            </List>
            <Typography>Generate github token <Link target="_blank" href="https://github.com/settings/tokens">here</Link></Typography>
            <FormControl sx={{ width: '500px', my: 5 }}>
                <FormLabel>Github token</FormLabel>
                <Input
                    startDecorator={<GitHub />}
                    value={value}
                    onKeyDown={onKeyDown}
                    onChange={(event) => setValue(event.target.value)}
                    placeholder='Github token'
                    endDecorator={<Button onClick={onUpdate}>Save</Button>}
                >
                </Input>
            </FormControl>
            {info}
        </React.Fragment>
    );
}
