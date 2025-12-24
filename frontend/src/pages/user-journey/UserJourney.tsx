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

  return (
    <div className="user-journey-container">
      <Stack direction="row" spacing={2} alignItems="center">
        <UserAutocomplete onSelect={(user) => setSelectedUser(user)} />
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DemoContainer components={['DatePicker']}>
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
            />
          </DemoContainer>
        </LocalizationProvider>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DemoContainer components={['DatePicker']}>
            <DatePicker
              label="To"
              minDate={dayjs(fromDate)}
              value={toDate}
              onChange={(newValue) => setToDate(newValue)}
              format="DD-MMM-YYYY"
            />
          </DemoContainer>
        </LocalizationProvider>
        <Button
          variant="contained"
          className="fetch-button"
          onClick={fetchHandler}
          disabled={!selectedUser || !fromDate || !toDate}
          loading={loading}
        >
          Fetch
        </Button>
      </Stack>
      <div className="user-journey-result">
        {loading && (
          <Box
            sx={{
              minHeight: '200px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              p: 4, // padding
            }}
          >
            <CircularProgress size={50} />
          </Box>
        )}
        {error && !data && <Alert severity="error">{error?.message}</Alert>}
        {!loading && !error && data?.sessions?.length === 0 && (
          <Alert severity="info">No data available</Alert>
        )}
        {!loading &&
          !error &&
          data &&
          data?.sessions?.length > 0 &&
          data?.sessions.map((session, index) => (
            <SessionCard key={session.sessionId} session={session} />
          ))}
      </div>
    </div>
  );
};

export default UserJourney;
