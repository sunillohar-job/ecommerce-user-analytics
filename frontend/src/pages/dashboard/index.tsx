import React, { useMemo, useState } from 'react';
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
  useMediaQuery,
  useTheme,
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import TrafficAnalytics from './TrafficAnalytics';
import SearchAnalytics from './SearchAnalytics';
import ProductAndCartAnalytics from './ProductAndCartAnalytics';
import RevenueAndConversionAnalytics from './RevenueAndConversionAnalytics';
import UserBehaviorAndFunnelAnalytics from './UserBehaviorAndFunnelAnalytics';
import { ErrorBoundary } from '../../components/ErrorBoundary';
import { useTranslation } from 'react-i18next';

const Dashboard: React.FC = () => {
  const { t } = useTranslation();

  const TIME_PERIODS = useMemo(
    () => [
      {
        value: 'today',
        label: t('dashboard.timePeriods.today'),
      },
      {
        value: 'yesterday',
        label: t('dashboard.timePeriods.yesterday'),
      },
      {
        value: 'last_7_days',
        label: t('dashboard.timePeriods.last7Days'),
      },
      {
        value: 'this_week',
        label: t('dashboard.timePeriods.thisWeek'),
      },
      {
        value: 'last_week',
        label: t('dashboard.timePeriods.lastWeek'),
      },
      {
        value: 'this_month',
        label: t('dashboard.timePeriods.thisMonth'),
      },
      {
        value: 'last_month',
        label: t('dashboard.timePeriods.lastMonth'),
      },
      {
        value: 'this_year',
        label: t('dashboard.timePeriods.thisYear'),
      },
      {
        value: 'last_year',
        label: t('dashboard.timePeriods.lastYear'),
      },
    ],
    [t]
  );
  const KPIS_TABS = useMemo(
    () => [
      t('dashboard.trafficEngagement.title'),
      t('dashboard.search.title'),
      t('dashboard.productCart.title'),
      t('dashboard.revenueConversion.title'),
      t('dashboard.userBehaviorFunnel.title'),
    ],
    [t]
  );

  const [timePeriod, setTimePeriod] = useState(TIME_PERIODS[2]?.value);
  const [reload, setReload] = useState<Date | null>(null);
  const theme = useTheme();
  const isMediumDevice = useMediaQuery(theme.breakpoints.down('lg'));

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
          {t('dashboard.title')}
        </Typography>
        <Box>
          <FormControl sx={{ minWidth: 120 }} size="small">
            <InputLabel id="range-select-label">
              {t('dashboard.timePeriods.title')}
            </InputLabel>
            <Select
              labelId="range-select-label"
              id="range-select"
              value={timePeriod}
              label={t('dashboard.timePeriods.title')}
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
        {isMediumDevice ? (
          <FormControl sx={{ width: '100%', mt: 1 }} size="small">
            <InputLabel id="range-select-label">
              {t('dashboard.kpiMetrics')}
            </InputLabel>
            <Select
              labelId="range-select-label"
              id="range-select"
              value={tab}
              label={t('dashboard.kpiMetrics')}
              onChange={(e) =>
                handleTabChange(
                  e as React.SyntheticEvent,
                  parseInt(e.target.value as any)
                )
              }
            >
              {KPIS_TABS.map((kpi, index) => (
                <MenuItem key={index} value={index}>
                  {kpi}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        ) : (
          <Tabs
            value={tab}
            onChange={handleTabChange}
            aria-label="Kpi's"
            className="dashboard-tab-container"
          >
            {KPIS_TABS.map((kpi, index) => (
              <Tab key={index} label={kpi} {...a11yProps(0)} />
            ))}
          </Tabs>
        )}
      </Box>

      <Box mt={3}>
        <ErrorBoundary reset={`${tab}-${reload}-${timePeriod}`}>
          {renderTabContent()}
        </ErrorBoundary>
      </Box>
    </Box>
  );
};

export default Dashboard;
