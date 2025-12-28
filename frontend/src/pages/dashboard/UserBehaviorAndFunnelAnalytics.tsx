import React, { useEffect } from 'react';
import { useFetch } from '../../hooks/useFetch';
import {
  BasicAnalyticsProps,
  UserBehaviorAndFunnelAnalyticsData,
} from '../../models/analytics.interface';

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
  return null;
};

export default UserBehaviorAndFunnelAnalytics;
