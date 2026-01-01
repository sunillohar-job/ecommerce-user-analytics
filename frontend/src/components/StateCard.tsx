import { Card, CardContent, Box, Typography } from "@mui/material";
import { getConversionTextColor } from "../utils";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  bgColor: string;
  fgColor: string;
  width?: Record<string, string>;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  icon,
  bgColor,
  fgColor,
  width
}) => {
  return (
    <Card
      elevation={1}
      sx={{
        borderRadius: 2,
        height: '100%',
        width
      }}
    >
      <CardContent sx={{ pb: '16px !important' }}>
        <Box display="flex" alignItems="center" gap={2}>
          <Box
            sx={{
              bgcolor: bgColor,
              color: fgColor,
              p: 1.3,
              borderRadius: '50%',
              display: 'flex',
            }}
          >
            {icon}
          </Box>

          <Box>
            <Typography variant="body2" color="text.secondary">
              {label}
            </Typography>
            <Typography
              color={
                label === 'Conversion Rate'
                  ? getConversionTextColor(value)
                  : 'text.secondary'
              }
              variant="h6"
              fontWeight={600}
            >
              {value}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};
