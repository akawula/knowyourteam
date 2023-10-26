import * as React from 'react';
import { Typography, Button, Input, FormControl, FormLabel, Link } from '@mui/joy';

// import and use store
import { Store } from "tauri-plugin-store-api";
const store = new Store(".settings");

import KeyIcon from '@mui/icons-material/Key';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';

export default function JiraToken() {
    const [email, setEmail] = React.useState<string>('');
    const [token, setToken] = React.useState<string>('');

    React.useEffect(() => {
        store.get<string>("jiraToken").then((setting) => setToken(setting || ''))
        store.get<string>("jiraEmail").then((setting) => setEmail(setting || ''))
    }, [])

    const onUpdateEmail = async () => {
        await store.set('jiraEmail', email);
    };

    const onUpdateToken = async () => {
        await store.set('jiraToken', token);
    };

    return (
        <React.Fragment>
            <Typography>Generate jira token <Link target="_blank" href="https://id.atlassian.com/manage-profile/security/api-tokens">here</Link></Typography>
            <FormControl sx={{ width: '500px', my: 5 }}>
                <FormLabel>Jira user email</FormLabel>
                <Input
                    startDecorator={<AlternateEmailIcon />}
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder='Jira user email'
                    endDecorator={<Button onClick={onUpdateEmail}>Save</Button>}
                />
            </FormControl>
            <FormControl sx={{ width: '500px', my: 5 }}>
                <FormLabel>Jira user token</FormLabel>
                <Input
                    startDecorator={<KeyIcon />}
                    value={token}
                    onChange={(event) => setToken(event.target.value)}
                    placeholder='Jira token'
                    endDecorator={<Button onClick={onUpdateToken}>Save</Button>}
                />
            </FormControl>
        </React.Fragment>
    );
}
