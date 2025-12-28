import React, { useEffect } from 'react';
import { useFetch } from '../../hooks/useFetch';
import {
  BasicAnalyticsProps,
  RevenueAndConversionAnalyticsData,
} from '../../models/analytics.interface';

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
  return null;
};

export default RevenueAndConversionAnalytics;
