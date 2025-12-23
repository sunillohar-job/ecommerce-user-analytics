import React, { useState } from 'react';
import UserAutocomplete from '../../components/UserAutocomplete';
import { User } from '../../models/user.interface';
import { Stack } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import './UserJourney.less';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

interface UserJourneyProps {}

const UserJourney: React.FC<UserJourneyProps> = () => {
  const [selectedUser, setSelectedUser] = useState<User>();

  return (
    <div className="user-journey-container">
      <Stack direction="row" spacing={2} alignItems="center">
        <UserAutocomplete onSelect={(user) => setSelectedUser(user)} />
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DemoContainer components={['DatePicker']}>
            <DatePicker label="From" />
          </DemoContainer>
        </LocalizationProvider>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DemoContainer components={['DatePicker']}>
            <DatePicker label="To" />
          </DemoContainer>
        </LocalizationProvider>
      </Stack>
    </div>
  );
};

export default UserJourney;
