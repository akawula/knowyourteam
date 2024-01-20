import { HashRouter, Route, Routes } from "react-router-dom";
import { CssVarsProvider } from '@mui/joy/styles';
import CssBaseline from '@mui/joy/CssBaseline';
import Box from '@mui/joy/Box';

import FirstSidebar from './components/FirstSidebar';
// import SecondSidebar from './components/SecondSidebar';
import Breadcrumbs from "./components/Breadcrumbs";
import Header from './components/Header';
import ColorSchemeToggle from './components/ColorSchemeToggle';
import Dashboard from "./Dashboard";
import Settings from "./Settings";
import Github from "./Github";
import { StoreContextProvider } from './context/StoreContext';

export default function AppRouter() {
    return (
        <StoreContextProvider>
            <HashRouter>
                <CssVarsProvider disableTransitionOnChange>
                    <CssBaseline />
                    <Box sx={{ display: 'flex', minHeight: '100dvh' }}>
                        <Header />
                        <FirstSidebar />
                        {/* <SecondSidebar /> */}
                        <Box
                            component="main"
                            className="MainContent"
                            sx={{
                                px: {
                                    xs: 2,
                                    md: 6,
                                },
                                pt: {
                                    xs: 'calc(12px + var(--Header-height))',
                                    sm: 'calc(12px + var(--Header-height))',
                                    md: 3,
                                },
                                pb: {
                                    xs: 2,
                                    sm: 2,
                                    md: 3,
                                },
                                // flex: 1,
                                display: 'flex',
                                flexDirection: 'column',
                                minWidth: 'calc(100dvw - var(--FirstSidebar-width) - 15px)',
                                minHeight: '100dvh',
                                gap: 1,
                                overflow: 'hidden'
                            }}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Breadcrumbs />
                                <ColorSchemeToggle
                                    sx={{ ml: 'auto', display: { xs: 'none', md: 'inline-flex' } }}
                                />
                            </Box>

                            <Routes>
                                <Route path="/" Component={Dashboard} />
                                <Route path="/github" Component={Github} />
                                <Route path="/settings" Component={Settings} />
                            </Routes>
                        </Box>
                    </Box>
                </CssVarsProvider>
            </HashRouter>
        </StoreContextProvider>
    );
}
