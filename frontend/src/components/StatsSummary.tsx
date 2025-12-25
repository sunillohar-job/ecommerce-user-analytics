import React from 'react';
import { Card, CardContent, Typography, Box, Grid } from '@mui/material';
import TimelineIcon from '@mui/icons-material/Timeline';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';

/* ---------- Types ---------- */

export interface StatsData {
  totalEvents: number;
  totalQuantity: number;
  totalAmount: number;
}

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  color: 'primary' | 'success' | 'warning';
}

/* ---------- Reusable Card ---------- */

const StatCard: React.FC<StatCardProps> = ({ label, value, icon, color }) => {
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
              bgcolor: `${color}.light`,
              color: `${color}.main`,
              p: 1.3,
              borderRadius: '50%',
              display: 'flex',
            }}
          >
            {icon}
          </Box>

          <Box>
            <Typography variant="body2" color="text.secondary">
              {label}
            </Typography>
            <Typography variant="h6" fontWeight={600}>
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
      <Grid size={{ xs: 12, sm: 4 }}>
        <StatCard
          label="Total Events"
          value={stats.totalEvents}
          icon={<TimelineIcon />}
          color="primary"
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 4 }}>
        <StatCard
          label="Total Quantity"
          value={stats.totalQuantity}
          icon={<ShoppingCartIcon />}
          color="success"
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 4 }}>
        <StatCard
          label="Total Purchased"
          value={`₹ ${stats.totalAmount}`}
          icon={<CurrencyRupeeIcon />}
          color="warning"
        />
      </Grid>
    </Grid>
  );
};

export default StatsSummary;
