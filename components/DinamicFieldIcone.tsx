import ApartmentIcon from '@mui/icons-material/Apartment';
import RoomServiceIcon from '@mui/icons-material/RoomService';
import HikingIcon from '@mui/icons-material/Hiking';
import LanguageIcon from '@mui/icons-material/Language';
import HotelIcon from '@mui/icons-material/Hotel';
import RuleIcon from '@mui/icons-material/Rule';
import ChildCareIcon from '@mui/icons-material/ChildCare';
import PetsIcon from '@mui/icons-material/Pets';
import AccessibleForwardIcon from '@mui/icons-material/AccessibleForward';
import SmokingRoomsIcon from '@mui/icons-material/SmokingRooms';
import PaidIcon from '@mui/icons-material/Paid';
import LocalFloristIcon from '@mui/icons-material/LocalFlorist';

const DinamicIcons = (subject: string) => {
  const subjectName = subject.toLowerCase().trim();
  return subjectName == 'facilities' ? (
    <ApartmentIcon />
  ) : subjectName.includes('services') ? (
    <RoomServiceIcon />
  ) : subjectName.includes('activities') ? (
    <HikingIcon />
  ) : subjectName.includes('languages') ? (
    <LanguageIcon />
  ) : subjectName.includes('category') ? (
    <HotelIcon />
  ) : subjectName.includes('features') ? (
    <RuleIcon />
  ) : subjectName.includes('family friendly') ? (
    <ChildCareIcon color="primary" fontSize="small" />
  ) : subjectName.includes('pet friendly') ? (
    <PetsIcon color="primary" fontSize="small" />
  ) : subjectName.includes('smoker friendly') ? (
    <SmokingRoomsIcon color="primary" fontSize="small" />
  ) : subjectName.includes('accessible') ? (
    <AccessibleForwardIcon color="primary" fontSize="small" />
  ) : subjectName.includes('free') ? (
    <PaidIcon color="primary" fontSize="small" />
  ) : subjectName.includes('eco') ? (
    <LocalFloristIcon color="primary" fontSize="small" />
  ) : null;
};
export default DinamicIcons;
