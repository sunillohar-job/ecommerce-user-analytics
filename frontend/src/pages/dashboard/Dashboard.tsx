import React from 'react';
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
} from '@mui/material';

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

const Dashboard: React.FC = () => {
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

  return (
    <Box>
      <Typography variant="h5" fontWeight={600} mb={3}>
        Dashboard
      </Typography>

      {/* Stats Section */}
      <Grid container spacing={2} mb={3}>
        {stats.map((stat) => (
          <Grid item xs={12} sm={6} md={3} key={stat.title}>
            <StatCard title={stat.title} value={stat.value} />
          </Grid>
        ))}
      </Grid>

      {/* Activity Section */}
      <Card>
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
      </Card>
    </Box>
  );
};

export default Dashboard;
