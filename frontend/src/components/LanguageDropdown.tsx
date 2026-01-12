import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  SelectChangeEvent,
  SxProps,
} from '@mui/material';
import { Theme } from '@mui/material/styles';

interface LanguageDropdownProps {
  sx?: SxProps<Theme>;
}

const LanguageDropdown: React.FC<LanguageDropdownProps> = ({ sx = {} }) => {
  const { i18n } = useTranslation();

  const handleChange = (event: SelectChangeEvent<string>) => {
    i18n.changeLanguage(event.target.value);
  };

  return (
    <FormControl
      size="small"
      sx={{
        minWidth: { xs: 90, sm: 120 },
        ...sx,

        /* Label */
        '& .MuiInputLabel-root': {
          color: 'white',
          fontSize: { xs: '0.7rem', sm: '0.8rem' },
        },
        '& .MuiInputLabel-root.Mui-focused': {
          color: 'white',
        },

        /* Select input */
        '& .MuiOutlinedInput-root': {
          color: 'white',
          height: { xs: 32, sm: 40 },

          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: 'white',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: 'white',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: 'white',
          },
        },

        /* Dropdown arrow */
        '& .MuiSvgIcon-root': {
          color: 'white',
          fontSize: { xs: '1rem', sm: '1.25rem' },
        },
      }}
    >
      <InputLabel id="language-select-label">
        Language
      </InputLabel>

      <Select
        labelId="language-select-label"
        value={i18n.language}
        label="Language"
        onChange={handleChange}
        sx={{
          fontSize: { xs: '0.75rem', sm: '0.875rem' },
          '& .MuiSelect-select': {
            padding: { xs: '6px 24px 6px 8px', sm: '8px 32px 8px 12px' },
          },
        }}
      >
         <MenuItem value="en-US">English</MenuItem>
        <MenuItem value="fr">Français</MenuItem>
        <MenuItem value="hi">हिन्दी</MenuItem>
        <MenuItem value="it">Italiano</MenuItem>
      </Select>
    </FormControl>
  );
};

export default LanguageDropdown;
