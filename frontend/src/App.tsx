import React, { useState } from 'react';
import AppNavigationLinks, {
  INavigationLinks,
} from './components/app-navigation-links/AppNavigationLinks';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PersonIcon from '@mui/icons-material/Person';
import Dashboard from './pages/dashboard/Dashboard';
import UserJourney from './pages/user-journey/UserJourney';
import { Box, Typography } from '@mui/material';

export default function App() {
  const navigationLinks = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      Icon: DashboardIcon,
      Page: Dashboard,
    },
    {
      id: 'user-journey',
      label: 'User Journey',
      Icon: PersonIcon,
      Page: UserJourney,
    },
  ];
  const [activeNavigation, setActiveNavigation] = useState<INavigationLinks>(
    navigationLinks[1]
  );

  const navigationHandler = (navigationLink: INavigationLinks) => {
    setActiveNavigation(navigationLink);
  };

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <Box
        component="header"
        sx={{
          height: 64,
          px: 2,
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          bgcolor: '#1d1fb8',
          color: 'white',
          flexShrink: 0,
          boxShadow: 1,
        }}
      >
        <Box
          component="img"
          src="/Warner_Bros_Discovery.png"
          alt="Logo"
          sx={{ height: 40 }}
        />
        <Typography variant="h6" fontWeight={400}>
          User Analytics
        </Typography>
      </Box>

      {/* Main */}
      <Box
        component="main"
        sx={{
          flex: 1,
          display: 'flex',
          minHeight: 0,
          minWidth: 0,
          overflow: 'hidden',
        }}
      >
        {/* Left Navigation Panel */}
        <Box
          sx={{
            width: 280,
            flexShrink: 0,
            bgcolor: 'white',
            borderRight: '1px solid #e5e7eb',
            overflow: 'hidden',
          }}
        >
          <AppNavigationLinks
            navigationLinks={navigationLinks}
            onClick={navigationHandler}
            active={activeNavigation}
          />
        </Box>

        {/* Right Content (SCROLL AREA) */}
        <Box
          sx={{
            flex: 1,
            minWidth: 0,
            minHeight: 0,
            overflow: 'auto',
            bgcolor: '#f3f4f6',
            p: 2,
            scrollbarGutter: 'stable',
          }}
        >
          <Box
            sx={{
              minWidth: 'max-content',
            }}
          >
            {activeNavigation.Page && <activeNavigation.Page />}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
