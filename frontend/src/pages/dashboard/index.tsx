import React, { useState } from 'react';
import {
  Box,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Tabs,
  Tab,
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import TrafficAnalytics from './TrafficAnalytics';
import SearchAnalytics from './SearchAnalytics';
import ProductAndCartAnalytics from './ProductAndCartAnalytics';
import RevenueAndConversionAnalytics from './RevenueAndConversionAnalytics';
import UserBehaviorAndFunnelAnalytics from './UserBehaviorAndFunnelAnalytics';
import { ErrorBoundary } from '../../components/ErrorBoundary';

const TIME_PERIODS = [
  { label: 'Today', value: 'today' },
  { label: 'Yesterday', value: 'yesterday' },
  { label: 'Last 7 Days', value: 'last_7_days' },
  { label: 'This Week', value: 'this_week' },
  { label: 'Last Week', value: 'last_week' },
  { label: 'This Month', value: 'this_month' },
  { label: 'Last Month', value: 'last_month' },
  { label: 'This Year', value: 'this_year' },
  { label: 'Last Year', value: 'last_year' },
];

const Dashboard: React.FC = () => {
  const [timePeriod, setTimePeriod] = useState(TIME_PERIODS[2]?.value);
  const [reload, setReload] = useState<Date | null>(null);

  const reloadKPIs = () => {
    setReload(new Date());
  };

  const [tab, setTab] = useState(0);

  const handleTabChange = (_e: React.SyntheticEvent, newTab: number) => {
    setTab(newTab);
  };

  function a11yProps(index: number) {
    return {
      id: `tab-${index}`,
      'aria-controls': `tabpanel-${index}`,
    };
  }

  const renderTabContent = () => {
    switch (tab) {
      case 0:
        return <TrafficAnalytics timePeriod={timePeriod} reload={reload} />;
      case 1:
        return <SearchAnalytics timePeriod={timePeriod} reload={reload} />;
      case 2:
        return (
          <ProductAndCartAnalytics timePeriod={timePeriod} reload={reload} />
        );
      case 3:
        return (
          <RevenueAndConversionAnalytics
            timePeriod={timePeriod}
            reload={reload}
          />
        );
      case 4:
        return (
          <UserBehaviorAndFunnelAnalytics
            timePeriod={timePeriod}
            reload={reload}
          />
        );
      default:
        return <TrafficAnalytics timePeriod={timePeriod} reload={reload} />;
    }
  };

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
        }}
      >
        <Typography variant="h5" fontWeight={600}>
          Dashboard
        </Typography>
        <Box>
          <FormControl sx={{ minWidth: 120 }} size="small">
            <InputLabel id="range-select-label">Time Period</InputLabel>
            <Select
              labelId="range-select-label"
              id="range-select"
              value={timePeriod}
              label="Time Period"
              onChange={(e) => setTimePeriod(e.target.value as any)}
            >
              {TIME_PERIODS.map((period) => (
                <MenuItem key={period.value} value={period?.value}>
                  {period.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <IconButton sx={{ ml: 1 }} aria-label="reload" onClick={reloadKPIs}>
            <RefreshIcon color="primary" />
          </IconButton>
        </Box>
      </Box>
      <Box mt={-1} mb={1}>
        <Tabs
          value={tab}
          onChange={handleTabChange}
          aria-label="Kpi's"
          className="dashboard-tab-container"
          variant="scrollable"
          allowScrollButtonsMobile
        >
          <Tab label="Traffic & Engagement" {...a11yProps(0)} />
          <Tab label="Search" {...a11yProps(1)} />
          <Tab label="Product & Cart" {...a11yProps(2)} />
          <Tab label="Revenue & Conversion" {...a11yProps(3)} />
          <Tab label="User Behavior & Funnel" {...a11yProps(4)} />
        </Tabs>
      </Box>

      <Box mt={3}>
        <ErrorBoundary reset={tab}>{renderTabContent()}</ErrorBoundary>
      </Box>
    </Box>
  );
};

export default Dashboard;
