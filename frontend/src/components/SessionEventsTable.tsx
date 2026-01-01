import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Chip,
  Box,
  Typography,
  TableContainer,
  useTheme,
  useMediaQuery,
  Paper,
} from '@mui/material';
import { SessionEvent } from '../models/user-journey.interface';
import dayjs from 'dayjs';

export function SessionEventsTable({ events }: { events: SessionEvent[] }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <TableContainer sx={{ overflowX: 'auto' }}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Time</TableCell>
            <TableCell>Event</TableCell>
            {!isMobile && <TableCell>Page</TableCell>}
            <TableCell>Time Spent</TableCell>
            <TableCell>{isMobile ? 'Page & Metadata' : 'Metadata'}</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {events?.map((e, idx) => (
            <TableRow
              key={idx}
              sx={{
                verticalAlign: 'top',
                '& td': {
                  fontSize: isMobile ? '0.75rem' : '0.875rem',
                  pt: 1
                },
              }}
            >
              {/* Time */}
              <TableCell>
                {dayjs(e?.timestamp).format(
                  isMobile
                    ? 'DD MMM HH:mm'
                    : 'DD-MM-YYYY hh:mm:ss A'
                )}
              </TableCell>

              {/* Event */}
              <TableCell>
                <Chip
                  size="small"
                  label={e?.eventType ?? 'unknown'}
                  sx={{ fontSize: '0.7rem' }}
                />
              </TableCell>

              {/* Page (hidden on mobile) */}
              {!isMobile && (
                <TableCell>{e.page || '-'}</TableCell>
              )}

              {/* Time Spent */}
              <TableCell>
                {e?.timeSpentOnPage > 60
                  ? `${Math.floor(e?.timeSpentOnPage / 60)} mins`
                  : `${e?.timeSpentOnPage?.toFixed(2)} sec`}
              </TableCell>

              {/* Metadata */}
              {!isMobile && (
                <TableCell>
                  <Box
                    component="pre"
                    sx={{
                      margin: 0,
                      fontSize: '0.7rem',
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word',
                      maxWidth: 300,
                    }}
                  >
                    {JSON.stringify(e?.metadata, null, 2)}
                  </Box>
                </TableCell>
              )}

              {/* Mobile Metadata */}
              {isMobile && (
                <TableCell colSpan={2}>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    display="block"
                  >
                    Page: {e?.page || '-'}
                  </Typography>

                  {e.metadata && (
                    <Box
                      component="pre"
                      sx={{
                        mt: 0.5,
                        fontSize: '0.65rem',
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-word',
                        backgroundColor: 'action.hover',
                        p: 0.5,
                        borderRadius: 1,
                      }}
                    >
                      {JSON.stringify(e?.metadata, null, 2)}
                    </Box>
                  )}
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
