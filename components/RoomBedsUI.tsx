import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import BedIcon from '@/components/BedIcon';
type IconSize = 'small' | 'inherit' | 'medium' | 'large';
interface withIconBed {
  label: string;
  Icon: JSX.Element;
}
interface withQuantityFeature {
  id: number;
  type: string;
  quantity: number;
}
const getBedsInterface = (
  beds: withQuantityFeature[],
  size?: IconSize
): withIconBed[] => {
  const bedsInterface = beds.map((bedInfo) => ({
    label: `${bedInfo.quantity} ${bedInfo.type} ${
      bedInfo.quantity > 1 ? 'beds' : 'bed'
    }`,
    Icon: <BedIcon type={bedInfo.type} size={size} />,
  }));
  return bedsInterface;
};
export default function RoomBedsUI({
  beds,
  size,
  fontSize,
}: {
  beds: withQuantityFeature[];
  size: IconSize;
  fontSize?: string;
}) {
  const bedsWidthIcon: withIconBed[] = getBedsInterface(beds, size);
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
              {bed.Icon}
              <Typography
                variant={size === 'small' ? 'body2' : 'subtitle1'}
                sx={{
                  minWidth: 'max-content',
                  fontSize: fontSize ? fontSize : 'inherit',
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
