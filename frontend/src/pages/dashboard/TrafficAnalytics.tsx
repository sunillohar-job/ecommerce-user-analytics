import * as React from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Skeleton,
  Typography,
} from '@mui/material';

import { BarChart, LineChart } from '@mui/x-charts';
import { TrafficAnalyticsData } from '../../models/analytics.interface';
import dayjs from 'dayjs';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import TimelineIcon from '@mui/icons-material/Timeline';
import { StatCard } from '../../components/StateCard';
import { COLORS_COMBINATION } from '../../models/constant';
import { FetchError } from '../../hooks/useFetch';
import ErrorCard from '../../components/ErrorCard';

interface TrafficAnalyticsProps extends TrafficAnalyticsData {
  error?: FetchError | null;
  loading?: boolean;
}

const defaultCountMetric = [{ count: 0 }];
export default function TrafficAnalytics({
  error,
  loading,
  totalSessions = defaultCountMetric,
  activeUsers = defaultCountMetric,
  pageViewsByPage = [],
  sessionsOverTime = [],
}: TrafficAnalyticsProps) {
  const renderContent = () => {
    return (
      <>
        <Grid container spacing={20}>
          <Grid size={{ xs: 12, md: 6 }}>
            <StatCard
              label="Total Sessions"
              value={totalSessions?.[0]?.count ?? 0}
              icon={<TimelineIcon />}
              bgColor={COLORS_COMBINATION.BLUE.bg}
              fgColor={COLORS_COMBINATION.BLUE.fg}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <StatCard
              label="Active Users"
              value={activeUsers?.[0]?.count ?? 0}
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
                data: pageViewsByPage?.map((p) => p.page),
              },
            ]}
            series={[
              {
                data: pageViewsByPage?.map((p) => p.views),
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
                data: sessionsOverTime?.map((s) => new Date(s.date)),
                valueFormatter: (date: Date) =>
                  dayjs(date).format('DD MMM YYYY, HH:mm'),
              },
            ]}
            series={[
              {
                data: sessionsOverTime?.map((s) => s.sessions),
                label: 'Sessions',
              },
            ]}
          />
        </Box>
      </>
    );
  };

  const loader = <Skeleton variant="rounded" height={100} />;

  return (
    <Box>
      {/* KPI CARDS */}
      <Typography variant="h6" mb={2}>
        Traffic & Engagement Overview
      </Typography>
      {loading ? loader : error ? <ErrorCard message={error?.message} /> : renderContent()}
    </Box>
  );
}
