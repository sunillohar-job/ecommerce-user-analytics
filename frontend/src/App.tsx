import React, { useState } from 'react';
import AppNavigationLinks, {
  INavigationLinks,
} from './components/AppNavigationLinks';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PersonIcon from '@mui/icons-material/Person';
import Dashboard from './pages/dashboard/Dashboard';
import UserJourney from './pages/user-journey/UserJourney';

export default function App() {
  const navigationLinks = [
    { id: 'dashboard', label: 'Dashboard', Icon: DashboardIcon, Page: Dashboard },
    { id: 'user-journey', label: 'User Journey', Icon: PersonIcon, Page: UserJourney },
  ];
  const [activeNavigation, setActiveNavigation] = useState<INavigationLinks>(navigationLinks[0]);

  const navigationHandler = (navigationLink: INavigationLinks) => {
    setActiveNavigation(navigationLink);
  };

  return (
    <div className="app">
      <header>
        <img src="/Warner_Bros_Discovery.png" alt="Logo" />
        <h1>User Analytics</h1>
      </header>
      <main>
        <section className="left">
          <AppNavigationLinks
            navigationLinks={navigationLinks}
            onClick={navigationHandler}
            active={activeNavigation}
          />
        </section>
        <section className="right">
          {activeNavigation.Page && <activeNavigation.Page />}
        </section>
      </main>
    </div>
  );
}
