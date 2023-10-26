import { Box, Grid, Typography } from '@mui/joy';
import GithubToken from './components/GithubToken';
import React from 'react';
import JiraToken from './components/JiraToken';

export default function Settings() {

    return (
        <React.Fragment>
            <Box
                component="main"
                className="MainContent"
                sx={{
                    pt: {
                        xs: 'calc(12px + var(--Header-height))',
                        md: 3,
                    },
                    pb: {
                        xs: 2,
                        sm: 2,
                        md: 3,
                    },
                    display: 'flex',
                    flexDirection: 'column',
                    minWidth: 0,
                    minHeight: '100dvh',
                    height: 'max-content',
                    gap: 0,
                    overflow: 'auto',
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        my: 1,
                        gap: 1,
                        flexDirection: { xs: 'column', sm: 'row' },
                        alignItems: { xs: 'start', sm: 'center' },
                        flexWrap: 'wrap',
                        justifyContent: 'space-between',
                    }}
                >
                    <Typography level="h2">Dashboard</Typography>
                </Box>
                <Typography sx={{ pb: 4 }}>
                    In order to use this tool, you need to grant me na access to your github and Jira.<br />
                    Unfortunetly, today it's only possible to provide the github and Jira token manually.<br />
                    Remeber to allow access to:
                </Typography>
                <Grid container>
                    <Grid xs={6}>
                        <GithubToken />
                    </Grid>
                    <Grid xs={6}>
                        <JiraToken />
                    </Grid>
                </Grid>
            </Box>
        </React.Fragment>
    );
}

