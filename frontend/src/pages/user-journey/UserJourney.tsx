import React, { useState } from 'react';
import UserAutocomplete from '../../components/UserAutocomplete';
import { User } from '../../models/user.interface';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Box,
  Button,
  CircularProgress,
  Stack,
  Typography,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import './UserJourney.less';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { PickerValue } from '@mui/x-date-pickers/internals';
import { useFetch } from '../../hooks/useFetch';
import { UserJourneyResponse } from '../../models/user-journey.interface';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { SessionCard } from '../../components/SessionCard';
import StatsSummary from '../../components/StatsSummary';
import Spinner from '../../components/Spinner';

interface UserJourneyProps {}

const UserJourney: React.FC<UserJourneyProps> = () => {
  const [selectedUser, setSelectedUser] = useState<User>();
  const [fromDate, setFromDate] = React.useState<PickerValue>(dayjs());
  const [toDate, setToDate] = React.useState<PickerValue>(dayjs());
  const { data, loading, error, fetchData } =
    useFetch<UserJourneyResponse>('/users');

  const fetchHandler = async () => {
    fetchData({
      param: `/${selectedUser?.userId}/journeys`,
      query: `from=${fromDate?.startOf('day')?.toISOString()}&to=${toDate
        ?.endOf('day')
        ?.toISOString()}`,
    });
  };

  const renderSessions = () => {
    return (
      <>
        <StatsSummary
          stats={{
            totalEvents: data?.totalEvents || 0,
            totalQuantity: data?.totalPurchaseQuantity || 0,
            totalAmount: data?.totalPurchaseAmount || 0,
            conversionRate: data?.conversionRate || 0,
          }}
        />
        {data?.sessions.map((session, index) => (
          <SessionCard key={session.sessionId} session={session} />
        ))}
      </>
    );
  };

  return (
    <div className="user-journey-container">
      <Typography variant="h5" fontWeight={600} mb={3}>
        User Journey Sessions
      </Typography>

      <Stack
        direction={{ xs: 'column', md: 'row' }}
        spacing={2}
        alignItems={{ xs: 'stretch', md: 'center' }}
        sx={{ width: '100%' }}
      >
        <UserAutocomplete onSelect={(user) => setSelectedUser(user)} />

        {/* From Date */}
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="From"
            value={fromDate}
            onChange={(newValue) => {
              setFromDate(newValue);
              if (newValue && toDate && newValue.isAfter(toDate)) {
                setToDate(newValue);
              }
            }}
            maxDate={dayjs(toDate)}
            format="DD-MMM-YYYY"
            slotProps={{
              textField: {
                fullWidth: true,
              },
            }}
          />
        </LocalizationProvider>

        {/* To Date */}
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="To"
            value={toDate}
            minDate={dayjs(fromDate)}
            onChange={(newValue) => setToDate(newValue)}
            format="DD-MMM-YYYY"
            slotProps={{
              textField: {
                fullWidth: true,
              },
            }}
          />
        </LocalizationProvider>

        {/* Fetch Button */}
        <Button
          variant="contained"
          onClick={fetchHandler}
          disabled={!selectedUser || !fromDate || !toDate}
          loading={loading}
          sx={{
            height: 56,
            width: { xs: '100%', md: 'auto' },
            px: { md: 4 },
            minWidth: 120,
          }}
        >
          Fetch
        </Button>
      </Stack>

      <div className="user-journey-result">
        {loading && <Spinner />}
        {error && !data && <Alert severity="error">{error?.message}</Alert>}
        {!loading && !error && data?.sessions?.length === 0 && (
          <Alert severity="info">No data available</Alert>
        )}
        {!loading &&
          !error &&
          data &&
          data?.sessions?.length > 0 &&
          renderSessions()}
      </div>
    </div>
  );
};

export default UserJourney;
