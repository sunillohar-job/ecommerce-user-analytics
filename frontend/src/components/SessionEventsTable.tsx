import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Chip,
} from '@mui/material';
import { SessionEvent } from '../models/user-journey.interface';
import dayjs from 'dayjs';

export function SessionEventsTable({ events }: { events: SessionEvent[] }) {
  return (
    <Table size="small">
      <TableHead>
        <TableRow>
          <TableCell>Time</TableCell>
          <TableCell>Event</TableCell>
          <TableCell>Page</TableCell>
          <TableCell>Metadata</TableCell>
        </TableRow>
      </TableHead>

      <TableBody>
        {events.map((e, idx) => (
          <TableRow key={idx}>
            <TableCell>{dayjs(e.timestamp).format('DD-MM-YYYY h:mm:ss A')}</TableCell>
            <TableCell>
              <Chip style={{fontSize: '12px'}} label={e.eventType} />
            </TableCell>
            <TableCell>{e.page || '-'}</TableCell>
            <TableCell>
              <pre style={{ margin: 0 }}>
                {JSON.stringify(e.metadata, null, 2)}
              </pre>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
