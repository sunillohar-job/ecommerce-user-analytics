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

type StatCardProps = {
  title: string;
  value: string | number;
};

const StatCard: React.FC<StatCardProps> = ({ title, value }) => (
  <Card>
    <CardContent>
      <Typography variant="subtitle2" color="text.secondary">
        {title}
      </Typography>
      <Typography variant="h5" fontWeight={600}>
        {value}
      </Typography>
    </CardContent>
  </Card>
);

const TIME_PERIODS = [
  { label: 'Today', value: 'today' },
  { label: 'Yesterday', value: 'yesterday' },
  { label: 'Last 7 Days', value: 'last_7_days' },
  { label: 'This Week', value: 'this_week' },
  { label: 'Last Week', value: 'last_week' },
  { label: 'This Month', value: 'this_month' },
  { label: 'Last Month', value: 'last_month' },
];

const Dashboard: React.FC = () => {
  const [timePeriod, setTimePeriod] = React.useState(TIME_PERIODS[2]?.value);
  const { data, loading, error, fetchData } = useFetch<any>('/analytics');

  const fetchKPIData = () => {
    fetchData({ query: `period=${timePeriod}`, param: '/traffic' });
  };

  useEffect(() => {
    fetchKPIData();
  }, [timePeriod]);

  const stats = [
    { title: 'Total Users', value: 1245 },
    { title: 'Active Sessions', value: 312 },
    { title: 'Events Today', value: 8421 },
    { title: 'Conversion Rate', value: '3.4%' },
  ];

  const activities = [
    'User u1001 logged in',
    'Product 121 added to cart',
    'Checkout completed',
    'User u1005 searched "iphone 15"',
    'Session s1003 ended',
  ];

  const renderTrafficKPISection = () => {
    return (
      <Box>
        <Typography variant="subtitle1" mb={2}>
          Traffic & Engagement Overview
        </Typography>
        
      </Box>
    );
  };

  const renderKPISection = () => {
    return <Box>{renderTrafficKPISection()}</Box>;
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
          <IconButton sx={{ ml: 1 }} aria-label="reload" onClick={fetchKPIData}>
            <RefreshIcon color="primary" />
          </IconButton>
        </Box>
      </Box>
      {loading ? (
        <Box
          sx={{
            height: '300px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            p: 4,
          }}
        >
          <CircularProgress size={50} />
        </Box>
      ) : (
        renderKPISection()
      )}
      {/* Stats Section */}
      {/* <Grid container spacing={2} mb={3}>
        {stats.map((stat) => (
          <Grid item xs={12} sm={6} md={3} key={stat.title}>
            <StatCard title={stat.title} value={stat.value} />
          </Grid>
        ))}
      </Grid> */}
      {/* Activity Section */}
      {/* <Card>
        <CardContent>
          <Typography variant="h6" mb={2}>
            Recent Activity
          </Typography>

          <List disablePadding>
            {activities.map((activity, index) => (
              <React.Fragment key={index}>
                <ListItem>
                  <ListItemText primary={activity} />
                </ListItem>
                {index < activities.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </CardContent>
      </Card> */}
    </Box>
  );
};

export default Dashboard;
