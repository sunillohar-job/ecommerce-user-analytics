import React, { useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Skeleton,
} from '@mui/material';

import { BarChart } from '@mui/x-charts';
import {
  BasicAnalyticsProps,
  ProductAndCartAnalyticsData,
} from '../../models/analytics.interface';
import { useFetch } from '../../hooks/useFetch';
import { StatCard } from '../../components/StateCard';
import { COLORS_COMBINATION } from '../../models/constant';
import ErrorCard from '../../components/ErrorCard';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import RemoveShoppingCartIcon from '@mui/icons-material/RemoveShoppingCart';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import PercentIcon from '@mui/icons-material/Percent';
import Spinner from '../../components/Spinner';
import { useTranslation } from 'react-i18next';

interface ProductAndCartAnalyticsProps extends BasicAnalyticsProps {}

export default function ProductAndCartAnalytics({
  timePeriod,
  reload,
}: ProductAndCartAnalyticsProps) {
  const { t } = useTranslation();
  const { data, loading, error, fetchData } =
    useFetch<ProductAndCartAnalyticsData>('/analytics/product-and-cart');

  useEffect(() => {
    if (timePeriod || reload !== null) {
      fetchData({ query: `period=${timePeriod}` });
    }
  }, [timePeriod, reload]);

  const {
    ADD_TO_CART = 0,
    REMOVE_FROM_CART = 0,
    ORDER_PLACED = 0,
  } = data?.cartActions?.reduce<Record<string, number>>(
    (acc, { eventType, count }) => {
      acc[eventType || ''] = count ?? 0;
      return acc;
    },
    {}
  ) ?? {};

  const renderContent = () => {
    return (
      <Box>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, lg: 3 }}>
            <StatCard
              label={t('dashboard.productCart.addToCart')}
              value={ADD_TO_CART}
              icon={<AddShoppingCartIcon />}
              bgColor={COLORS_COMBINATION.GREEN.bg}
              fgColor={COLORS_COMBINATION.GREEN.fg}
            />
          </Grid>

          <Grid size={{ xs: 12, lg: 3 }}>
            <StatCard
              label={t('dashboard.productCart.removeFromCart')}
              value={REMOVE_FROM_CART}
              icon={<RemoveShoppingCartIcon />}
              bgColor={COLORS_COMBINATION.RED.bg}
              fgColor={COLORS_COMBINATION.RED.fg}
            />
          </Grid>

          <Grid size={{ xs: 12, lg: 3 }}>
            <StatCard
              label={t('dashboard.productCart.orderPlaced')}
              value={ORDER_PLACED}
              icon={<AttachMoneyIcon />}
              bgColor={COLORS_COMBINATION.GREEN.bg}
              fgColor={COLORS_COMBINATION.GREEN.fg}
            />
          </Grid>

          <Grid size={{ xs: 12, lg: 3 }}>
            <StatCard
              label={t('dashboard.productCart.cartToOrder')}
              value={`${((ORDER_PLACED / ADD_TO_CART) * 100 || 0)?.toFixed(
                2
              )}%`}
              icon={<PercentIcon />}
              bgColor={COLORS_COMBINATION.ORANGE.bg}
              fgColor={COLORS_COMBINATION.ORANGE.fg}
            />
          </Grid>
        </Grid>

        <Card sx={{ mt: 2 }}>
          <CardContent>
            <Typography variant="subtitle1" gutterBottom>
              {t('dashboard.productCart.topProductsAdded')}
            </Typography>

            <BarChart
              height={300}
              layout="horizontal"
              yAxis={[
                {
                  scaleType: 'band',
                  data:
                    data?.topProducts?.map((q) => q?.name ?? 'unknown') || [],
                  width: 100,
                },
              ]}
              series={[
                {
                  data: data?.topProducts?.map((q) => q?.quantity ?? 0) || [],
                  label: t('dashboard.productCart.quantity'),
                },
              ]}
              xAxis={[
                {
                  min: 0,
                  tickMinStep: 1,
                },
              ]}
              localeText={{
                noData: t('dashboard.noDataToDisplay'),
              }}
            />
          </CardContent>
        </Card>
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
}
