import React, { useEffect } from 'react';
import { Box, Grid, Skeleton, Typography } from '@mui/material';

import { BarChart, LineChart } from '@mui/x-charts';
import { TrafficAnalyticsData } from '../../models/analytics.interface';
import dayjs from 'dayjs';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import TimelineIcon from '@mui/icons-material/Timeline';
import { StatCard } from '../../components/StateCard';
import { COLORS_COMBINATION } from '../../models/constant';
import { useFetch } from '../../hooks/useFetch';
import ErrorCard from '../../components/ErrorCard';

interface TrafficAnalyticsProps {
  timePeriod: string;
  reload: Date | null;
}

const TrafficAnalytics = ({ timePeriod, reload }: TrafficAnalyticsProps) => {
  const { data, loading, error, fetchData } =
    useFetch<TrafficAnalyticsData>('/analytics/traffic');

  console.log('***', loading);

  useEffect(() => {
    if (timePeriod || reload !== null) {
      fetchData({ query: `period=${timePeriod}` });
    }
  }, [timePeriod, reload]);

  const loader = <Skeleton variant="rounded" height={100} />;

  const renderContent = () => {
    return (
      <>
        <Grid container spacing={20}>
          <Grid size={{ xs: 12, md: 6 }}>
            <StatCard
              label="Total Sessions"
              value={data?.totalSessions?.[0]?.count ?? 0}
              icon={<TimelineIcon />}
              bgColor={COLORS_COMBINATION.BLUE.bg}
              fgColor={COLORS_COMBINATION.BLUE.fg}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <StatCard
              label="Active Users"
              value={data?.activeUsers?.[0]?.count ?? 0}
              icon={<GroupsOutlinedIcon />}
              bgColor={COLORS_COMBINATION.GREEN.bg}
              fgColor={COLORS_COMBINATION.GREEN.fg}
            />
          </Grid>
        </Grid>

        {/* PAGE VIEWS BAR CHART */}
        <Box mt={4}>
          <Typography variant="subtitle1" gutterBottom>
            Page Views by Page
          </Typography>

          <BarChart
            height={300}
            xAxis={[
              {
                scaleType: 'band',
                data: data?.pageViewsByPage?.map((p) => p.page) || [],
              },
            ]}
            series={[
              {
                data: data?.pageViewsByPage?.map((p) => p.views) || [],
                label: 'Views',
              },
            ]}
          />
        </Box>

        {/* SESSIONS OVER TIME LINE CHART */}
        <Box mt={4}>
          <Typography variant="subtitle1" gutterBottom>
            Sessions Over Time
          </Typography>

          <LineChart
            height={300}
            xAxis={[
              {
                scaleType: 'time',
                data:
                  data?.sessionsOverTime?.map((s) => new Date(s.date)) || [],
                valueFormatter: (date: Date) =>
                  dayjs(date).format('DD MMM YYYY'),
              },
            ]}
            series={[
              {
                data: data?.sessionsOverTime?.map((s) => s.sessions) || [],
                label: 'Sessions',
              },
            ]}
          />
        </Box>
      </>
    );
  };

  return (
    <Box>
      {loading ? (
        loader
      ) : error ? (
        <ErrorCard message={error?.message} />
      ) : (
        renderContent()
      )}
    </Box>
  );
};

export default TrafficAnalytics;
