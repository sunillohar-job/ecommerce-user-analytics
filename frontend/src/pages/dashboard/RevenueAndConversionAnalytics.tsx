import React, { useEffect } from 'react';
import { useFetch } from '../../hooks/useFetch';
import {
  BasicAnalyticsProps,
  RevenueAndConversionAnalyticsData,
} from '../../models/analytics.interface';
import { Box, Grid, Typography } from '@mui/material';
import Spinner from '../../components/Spinner';
import ErrorCard from '../../components/ErrorCard';
import { StatCard } from '../../components/StateCard';
import { COLORS_COMBINATION } from '../../models/constant';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import FunctionsIcon from '@mui/icons-material/Functions';
import { LineChart } from '@mui/x-charts';
import dayjs from 'dayjs';

interface RevenueAndConversionAnalyticsProps extends BasicAnalyticsProps {}

const RevenueAndConversionAnalytics = ({
  timePeriod,
  reload,
}: RevenueAndConversionAnalyticsProps) => {
  const { data, loading, error, fetchData } =
    useFetch<RevenueAndConversionAnalyticsData>(
      '/analytics/revenue-and-conversion'
    );

  useEffect(() => {
    if (timePeriod || reload !== null) {
      fetchData({ query: `period=${timePeriod}` });
    }
  }, [timePeriod, reload]);

  const renderContent = () => {
    return (
      <Box>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 4 }}>
            <StatCard
              label="Total Orders"
              value={data?.revenueStats?.[0]?.orders || 0}
              icon={<ShoppingCartIcon />}
              bgColor={COLORS_COMBINATION.BLUE.bg}
              fgColor={COLORS_COMBINATION.BLUE.fg}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <StatCard
              label="Total Revenue"
              value={data?.revenueStats?.[0]?.revenue || 0}
              icon={<CurrencyRupeeIcon />}
              bgColor={COLORS_COMBINATION.GREEN.bg}
              fgColor={COLORS_COMBINATION.GREEN.fg}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <StatCard
              label="Avg Order Value"
              value={data?.revenueStats?.[0]?.avgOrderValue || 0}
              icon={<FunctionsIcon />}
              bgColor={COLORS_COMBINATION.ORANGE.bg}
              fgColor={COLORS_COMBINATION.ORANGE.fg}
            />
          </Grid>
        </Grid>

        <Box mt={4}>
          <Typography variant="subtitle1" gutterBottom>
            Order Over Time
          </Typography>

          <LineChart
            height={300}
            xAxis={[
              {
                scaleType: 'time',
                data:
                  data?.ordersOverTime?.map((s) => new Date(s.date ?? null)) || [],
                valueFormatter: (date: Date) =>
                  dayjs(date).format('DD MMM YYYY'),
              },
            ]}
            series={[
              {
                data: data?.ordersOverTime?.map((s) => s.orders ?? 0) || [],
                label: 'Orders',
              },
            ]}
          />
        </Box>
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

export default RevenueAndConversionAnalytics;
