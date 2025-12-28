import React, { useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';

import SearchIcon from '@mui/icons-material/Search';
import { BarChart } from '@mui/x-charts';
import {
  BasicAnalyticsProps,
  SearchAnalyticsData,
} from '../../models/analytics.interface';
import { useFetch } from '../../hooks/useFetch';
import { StatCard } from '../../components/StateCard';
import { COLORS_COMBINATION } from '../../models/constant';
import ErrorCard from '../../components/ErrorCard';
import Spinner from '../../components/Spinner';

interface SearchAnalyticsProps extends BasicAnalyticsProps {}

export default function SearchAnalytics({
  timePeriod,
  reload,
}: SearchAnalyticsProps) {
  const { data, loading, error, fetchData } =
    useFetch<SearchAnalyticsData>('/analytics/search');

  useEffect(() => {
    if (timePeriod || reload !== null) {
      fetchData({ query: `period=${timePeriod}` });
    }
  }, [timePeriod, reload]);

  const renderContent = () => {
    return (
      <Box>
        <StatCard
          label=" Total Searches"
          value={data?.totalSearches?.[0]?.count ?? 0}
          icon={<SearchIcon />}
          bgColor={COLORS_COMBINATION.BLUE.bg}
          fgColor={COLORS_COMBINATION.BLUE.fg}
          width="300px"
        />

        <Card sx={{ mt: 2 }}>
          <CardContent>
            <Typography variant="subtitle1" gutterBottom>
              Top Search Queries
            </Typography>

            <BarChart
              height={300}
              layout="horizontal"
              yAxis={[
                {
                  scaleType: 'band',
                  data: data?.topQueries?.map((q) => q.query) || [],
                  width: 140,
                },
              ]}
              series={[
                {
                  data: data?.topQueries?.map((q) => q.searches) || [],
                  label: 'Searches',
                },
              ]}
              xAxis={[
                {
                  min: 0,
                  tickMinStep: 1,
                },
              ]}
            />
          </CardContent>
        </Card>

        <Card sx={{ mt: 2 }}>
          <CardContent>
            <Typography variant="subtitle1" gutterBottom>
              Zero Result Searches
            </Typography>

            {data?.zeroResultQueries?.length === 0 ? (
              <Typography color="text.secondary">
                No zero-result searches found 🎉
              </Typography>
            ) : (
              <Paper variant="outlined">
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Query</TableCell>
                      <TableCell align="right">Searches</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data?.zeroResultQueries?.map((q, idx) => (
                      <TableRow key={idx}>
                        <TableCell>{q.query}</TableCell>
                        <TableCell align="right">{q.searches}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Paper>
            )}
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
