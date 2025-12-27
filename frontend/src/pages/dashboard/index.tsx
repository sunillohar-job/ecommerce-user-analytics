import React, { useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  CircularProgress,
} from '@mui/material';
import { useFetch } from '../../hooks/useFetch';
import RefreshIcon from '@mui/icons-material/Refresh';
import {
  ProductAndCartAnalyticsData,
  SearchAnalyticsData,
  TrafficAnalyticsData,
} from '../../models/analytics.interface';
import TrafficAnalytics from './TrafficAnalytics';
import SearchAnalytics from './SearchAnalytics';
import ProductAndCartAnalytics from './ProductAndCartAnalytics';

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
  const [timePeriod, setTimePeriod] = React.useState(TIME_PERIODS[2]?.value);
  const {
    data: trafficData,
    loading: trafficLoading,
    error: trafficError,
    fetchData: fetchTrafficData,
  } = useFetch<TrafficAnalyticsData>('/analytics/traffic');
  const {
    data: searchData,
    loading: searchLoading,
    error: searchError,
    fetchData: fetchSearchData,
  } = useFetch<SearchAnalyticsData>('/analytics/search');
  const {
    data: productAndCardData,
    loading: productAndCardDataLoading,
    error: productAndCardDataError,
    fetchData: fetchProductAndCardDataData,
  } = useFetch<ProductAndCartAnalyticsData>('/analytics/product-and-cart');

  useEffect(() => {
    reloadKPIs();
  }, [timePeriod]);

  const renderTrafficKPISection = () => {
    return (
      <Box>
        <TrafficAnalytics
          totalSessions={trafficData?.totalSessions}
          activeUsers={trafficData?.activeUsers}
          pageViewsByPage={trafficData?.pageViewsByPage}
          sessionsOverTime={trafficData?.sessionsOverTime}
          loading={trafficLoading}
          error={trafficError}
        />
      </Box>
    );
  };

  const renderSearchKPISection = () => {
    return (
      <SearchAnalytics
        loading={searchLoading}
        error={searchError}
        totalSearches={searchData?.totalSearches}
        topQueries={searchData?.topQueries}
        zeroResultQueries={searchData?.zeroResultQueries}
      />
    );
  };

  const renderProductAndCartSection = () => {
    return (
      <ProductAndCartAnalytics
        loading={productAndCardDataLoading}
        error={productAndCardDataError}
        cartActions={productAndCardData?.cartActions}
        topProducts={productAndCardData?.topProducts}
      />
    );
  };

  const renderKPISection = () => {
    return (
      <Box>
        {renderTrafficKPISection()}
        <Divider sx={{ my: 2 }} />
        {renderSearchKPISection()}
        <Divider sx={{ my: 2 }} />
        {renderProductAndCartSection()}
      </Box>
    );
  };

  const reloadKPIs = () => {
    fetchTrafficData({ query: `period=${timePeriod}` });
    fetchSearchData({ query: `period=${timePeriod}` });
    fetchProductAndCardDataData({ query: `period=${timePeriod}` });
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
      {renderKPISection()}
    </Box>
  );
};

export default Dashboard;
