import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Grid,
  Chip,
  Box,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { UserSessions } from '../models/user-journey.interface';
import { SessionEventsTable } from './SessionEventsTable';
import dayjs from 'dayjs';

export function SessionCard({ session }: { session: UserSessions }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Accordion sx={{ mb: 2, mt: 2 }}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Box width="100%">
          {/* Session Title */}
          <Typography
            variant={isMobile ? 'body1' : 'subtitle1'}
            fontWeight={600}
            noWrap
          >
            Session: {session?.sessionId ?? 'unknown'}
          </Typography>

          {/* Session Meta */}
          <Grid container spacing={1.5} mt={1} alignItems="center">
            {/* Started */}
            <Grid size={{ xs: 12, md: 2, sm: 6 }}>
              <Typography variant="caption" color="text.secondary">
                Started
              </Typography>
              <Typography variant="caption" display="block">
                {dayjs(session?.startedAt).format('DD-MM-YYYY hh:mm A')}
              </Typography>
            </Grid>

            {/* Ended */}
            <Grid size={{ xs: 12, md: 2, sm: 6 }}>
              <Typography variant="caption" color="text.secondary">
                Ended
              </Typography>
              <Typography variant="caption" display="block">
                {dayjs(session.endedAt).format('DD-MM-YYYY hh:mm A')}
              </Typography>
            </Grid>

            {/* Chips */}
            <Grid size={{ xs: 12, md: 8 }}>
              <Box
                display="flex"
                flexWrap="wrap"
                sx={{
                  justifyContent: {
                    xs: 'flex-start', // mobile
                    sm: 'flex-start', // tablet
                    md: 'space-around', // only md and up
                  },
                }}
                gap={1}
              >
                <Chip
                  size={isMobile ? 'small' : 'medium'}
                  label={`Events: ${session?.events?.length ?? 0}`}
                />
                <Chip
                  size={isMobile ? 'small' : 'medium'}
                  label={`Pages: ${session?.totalDistinctPages ?? 0}`}
                />
                <Chip
                  size={isMobile ? 'small' : 'medium'}
                  color="primary"
                  label={`Qtn: ${session?.totalPurchaseQuantity || 0}`}
                />
                <Chip
                  size={isMobile ? 'small' : 'medium'}
                  color="success"
                  label={`$ ${session?.totalPurchaseAmount || 0}`}
                />
              </Box>
            </Grid>
          </Grid>

          {/* Time Spent */}
          <Typography
            variant="caption"
            mt={1}
            display="block"
            color="text.secondary"
          >
            Time Spent: {Math.floor(session?.totalTimeSpent / 60)} mins
          </Typography>
        </Box>
      </AccordionSummary>

      <AccordionDetails sx={{ p: isMobile ? 1 : 2 }}>
        <SessionEventsTable events={session?.events} />
      </AccordionDetails>
    </Accordion>
  );
}
