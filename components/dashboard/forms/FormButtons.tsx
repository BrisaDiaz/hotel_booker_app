import Button from '@mui/material/Button';
import SaveIcon from '@mui/icons-material/Save';
import Box from '@mui/material/Box';
import useMediaQuery from '@mui/material/useMediaQuery';
import { styles } from '@/components/dashboard/forms/styles';
export default function FormButtons({ onAbort }: { onAbort?: () => void }) {
  const matchesSize = useMediaQuery('(min-width:600px)');

  return (
    <Box sx={styles.formButtons}>
      <Button
        variant="contained"
        color="primary"
        size={matchesSize ? 'large' : 'medium'}
        style={{ color: '#fff' }}
        sx={styles.buttons}
        startIcon={<SaveIcon />}
        type="submit"
      >
        Save
      </Button>
      <Button
        sx={styles.buttons}
        variant="outlined"
        color="primary"
        type="reset"
        onClick={() => {
          onAbort && onAbort();
        }}
        size={matchesSize ? 'large' : 'medium'}
      >
        Cancel
      </Button>
    </Box>
  );
}
