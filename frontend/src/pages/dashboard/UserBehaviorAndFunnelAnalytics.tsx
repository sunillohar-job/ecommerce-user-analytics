import React, { useEffect } from 'react';
import { useFetch } from '../../hooks/useFetch';
import {
  BasicAnalyticsProps,
  UserBehaviorAndFunnelAnalyticsData,
} from '../../models/analytics.interface';
import { Box } from '@mui/material';
import Spinner from '../../components/Spinner';
import ErrorCard from '../../components/ErrorCard';

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
    return null;
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
