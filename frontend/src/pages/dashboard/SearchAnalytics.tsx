import * as React from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Skeleton,
} from '@mui/material';

import SearchIcon from '@mui/icons-material/Search';
import { BarChart } from '@mui/x-charts';
import { SearchAnalyticsData } from '../../models/analytics.interface';
import { FetchError } from '../../hooks/useFetch';
import { StatCard } from '../../components/StateCard';
import { COLORS_COMBINATION } from '../../models/constant';
import ErrorCard from '../../components/ErrorCard';

interface SearchAnalyticsProps extends SearchAnalyticsData {
  error?: FetchError | null;
  loading?: boolean;
}

export default function SearchAnalytics({
  totalSearches = [],
  topQueries = [],
  zeroResultQueries = [],
  loading,
  error,
}: SearchAnalyticsProps) {
  const loader = <Skeleton variant="rounded" height={100} />;
  const renderContent = () => {
    return (
      <Box>
        <StatCard
          label=" Total Searches"
          value={totalSearches?.[0]?.count ?? 0}
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
                  data: topQueries.map((q) => q.query),
                  width: 140,
                },
              ]}
              series={[
                {
                  data: topQueries.map((q) => q.searches),
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

            {zeroResultQueries.length === 0 ? (
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
                    {zeroResultQueries.map((q, idx) => (
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
      {/* KPI CARDS */}
      <Typography variant="h6" mb={2}>
        Search Analytics
      </Typography>
      {loading ? (
        loader
      ) : error ? (
        <ErrorCard message={error?.message} />
      ) : (
        renderContent()
      )}
    </Box>
  );
}
