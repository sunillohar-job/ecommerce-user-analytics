import { useEffect, useRef, useState } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import CircularProgress from "@mui/material/CircularProgress";
import { User } from "../models/user.interface";

interface IUserAutocomplete {
  onSelect: (user: User) => void;
  className?: string;
}

export default function UserAutocomplete({ onSelect, className }: IUserAutocomplete) {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<User[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);

  const debounceRef = useRef<number | undefined>();
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!inputValue || inputValue.length < 2) {
      setOptions([]);
      return;
    }

    // Debounce
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchUsers(inputValue);
    }, 500);

    return () => clearTimeout(debounceRef.current);
  }, [inputValue]);

  const fetchUsers = async (query: string) => {
    // Cancel previous request
    if (abortRef.current) {
      abortRef.current.abort();
    }

    abortRef.current = new AbortController();

    try {
      setLoading(true);

      const res = await fetch(
        `http://localhost:4000/api/users/search?query=${encodeURIComponent(query)}`,
        { signal: abortRef.current.signal }
      );

      if (!res.ok) throw new Error("Failed to fetch users");

      const json = await res.json();
      
      setOptions(json.data || []);
    } catch (err: any) {
      if (err?.name !== "AbortError") {
        console.error(err);
        setOptions([]);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Autocomplete
      style={{minWidth: "300px", paddingTop: "8px"}}
      className={className}
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      options={options}
      loading={loading}
      inputValue={inputValue}
      onInputChange={(_, value) => setInputValue(value)}
      getOptionLabel={(option) =>
        `${option.fname} ${option.lname} (${option.userId})`
      }
      onChange={(_, value) => onSelect?.(value as User)}
      isOptionEqualToValue={(opt, val) => opt.userId === val.userId}
      noOptionsText={inputValue.length < 2 ? "Type at least 2 characters" : "No users found"}
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
