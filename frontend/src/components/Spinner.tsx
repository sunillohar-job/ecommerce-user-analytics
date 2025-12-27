import React from 'react';
import { Box, CircularProgress } from "@mui/material";

const Spinner: React.FC = () => (
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
);

export default Spinner;