import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Grid,
  Chip,
  Box,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { UserSessions } from '../models/user-journey.interface';
import { SessionEventsTable } from './SessionEventsTable';
import dayjs from 'dayjs';

export function SessionCard({ session }: { session: UserSessions }) {
  return (
    <Accordion sx={{ mb: 2 }}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Box width="100%">
          <Typography variant="subtitle1" fontWeight={600}>
            Session: {session.sessionId}
          </Typography>

          <Grid container spacing={2} mt={1} alignItems="center">
            <Grid size={{ xs: 12, md: 2 }}>
              <Typography variant="caption">Started</Typography>
              <br />
              <Typography variant="caption">
                {dayjs(session.startedAt).format('DD-MM-YYYY h:mm:ss A')}
              </Typography>
            </Grid>

            <Grid size={{ xs: 12, md: 2 }}>
              <Typography variant="caption">Ended</Typography>
              <br />
              <Typography variant="caption">{dayjs(session.endedAt).format('DD-MM-YYYY h:mm:ss A')}</Typography>
            </Grid>

            <Grid size={{ xs: 12, md: 2 }}>
              <Chip label={`Events: ${session.events.length}`} />
            </Grid>
            
            <Grid size={{ xs: 12, md: 2 }}>
              <Chip label={`Pages: ${session.totalDistinctPages}`} />
            </Grid>

            <Grid size={{ xs: 12, md: 2  }}>
              <Chip
                color="primary"
                label={`Qtn: ${session.totalPurchaseQuantity}`}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 2 }}>
              <Chip
                color="success"
                label={`₹ ${session.totalPurchaseAmount}`}
              />
            </Grid>
          </Grid>

          <Typography variant="caption">
            Time Spent: {Math.floor(session.totalTimeSpent / 60)} mins
          </Typography>
        </Box>
      </AccordionSummary>

      <AccordionDetails>
        <SessionEventsTable events={session.events} />
      </AccordionDetails>
    </Accordion>
  );
}
