import * as React from 'react';
import { Typography, Box } from "@mui/joy";
import Loading from './components/Loading';

export default function Jira() {
    return <React.Fragment>
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
                gap: 1,
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
                <Typography level="h2">Jira</Typography>
                <Typography>
                    Deployment Frequency — How often an organization successfully releases to production <br />
                    Lead Time for Changes — The amount of time it takes a commit to get into production <br />
                    Change Failure Rate — The percentage of deployments causing a failure in production <br />
                    Time to Restore Service — How long it takes an organization to recover from a failure in production <br />
                </Typography>
                <Loading />
            </Box>
        </Box>
    </React.Fragment>
}
