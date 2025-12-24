import { useEffect, useRef, useState } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';
import { User } from '../models/user.interface';
import { useFetch } from '../hooks/useFetch';

interface IUserAutocomplete {
  onSelect: (user: User) => void;
  className?: string;
}

export default function UserAutocomplete({
  onSelect,
  className,
}: IUserAutocomplete) {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState<{
    value: string;
    reason: string;
  }>({ value: '', reason: '' });

  const debounceRef = useRef<number | undefined>();
  const { data, loading, error, fetchData } = useFetch<User[]>('/users/search');

  useEffect(() => {
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
      fetchUsers(inputValue?.value);
    }, 500);

    return () => clearTimeout(debounceRef.current);
  }, [inputValue]);

  const fetchUsers = async (query: string) => {
    await fetchData({
      query: `query=${encodeURIComponent(query)}`,
    });
  };

  return (
    <Autocomplete
      style={{ minWidth: '300px', paddingTop: '0px', borderColor: 'red' }}
      className={className}
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => {setOpen(false);fetchData({ reset: true });}}
      options={data || []}
      loading={loading}
      inputValue={inputValue?.value}
      onInputChange={(_, value, reason) => setInputValue({ value, reason })}
      getOptionLabel={(option) =>
        `${option.fname} ${option.lname} (${option.userId})`
      }
      onChange={(_, value) => onSelect?.(value as User)}
      isOptionEqualToValue={(opt, val) => opt.userId === val.userId}
      noOptionsText={
        error ? (
          <span style={{color: 'red'}}>{error?.message}</span>
        ) : inputValue?.value?.length < 2 || !data ? (
          'Type at least 2 characters'
        ) : (
          'No users found'
        )
      }
      renderInput={(params) => (
        <TextField
          {...params}
          label="Search User"
          placeholder="Type name or userId"
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
