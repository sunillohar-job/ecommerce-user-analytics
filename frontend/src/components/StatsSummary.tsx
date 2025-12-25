import React from 'react';
import { Card, CardContent, Typography, Box, Grid } from '@mui/material';
import TimelineIcon from '@mui/icons-material/Timeline';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import FilterAltIcon from '@mui/icons-material/FilterAlt';

const KPI_COLORS = {
  EVENTS: {
    bg: '#E3F2FD',
    fg: '#1976D2',
  },
  QUANTITY: {
    bg: '#FFF3E0',
    fg: '#FB8C00',
  },
  REVENUE: {
    bg: '#E8F5E9',
    fg: '#2E7D32',
  },
  CONVERSION: {
    bg: '#F3E5F5',
    fg: '#6A1B9A',
  },
};

export interface StatsData {
  totalEvents: number;
  totalQuantity: number;
  totalAmount: number;
  conversionRate: number;
}

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  bgColor: string;
  fgColor: string;
}

type RateColor = 'error.main' | 'warning.main' | 'info.main' | 'success.main';

const getConversionTextColor = (rate: number | string): RateColor => {
  rate = parseFloat(rate as string);
  if (rate === 0) return 'error.main';
  if (rate < 2) return 'warning.main';
  if (rate < 5) return 'info.main';
  return 'success.main';
};

/* ---------- Reusable Card ---------- */

const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  icon,
  bgColor,
  fgColor,
}) => {
  return (
    <Card
      elevation={1}
      sx={{
        borderRadius: 2,
        height: '100%',
      }}
    >
      <CardContent>
        <Box display="flex" alignItems="center" gap={2}>
          <Box
            sx={{
              bgcolor: bgColor,
              color: fgColor,
              p: 1.3,
              borderRadius: '50%',
              display: 'flex',
            }}
          >
            {icon}
          </Box>

          <Box >
            <Typography variant="body2" color="text.secondary">
              {label}
            </Typography>
            <Typography color={label === "Conversion Rate" ? getConversionTextColor(value) : "text.secondary"} variant="h6" fontWeight={600}>
              {value}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

/* ---------- Main Component ---------- */

const StatsSummary: React.FC<{ stats: StatsData }> = ({ stats }) => {
  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, sm: 3 }}>
        <StatCard
          label="Total Events"
          value={stats.totalEvents}
          icon={<TimelineIcon />}
          bgColor={KPI_COLORS.EVENTS.bg}
          fgColor={KPI_COLORS.EVENTS.fg}
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 3 }}>
        <StatCard
          label="Total Quantity"
          value={stats.totalQuantity}
          icon={<ShoppingCartIcon />}
          bgColor={KPI_COLORS.QUANTITY.bg}
          fgColor={KPI_COLORS.QUANTITY.fg}
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 3 }}>
        <StatCard
          label="Total Purchased"
          value={`₹ ${stats.totalAmount}`}
          icon={<CurrencyRupeeIcon />}
          bgColor={KPI_COLORS.REVENUE.bg}
          fgColor={KPI_COLORS.REVENUE.fg}
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 3 }}>
        <StatCard
          label="Conversion Rate"
          value={`${stats.conversionRate}%`}
          icon={<FilterAltIcon />}
          bgColor={KPI_COLORS.CONVERSION.bg}
          fgColor={KPI_COLORS.CONVERSION.fg}
        />
      </Grid>
    </Grid>
  );
};

export default StatsSummary;
