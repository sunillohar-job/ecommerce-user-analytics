import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
  Paper,
  Alert,
} from '@mui/material';
import UserAutocomplete from '../../components/UserAutocomplete';
import SessionAutocomplete from '../../components/SessionAutocomplete';
import { User } from '../../models/user.interface';
import { Session } from '../../models/session.interface';
import { useFetch } from '../../hooks/useFetch';

// Pre-defined event types
const EVENT_TYPES = [
  'PAGE_VIEW',
  'SEARCH',
  'ADD_TO_CART',
  'SCROLL_DEPTH',
  'REMOVE_FROM_CART',
  'ORDER_PLACED',
];

// Pre-defined pages
const PAGES = ['/home', '/deals', '/category', '/product', '/cart'];

interface EventFormData {
  userId: string | null;
  sessionId: string | null;
  eventType: string;
  page: string;
  metadata: string;
}

const AddEvent: React.FC = () => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [formData, setFormData] = useState<EventFormData>({
    userId: null,
    sessionId: null,
    eventType: '',
    page: '',
    metadata: '{}',
  });
  const [metadataError, setMetadataError] = useState<string>('');
  const {
    data,
    loading,
    error,
    fetchData: postData,
  } = useFetch<User[]>('/events', {
    method: 'POST',
  });

  const handleUserSelect = (user: User) => {
    setSelectedUser(user);
    setSelectedSession(null); // Reset session when user changes
    setFormData((prev) => ({
      ...prev,
      userId: user?.userId,
      sessionId: null,
    }));
  };

  const handleSessionSelect = (session: Session) => {
    setSelectedSession(session);
    setFormData((prev) => ({
      ...prev,
      sessionId: session?.sessionId,
    }));
  };

  const handleEventTypeChange = (event: any) => {
    setFormData((prev) => ({
      ...prev,
      eventType: event.target.value,
    }));
  };

  const handlePageChange = (event: any) => {
    setFormData((prev) => ({
      ...prev,
      page: event.target.value,
    }));
  };

  const handleMetadataChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setFormData((prev) => ({
      ...prev,
      metadata: value,
    }));

    // Validate JSON
    if (value.trim() === '') {
      setMetadataError('');
      return;
    }

    try {
      JSON.parse(value);
      setMetadataError('');
    } catch (e) {
      setMetadataError('Invalid JSON format');
    }
  };

  const handleSubmit = async () => {
    if (metadataError) {
      return;
    }

    let parsedMetadata = {};
    if (formData.metadata.trim()) {
      try {
        parsedMetadata = JSON.parse(formData.metadata);
      } catch (e) {
        console.error('Failed to parse metadata:', e);
        return;
      }
    }

    const eventData = {
      userId: formData.userId,
      sessionId: formData.sessionId,
      eventType: formData.eventType,
      page: formData.page || null,
      metadata: parsedMetadata,
    };

    postData({ body: JSON.stringify(eventData) });
  };

  const isFormDisabled = !selectedUser || !selectedSession;
  const isSubmitDisabled =
    isFormDisabled || !formData.eventType || !formData.page || !!metadataError;

  return (
    <Box>
      <Typography variant="h5" fontWeight={600} mb={3}>
        Add Event
      </Typography>

      <Paper elevation={2} sx={{ p: 3 }}>
        <Stack spacing={3}>
          {/* User Autocomplete */}
          <UserAutocomplete onSelect={handleUserSelect} />

          {/* Session Autocomplete */}
          <SessionAutocomplete
            onSelect={handleSessionSelect}
            userId={selectedUser?.userId}
          />

          {/* Event Type Select */}
          <FormControl fullWidth disabled={isFormDisabled}>
            <InputLabel id="event-type-label">Event Type</InputLabel>
            <Select
              labelId="event-type-label"
              id="event-type-select"
              value={formData.eventType}
              label="Event Type"
              onChange={handleEventTypeChange}
            >
              {EVENT_TYPES.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Page Select */}
          <FormControl fullWidth disabled={isFormDisabled}>
            <InputLabel id="page-label">Page</InputLabel>
            <Select
              labelId="page-label"
              id="page-select"
              value={formData.page}
              label="Page"
              onChange={handlePageChange}
            >
              {PAGES.map((page) => (
                <MenuItem key={page} value={page}>
                  {page}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Metadata JSON Field */}
          <TextField
            fullWidth
            label="Metadata (JSON)"
            multiline
            rows={6}
            value={formData.metadata}
            onChange={handleMetadataChange}
            disabled={isFormDisabled}
            placeholder='{"key": "value"}'
            error={!!metadataError}
            helperText={metadataError || 'Enter a valid JSON object'}
          />

          {/* Submit Button */}
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={isSubmitDisabled}
            size="large"
            sx={{ mt: 2 }}
            loading={loading}
          >
            Submit Event
          </Button>

          {isFormDisabled && (
            <Alert severity="info">
              Please select a user and session to enable the form fields.
            </Alert>
          )}
          {error && <Alert severity="error">{error?.message}</Alert>}
        </Stack>
      </Paper>
    </Box>
  );
};

export default AddEvent;
