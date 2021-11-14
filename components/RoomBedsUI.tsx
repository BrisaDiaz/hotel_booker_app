import BedIcon from '@mui/icons-material/Bed';
import KingBedIcon from '@mui/icons-material/KingBed';
import SingleBedIcon from '@mui/icons-material/SingleBed';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

function DinamicBedIcone(bedType: string) {
  return bedType === 'californian king' ? (
    <KingBedIcon fontSize="small" color="secondary" />
  ) : bedType === 'full' || bedType === 'queen' ? (
    <BedIcon fontSize="small" color="secondary" />
  ) : (
    <SingleBedIcon fontSize="small" color="secondary" />
  );
}

interface withIconeBed {
  label: string;
  Icone: JSX.Element;
}
interface withQuantityItem {
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
    Icone: DinamicBedIcone(bedInfo.type),
  }));
  return bedsInterface;
};
export default function RoomBedsUI(roomBeds: withQuantityItem[], size: string) {
  const beds = getBedsInterface(roomBeds);
  return (
    <Box sx={{ display: 'flex', columnGap: '8px' }}>
      <Box
        sx={{
          display: 'flex',
          columnGap: '3px',
          width: '100%',
        }}
      >
        {beds.map((bed, index) => (
          <div key={bed.label}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                flexWrap: 'wrap',
                columnGap: '3px',
              }}
            >
              {bed.Icone}
              <Typography
                variant={size === 'small' ? 'body2' : 'subtitle1'}
                sx={{ minWidth: 'max-content' }}
              >
                {bed.label}
                {beds.length > 1 && index < beds.length - 1 && <b>{'  '}+</b>}
              </Typography>
            </Box>
          </div>
        ))}
      </Box>
    </Box>
  );
}
