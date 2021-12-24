import BedIcon from '@mui/icons-material/Bed';
import KingBedIcon from '@mui/icons-material/KingBed';
import SingleBedIcon from '@mui/icons-material/SingleBed';
export default function BedIcone({
  type,
  size,
  color,
}: {
  type: string;
  size?: 'small' | 'medium' | 'large' | 'inherit';
  color?: 'inherit' | 'primary' | 'secondary';
}) {
  return type === 'californian king' ? (
    <KingBedIcon
      fontSize={size ? size : 'inherit'}
      color={color ? color : 'secondary'}
    />
  ) : type === 'full' || type === 'queen' ? (
    <BedIcon
      fontSize={size ? size : 'inherit'}
      color={color ? color : 'secondary'}
    />
  ) : (
    <SingleBedIcon
      fontSize={size ? size : 'inherit'}
      color={color ? color : 'secondary'}
    />
  );
}
