import React, { useState } from 'react';
import UserAutocomplete from '../../components/UserAutocomplete';
import { User } from '../../models/user.interface';
import { Button, Stack } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import './UserJourney.less';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { PickerValue } from '@mui/x-date-pickers/internals';

interface UserJourneyProps {}

const UserJourney: React.FC<UserJourneyProps> = () => {
  const [selectedUser, setSelectedUser] = useState<User>();
  const [fromDate, setFromDate] = React.useState<PickerValue>(dayjs());
  const [toDate, setToDate] = React.useState<PickerValue>(dayjs());
  const [loading, setLoading] = React.useState<boolean>(false);

  const fetchHandler = async () => {
    setLoading(true)
    console.log("***", selectedUser, fromDate?.startOf('day')?.toISOString(), toDate?.endOf('day')?.toISOString());
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
    </div>
  );
};

export default UserJourney;
