import React, { useEffect } from 'react';
import { useFetch } from '../../hooks/useFetch';
import {
  BasicAnalyticsProps,
  FunnelItem,
  UserBehaviorAndFunnelAnalyticsData,
} from '../../models/analytics.interface';
import {
  Box,
  Card,
  CardContent,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import Spinner from '../../components/Spinner';
import ErrorCard from '../../components/ErrorCard';
import { PieChart } from '@mui/x-charts';

interface UserBehaviorAndFunnelAnalyticsProps extends BasicAnalyticsProps {}

const UserBehaviorAndFunnelAnalytics = ({
  timePeriod,
  reload,
}: UserBehaviorAndFunnelAnalyticsProps) => {
  const { data, loading, error, fetchData } =
    useFetch<UserBehaviorAndFunnelAnalyticsData>(
      '/analytics/user-behavior-and-funnel'
    );

  useEffect(() => {
    if (timePeriod || reload !== null) {
      fetchData({ query: `period=${timePeriod}` });
    }
  }, [timePeriod, reload]);

  const renderContent = () => {
    return (
      <Box>
        <Card>
          <CardContent>
            <Typography variant="subtitle1" gutterBottom>
              User Device Distribution
            </Typography>
            <PieChart
              series={[
                {
                  arcLabel: (item) => `${item.value}`,
                  highlightScope: { fade: 'global', highlight: 'item' },
                  innerRadius: 40,
                  outerRadius: 100,
                  data:
                    data?.devices?.map(({ device, uniqueUsersCount }) => ({
                      id: device,
                      label: device?.toUpperCase(),
                      value: uniqueUsersCount,
                    })) || [],
                },
              ]}
              width={200}
              height={200}
            />
          </CardContent>
        </Card>
        
        <TableContainer component={Paper} sx={{ mt: 2 }}>
          <Typography variant="h6" sx={{ p: 2 }}>
            User Journey (Funnel)
          </Typography>

          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Step</TableCell>
                <TableCell>Event</TableCell>
                <TableCell align="right">Users</TableCell>
                <TableCell align="right">Conversion</TableCell>
                <TableCell align="right">Drop-off</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {data?.funnel?.map((row, index) => {
                const prev = data?.funnel?.[index - 1]?.uniqueUsersCount;
                const conversion =
                  index === 0
                    ? '100%'
                    : ((row.uniqueUsersCount / prev) * 100).toFixed(1) + '%';

                const dropOff =
                  index === 0
                    ? '0%'
                    : (((prev - row.uniqueUsersCount) / prev) * 100).toFixed(
                        1
                      ) + '%';

                return (
                  <TableRow key={row.eventType}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{row.eventType}</TableCell>
                    <TableCell align="right">{row.uniqueUsersCount}</TableCell>
                    <TableCell align="right">{conversion}</TableCell>
                    <TableCell align="right">{dropOff}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    );
  };

  return (
    <Box>
      {loading ? (
        <Spinner />
      ) : error ? (
        <ErrorCard message={error?.message} />
      ) : (
        renderContent()
      )}
    </Box>
  );
};

export default UserBehaviorAndFunnelAnalytics;
