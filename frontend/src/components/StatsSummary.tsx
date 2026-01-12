import React from 'react';
import { Grid } from '@mui/material';
import TimelineIcon from '@mui/icons-material/Timeline';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import { StatCard } from './StateCard';
import { COLORS_COMBINATION } from '../models/constant';


export interface StatsData {
  totalEvents: number;
  totalQuantity: number;
  totalAmount: number;
  conversionRate: number;
}

const StatsSummary: React.FC<{ stats: StatsData }> = ({ stats }) => {
  return (
    <Grid container spacing={2} mt={2}>
      <Grid size={{ xs: 12, lg: 3 }}>
        <StatCard
          label="Total Events"
          value={stats.totalEvents}
          icon={<TimelineIcon />}
          bgColor={COLORS_COMBINATION.BLUE.bg}
          fgColor={COLORS_COMBINATION.BLUE.fg}
        />
      </Grid>

      <Grid size={{ xs: 12, lg: 3 }}>
        <StatCard
          label="Total Quantity"
          value={stats.totalQuantity}
          icon={<ShoppingCartIcon />}
          bgColor={COLORS_COMBINATION.ORANGE.bg}
          fgColor={COLORS_COMBINATION.ORANGE.fg}
        />
      </Grid>

      <Grid size={{ xs: 12, lg: 3 }}>
        <StatCard
          label="Total Purchased"
          value={`₹ ${stats.totalAmount}`}
          icon={<AttachMoneyIcon />}
          bgColor={COLORS_COMBINATION.GREEN.bg}
          fgColor={COLORS_COMBINATION.GREEN.fg}
        />
      </Grid>

      <Grid size={{ xs: 12, lg: 3 }}>
        <StatCard
          label="Conversion Rate"
          value={`${stats.conversionRate}%`}
          icon={<FilterAltIcon />}
          bgColor={COLORS_COMBINATION.PURPLE.bg}
          fgColor={COLORS_COMBINATION.PURPLE.fg}
        />
      </Grid>
    </Grid>
  );
};

export default StatsSummary;
