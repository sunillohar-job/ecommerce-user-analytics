import { useEffect, useRef, useState } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';
import { useFetch } from '../hooks/useFetch';
import { Session } from '../models/session.interface';

interface ISessionAutocomplete {
  onSelect: (session: Session) => void;
  userId?: string;
  className?: string;
}

export default function SessionAutocomplete({
  onSelect,
  userId,
  className,
}: ISessionAutocomplete) {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState<{
    value: string;
    reason: string;
  }>({ value: '', reason: '' });

  const debounceRef = useRef<number | undefined>();
  const { data, loading, error, fetchData } = useFetch<Session[]>('/users');

  useEffect(() => {
    if (!userId) {
      return;
    }

    if (
      !inputValue?.value ||
      inputValue?.value.length < 2 ||
      inputValue.reason === 'selectOption'
    ) {
      return;
    }

    // Debounce
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchSessions(inputValue?.value || '');
    }, 500);

    return () => clearTimeout(debounceRef.current);
  }, [inputValue, userId]);

  useEffect(() => {
    if (!userId || userId === null) {
      setInputValue({ value: '', reason: '' });
      fetchData({ reset: true });
    }
  }, [userId]);

  const fetchSessions = async (query: string) => {
    if (!userId) return;

    await fetchData({
      param: `/${userId}/sessions`,
      query: `query=${encodeURIComponent(query)}`,
    });
  };

  return (
    <Autocomplete
      style={{ width: '100%' }}
      className={className}
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => {
        setOpen(false);
        fetchData({ reset: true });
      }}
      options={data || []}
      loading={loading}
      inputValue={inputValue?.value}
      onInputChange={(_, value, reason) =>
        reason !== 'reset' && setInputValue({ value, reason })
      }
      getOptionLabel={(option) => option.sessionId}
      onChange={(_, value) => onSelect?.(value as Session)}
      isOptionEqualToValue={(opt, val) => opt.sessionId === val.sessionId}
      disabled={!userId}
      noOptionsText={
        !userId ? (
          'Please select a user first'
        ) : error ? (
          <span style={{ color: 'red' }}>{error?.message}</span>
        ) : inputValue?.value?.length < 1 || !data ? (
          'Type to search sessions'
        ) : (
          'No sessions found'
        )
      }
      renderInput={(params) => (
        <TextField
          {...params}
          label="Search Session"
          placeholder="Type sessionId"
          disabled={!userId}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading ? <CircularProgress size={20} /> : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
    />
  );
}
