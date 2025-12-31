import React, { ErrorInfo, ReactNode } from 'react';
import { Box, Button, Container, Typography, Paper } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  reset?: unknown;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  componentDidUpdate(prevProps: Readonly<ErrorBoundaryProps>, prevState: Readonly<ErrorBoundaryState>, snapshot?: any): void {
    if(prevProps?.reset !== this.props?.reset) {
       this.setState({ hasError: false, error: undefined });
    }
  }

  render() {
    const { hasError, error } = this.state;
    const { children, fallback } = this.props;

    if (hasError) {
      if (fallback) return <>{fallback}</>;

      return (
        <Container maxWidth="sm" sx={{mt: 10}}>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
              <ErrorOutlineIcon color="error" sx={{ fontSize: 64, mb: 2 }} />

              <Typography variant="h5" gutterBottom>
                Something went wrong
              </Typography>

              <Typography variant="body2" color="text.secondary" mb={2}>
                An unexpected error occurred. Please try again.
              </Typography>
            </Paper>
          </Box>
        </Container>
      );
    }

    return children;
  }
}
