import React, { useMemo, useState } from 'react';
import {
  IconButton,
  Typography,
  Box,
  Drawer,
  CssBaseline,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import wbdIcon from '../Warner_Bros_Discovery.png';
import Dashboard from './pages/dashboard';
import UserJourney from './pages/user-journey/UserJourney';
import AddEvent from './pages/add-event/AddEvent';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PersonIcon from '@mui/icons-material/Person';
import EventIcon from '@mui/icons-material/Event';
import AppNavigationLinks, {
  INavigationLinks,
} from './components/app-navigation-links/AppNavigationLinks';
import { ErrorBoundary } from './components/ErrorBoundary';
import { useTranslation } from 'react-i18next';

const drawerWidth = 280;

export default function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { t } = useTranslation();

  const handleDrawerToggle = (state: boolean) => {
    setMobileOpen(state);
  };

  const navigationLinks = useMemo(
    () => [
      {
        id: 'dashboard',
        label: t('dashboard.title'),
        Icon: DashboardIcon,
        Page: Dashboard,
      },
      {
        id: 'user-journey',
        label: t('userJourney.title'),
        Icon: PersonIcon,
        Page: UserJourney,
      },
      {
        id: 'add-event',
        label: t('addEvent.title'),
        Icon: EventIcon,
        Page: AddEvent,
      },
    ],
    [t]
  );
  const [activeNavigation, setActiveNavigation] = useState<INavigationLinks>(
    navigationLinks[0]
  );

  const navigationHandler = (navigationLink: INavigationLinks) => {
    setActiveNavigation(navigationLink);
    handleDrawerToggle(false);
  };

  const drawer = (
    <Box>
      <AppNavigationLinks
        navigationLinks={navigationLinks}
        onClick={navigationHandler}
        active={activeNavigation}
      />
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <CssBaseline />

      <Box
        component="header"
        position="fixed"
        sx={{
          height: { xs: 50, sm: 64 },
          px: 2,
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          bgcolor: '#1d1fb8',
          color: 'white',
          flexShrink: 0,
          boxShadow: 1,
          zIndex: theme.zIndex.drawer + 1,
          width: '100%',
        }}
      >
        {isMobile && (
          <IconButton
            color="inherit"
            edge="start"
            onClick={() => handleDrawerToggle(!mobileOpen)}
          >
            <MenuIcon />
          </IconButton>
        )}
        <Box
          component="img"
          src={wbdIcon}
          alt="Logo"
          sx={{ height: { xs: 30, sm: 40 } }}
        />
        <Typography variant="h6" fontWeight={400}>
          {t('appName')}
        </Typography>
      </Box>

      {/* LEFT PANEL */}
      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      >
        {/* Mobile Drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => handleDrawerToggle(!mobileOpen)}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              pt: { xs: '50px', sm: '65px' },
            },
          }}
        >
          {drawer}
        </Drawer>

        {/* Desktop Drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
              pt: '65px',
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* RIGHT PANEL (SCROLLABLE) */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          px: { xs: 1, sm: 3 },
          overflowY: 'auto',
          bgcolor: '#f3f4f6',
          py: 3,
          mt: { xs: '50px', sm: '64px' },
          scrollbarGutter: 'stable',
        }}
      >
        <ErrorBoundary reset={activeNavigation}>
          {activeNavigation.Page && <activeNavigation.Page />}
        </ErrorBoundary>
      </Box>
    </Box>
  );
}
