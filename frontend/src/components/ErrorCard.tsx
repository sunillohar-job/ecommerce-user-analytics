import { Card, CardContent, Typography, Box } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

function ErrorCard({ message }: { message: string }) {
  return (
    <Card>
      <CardContent>
        <Box display="flex" alignItems="center" gap={1}>
          <ErrorOutlineIcon color="error" />
          <Typography color="error" variant="body2">
            {message}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}
export default ErrorCard;