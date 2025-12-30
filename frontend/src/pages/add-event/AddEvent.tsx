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
  Snackbar,
} from '@mui/material';
import UserAutocomplete from '../../components/UserAutocomplete';
import SessionAutocomplete from '../../components/SessionAutocomplete';
import { User } from '../../models/user.interface';
import { Session } from '../../models/session.interface';
import { useFetch } from '../../hooks/useFetch';

// Pre-defined event types
export const EVENT_TYPES = [
  // Page & Navigation
  'PAGE_VIEW',
  'PAGE_LOAD',
  'PAGE_UNLOAD',
  'ROUTE_CHANGE',
  'ERROR_PAGE_VIEW',

  // Search
  'SEARCH',
  'SEARCH_AUTOCOMPLETE',
  'SEARCH_FILTER_APPLIED',
  'SEARCH_SORT_APPLIED',
  'SEARCH_NO_RESULTS',
  'SEARCH_RESULT_CLICK',

  // Cart & Wishlist
  'ADD_TO_CART',
  'REMOVE_FROM_CART',
  'UPDATE_CART_QUANTITY',
  'CLEAR_CART',
  'VIEW_CART',
  'ADD_TO_WISHLIST',
  'REMOVE_FROM_WISHLIST',

  // Product
  'PRODUCT_VIEW',
  'PRODUCT_CLICK',
  'PRODUCT_IMPRESSION',
  'PRODUCT_IMAGE_ZOOM',
  'PRODUCT_VIDEO_PLAY',
  'PRODUCT_REVIEW_VIEW',
  'PRODUCT_REVIEW_SUBMIT',

  // Checkout & Orders
  'CHECKOUT_STARTED',
  'CHECKOUT_STEP_COMPLETED',
  'PAYMENT_METHOD_SELECTED',
  'PAYMENT_FAILED',
  'ORDER_PLACED',
  'ORDER_CONFIRMED',
  'ORDER_CANCELLED',
  'ORDER_REFUNDED',

  // User
  'USER_SIGNUP',
  'USER_LOGIN',
  'USER_LOGOUT',
  'PASSWORD_RESET_REQUESTED',
  'PASSWORD_RESET_COMPLETED',
  'PROFILE_UPDATED',
  'ADDRESS_ADDED',

  // Marketing
  'BANNER_VIEW',
  'BANNER_CLICK',
  'PROMO_CODE_APPLIED',
  'PROMO_CODE_FAILED',
  'EMAIL_SUBSCRIBE',
  'PUSH_NOTIFICATION_CLICK',
  'CAMPAIGN_ATTRIBUTED',

  // Interaction & Session
  'SCROLL_DEPTH',
  'CLICK',
  'FORM_STARTED',
  'FORM_SUBMITTED',
  'FORM_VALIDATION_ERROR',
  'SESSION_STARTED',
  'SESSION_ENDED',

  // Errors & Performance
  'CLIENT_ERROR',
  'API_ERROR',
  'JS_EXCEPTION',
  'SLOW_API_RESPONSE',
  'SLOW_PAGE_LOAD',
];

// Pre-defined pages
const PAGES = ['/home', '/deals', '/category', '/product', '/cart'];

interface EventFormData {
  userId?: string | null;
  sessionId?: string | null;
  eventType?: string;
  page?: string;
  metadata?: string;
}

const AddEvent: React.FC = () => {
  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
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
    try {
      if (metadataError) {
        return;
      }

      let parsedMetadata = {};
      if (formData?.metadata?.trim()) {
        try {
          parsedMetadata = JSON.parse(formData?.metadata);
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

      await postData({ body: JSON.stringify(eventData) });
      setFormData({
        eventType: '',
        page: '',
        metadata: '{}',
      });
      setOpenSnackbar(true);
    } catch (_e) {}
  };

  const isFormDisabled = !selectedUser || !selectedSession;
  const isSubmitDisabled =
    isFormDisabled || !formData.eventType || !formData.page || !!metadataError;

  return (
    <Box>
      <Snackbar
        open={openSnackbar}
        onClose={() => setOpenSnackbar(false)}
        message="Event add successfully!"
        autoHideDuration={1200}
      />
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
          {error && <Alert severity="error">{error?.message}</Alert>}
          {isFormDisabled && (
            <Alert severity="info">
              Please select a user and session to enable the form fields.
            </Alert>
          )}
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
        </Stack>
      </Paper>
    </Box>
  );
};

export default AddEvent;
