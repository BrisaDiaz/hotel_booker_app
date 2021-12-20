import BedIcon from '@mui/icons-material/Bed';
import KingBedIcon from '@mui/icons-material/KingBed';
import SingleBedIcon from '@mui/icons-material/SingleBed';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

function DinamicBedIcone(bedType: string, size: string) {
  return bedType === 'californian king' ? (
    <KingBedIcon fontSize={size} color="secondary" />
  ) : bedType === 'full' || bedType === 'queen' ? (
    <BedIcon fontSize={size} color="secondary" />
  ) : (
    <SingleBedIcon fontSize={size} color="secondary" />
  );
}

interface withIconeBed {
  label: string;
  Icone: JSX.Element;
}
interface withQuantityItem {
  id: number;
  type: string;
  quantity: number;
}
const getBedsInterface = (
  beds: withQuantityItem[],
  size: string
): withIconeBed[] => {
  const bedsInterface = beds.map((bedInfo) => ({
    label: `${bedInfo.quantity} ${bedInfo.type} ${
      bedInfo.quantity > 1 ? 'beds' : 'bed'
    }`,
    Icone: DinamicBedIcone(bedInfo.type, size),
  }));
  return bedsInterface;
};
export default function RoomBedsUI({
  beds,
  size,
}: {
  beds: withQuantityItem[];
  size: string;
}) {
  const bedsWidthIcon: withIconeBed[] = getBedsInterface(beds, size);
  return (
    <Box sx={{ display: 'flex', columnGap: '8px' }}>
      <Box
        sx={{
          display: 'flex',
          columnGap: '3px',
          width: '100%',
        }}
      >
        {bedsWidthIcon.map((bed, index) => (
          <div key={bed.label}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                flexWrap: 'wrap',
                columnGap: `${size === 'small' ? '3px' : '6px'}`,
                mr: 0.5,
              }}
            >
              {bed.Icone}
              <Typography
                variant={size === 'small' ? 'body2' : 'subtitle1'}
                sx={{
                  minWidth: 'max-content',
                }}
              >
                {bed.label}
              </Typography>
              {index < bedsWidthIcon.length - 1 && (
                <Typography sx={{ ml: 0.5 }}>+</Typography>
              )}
            </Box>
          </div>
        ))}
      </Box>
    </Box>
  );
}
