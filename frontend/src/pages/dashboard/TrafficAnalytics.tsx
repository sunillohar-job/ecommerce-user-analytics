import React, { useEffect } from 'react';
import { Box, Grid, Skeleton, Typography } from '@mui/material';

import { BarChart, LineChart } from '@mui/x-charts';
import {
  BasicAnalyticsProps,
  TrafficAnalyticsData,
} from '../../models/analytics.interface';
import dayjs from 'dayjs';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import TimelineIcon from '@mui/icons-material/Timeline';
import { StatCard } from '../../components/StateCard';
import { COLORS_COMBINATION } from '../../models/constant';
import { useFetch } from '../../hooks/useFetch';
import ErrorCard from '../../components/ErrorCard';
import Spinner from '../../components/Spinner';
import { useTranslation } from 'react-i18next';

interface TrafficAnalyticsProps extends BasicAnalyticsProps {}

const TrafficAnalytics = ({ timePeriod, reload }: TrafficAnalyticsProps) => {
  const { t } = useTranslation();
  const { data, loading, error, fetchData } =
    useFetch<TrafficAnalyticsData>('/analytics/traffic');

  useEffect(() => {
    if (timePeriod || reload !== null) {
      fetchData({ query: `period=${timePeriod}` });
    }
  }, [timePeriod, reload]);

  const renderContent = () => {
    return (
      <>
        <Grid container spacing={{ xs: 2, md: 20 }}>
          <Grid size={{ xs: 12, md: 6 }}>
            <StatCard
              label={t('dashboard.trafficEngagement.totalSessions')}
              value={data?.totalSessions?.[0]?.count ?? 0}
              icon={<TimelineIcon />}
              bgColor={COLORS_COMBINATION.BLUE.bg}
              fgColor={COLORS_COMBINATION.BLUE.fg}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <StatCard
              label={t('dashboard.trafficEngagement.activeUsers')}
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
            {t('dashboard.trafficEngagement.pageViewsByPage')}
          </Typography>

          <BarChart
            height={300}
            xAxis={[
              {
                scaleType: 'band',
                data:
                  data?.pageViewsByPage?.map((p) => p?.page ?? 'unknown') || [],
              },
            ]}
            series={[
              {
                data: data?.pageViewsByPage?.map((p) => p?.views ?? 0) || [],
                label: t('dashboard.trafficEngagement.views'),
              },
            ]}
            localeText={{
              noData: t('dashboard.noDataToDisplay'),
            }}
          />
        </Box>

        {/* SESSIONS OVER TIME LINE CHART */}
        <Box mt={4}>
          <Typography variant="subtitle1" gutterBottom>
            {t('dashboard.trafficEngagement.sessionsOverTime')}
          </Typography>

          <LineChart
            height={300}
            xAxis={[
              {
                scaleType: 'time',
                data:
                  data?.sessionsOverTime?.map(
                    (s) => new Date(s.date ?? null)
                  ) || [],
                valueFormatter: (date: Date) =>
                  dayjs(date).format('DD MMM YYYY'),
              },
            ]}
            series={[
              {
                data: data?.sessionsOverTime?.map((s) => s.sessions ?? 0) || [],
                label: t('dashboard.trafficEngagement.sessions'),
              },
            ]}
            localeText={{
              noData: t('dashboard.noDataToDisplay'),
            }}
          />
        </Box>
      </>
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

export default TrafficAnalytics;
