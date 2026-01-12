import React, { Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles.less';
import './i18n';
import { Box, CircularProgress } from '@mui/material';

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Suspense
      fallback={
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            width: '100vw',
          }}
        >
          <CircularProgress />
        </Box>
      }
    >
      <App />
    </Suspense>
  </React.StrictMode>
);
