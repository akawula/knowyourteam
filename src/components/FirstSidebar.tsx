import GlobalStyles from '@mui/joy/GlobalStyles';
import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';
import ListItemButton from '@mui/joy/ListItemButton';
import Sheet from '@mui/joy/Sheet';
import { Link, useLocation } from 'react-router-dom';
// icons
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import GithubIcon from '@mui/icons-material/GitHub';

import WPElogo from './WPElogo';
// import { openSidebar } from '../utils';

// import and use store
import { Store } from "tauri-plugin-store-api";
import React from 'react';
const store = new Store(".settings");

export default function FirstSidebar() {
  const location = useLocation();

  const [value, setValue] = React.useState<boolean>(true);

  React.useEffect(() => {
    store.get<Promise<string>>("githubToken").then((setting) => setValue(!!setting))
  }, [])

  return (
    <Sheet
      className="FirstSidebar"
      sx={{
        position: {
          xs: 'fixed',
          md: 'sticky',
        },
        transform: {
          xs: 'translateX(calc(100% * (var(--SideNavigation-slideIn, 0) - 1)))',
          md: 'none',
        },
        transition: 'transform 0.4s',
        zIndex: 10000,
        height: '100dvh',
        width: 'var(--FirstSidebar-width)',
        top: 0,
        p: 2,
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 1,
        borderRight: '1px solid',
        borderColor: 'divider',
      }}
    >
      <GlobalStyles
        styles={{
          ':root': {
            '--FirstSidebar-width': '68px',
          },
        }}
      />
      <WPElogo />
      <List size="sm" sx={{ '--ListItem-radius': '6px', '--List-gap': '8px' }}>
        <ListItem>
          <Link to={'/'}>
            <ListItemButton selected={location.pathname === '/'}>
              <HomeRoundedIcon />
            </ListItemButton>
          </Link>
        </ListItem>
        {value && <ListItem>
          <Link to={'/github'}>
            <ListItemButton selected={location.pathname === '/github'}>
              <GithubIcon />
            </ListItemButton>
          </Link>
        </ListItem>}
        <ListItem>
          <Link to={'/jira'}>
            <ListItemButton selected={location.pathname === '/jira'}>
              <HomeRoundedIcon />
            </ListItemButton>
          </Link>
        </ListItem>
        {/* <ListItem>
          <ListItemButton variant="soft" onClick={() => openSidebar()}>
            <DashboardRoundedIcon />
          </ListItemButton>
        </ListItem> */}
      </List>
      <List
        sx={{
          mt: 'auto',
          flexGrow: 0,
          '--ListItem-radius': '8px',
          '--List-gap': '4px',
        }}
      >
        <ListItem>
          <Link to={'/settings'}>
            <ListItemButton selected={location.pathname === '/settings'}>
              <SettingsRoundedIcon />
            </ListItemButton>
          </Link>
        </ListItem>
      </List>
    </Sheet>
  );
}

