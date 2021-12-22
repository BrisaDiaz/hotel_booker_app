import Button from '@mui/material/Button';
import SaveIcon from '@mui/icons-material/Save';
import Box from '@mui/material/Box';
import useMediaQuery from '@mui/material/useMediaQuery';
import { styles } from '@/components/dashboard/forms/styles';
export default function FormBottons({ onAbort }: { onAbort?: Function }) {
  const matchesSize = useMediaQuery('(min-width:600px)');
  return (
    <Box sx={styles.formBottons}>
      <Button
        variant="contained"
        color="primary"
        size={matchesSize ? 'large' : 'medium'}
        style={{ color: '#fff' }}
        sx={styles.bottons}
        startIcon={<SaveIcon />}
        type="submit"
      >
        Save
      </Button>
      <Button
        sx={styles.bottons}
        variant="outlined"
        color="primary"
        onClick={(e) => {
          e.preventDefault();
          onAbort && onAbort();
        }}
        size={matchesSize ? 'large' : 'medium'}
      >
        Cancel
      </Button>
    </Box>
  );
}
