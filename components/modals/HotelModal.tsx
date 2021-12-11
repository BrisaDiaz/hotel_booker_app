import * as React from 'react';
import { getFeaturesTags } from '@/utils/index';
import { v4 as uuidv4 } from 'uuid';
import { Hotel } from '@/interfaces/index';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import { createStyles, makeStyles } from '@mui/styles';
import { Theme } from '@mui/material/styles';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import Paper from '@mui/material/Paper';
import ImageSlider from '@/components/ImageSlider';
import CloseButton from '@/components/modals/CloseButton';
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    modal: {
      position: 'absolute' as 'absolute',
      borderRadius: theme.spacing(2),
      top: '50%',
      left: '50%',
      fontWeight: 200,

      transform: 'translate(-50%, -50%)',
      minWidth: 360,
      width: '100%',
      maxWidth: '800px',

      padding: theme.spacing(4),

      backgroundColor: 'background.paper',

      maxHeight: '90%',
      overflowY: 'auto',
      '&::-webkit-scrollbar': {
        display: 'none',
      },
    },
    legend: {
      minWidth: '50%',
      fontStyle: 'italic',

      color: theme.palette.text.secondary,
      [theme.breakpoints.up('sm')]: {
        minWidth: '45%',
      },
      fontSize: '14px',
      '&:after': {
        content: ':',
      },
    },

    rowField: {
      maxWidth: 500,
      width: '100%',
      display: 'flex',
      fontSize: '14px',
      marginBottom: theme.spacing(2),
      textTransform: 'capitalize',
      'nth-child(2)': {
        width: '60%',
      },
      '& > p': {
        fontSize: '14px',
      },
    },
    columnField: {
      display: 'flex',
      flexDirection: 'column',
      columnGap: theme.spacing(3),
      marginBottom: theme.spacing(2),
    },
    paragraph: {
      whiteSpace: 'break-spaces',
      paddingTop: theme.spacing(2),

      lineHeight: 1.3,

      fontSize: '14px',
    },
    titleBox: {
      '&:first-child': { marginBottom: 0, paddingTop: theme.spacing(2) },
      display: 'flex',
      alignItems: 'center',
      gap: theme.spacing(1),
      backgroundColor: theme.palette.grey[100],
      marginBottom: theme.spacing(2),
      padding: theme.spacing(2),
      paddingTop: theme.spacing(1),
      paddingBottom: theme.spacing(1),
    },
  })
);
const EditButton = ({ onClick }: { onClick: React.MouseEventHandler }) => {
  return (
    <Tooltip disableFocusListener title="Edit">
      <IconButton
        aria-label="edit"
        size="small"
        color="primary"
        onClick={onClick}
      >
        <EditIcon fontSize="small" />
      </IconButton>
    </Tooltip>
  );
};

type ComponentProps = {
  isModalOpend: Boolean;
  closeModal: Function;
  onEdit: Function;
  hotel: Hotel;
};
function TransitionsModal(props: ComponentProps) {
  const { isModalOpend, closeModal, onEdit, hotel } = props;
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false), closeModal();
  };

  React.useEffect(() => {
    if (isModalOpend) {
      handleOpen();
    }
  }, [isModalOpend]);

  const TagsWithKeys = hotel.features
    ? getFeaturesTags(hotel.features).map((feature: string) => ({
        id: uuidv4(),
        name: feature,
      }))
    : [];
  const features = [
    { title: 'Facilities', items: hotel?.facilities },
    { title: 'Services', items: hotel?.services },
    { title: 'Activities', items: hotel?.activities },
    { title: 'Languages', items: hotel?.languages },
    { title: 'Others Qualities', items: TagsWithKeys },
  ];
  const images = [
    { title: 'Hotel frame', image: hotel?.frameImage },
    { title: 'Hotel Interior', image: hotel?.interiorImage },
  ];

  return (
    <div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <Paper elevation={4} className={classes.modal}>
            <CloseButton handleClose={handleClose} />
            {hotel && (
              <Box sx={{ mt: 2 }}>
                <Box className={classes.titleBox}>
                  <Typography variant="h6" color="primary">
                    Aspect{' '}
                  </Typography>
                  <EditButton onClick={() => onEdit('aspect')} />
                </Box>
                <ImageSlider images={images} />

                <Box className={classes.titleBox}>
                  <Typography variant="h6" color="primary">
                    About{' '}
                  </Typography>
                  <EditButton onClick={() => onEdit('about')} />
                </Box>

                <Box className={classes.rowField}>
                  <Typography className={classes.legend}>Name</Typography>
                  <Typography>{hotel.name}</Typography>
                </Box>
                {hotel?.brand && (
                  <Box className={classes.rowField}>
                    <Typography className={classes.legend}>Brand</Typography>
                    <Typography>{hotel.brand}</Typography>
                  </Box>
                )}
                <Box className={classes.rowField}>
                  <Typography className={classes.legend}>Category</Typography>
                  <Typography>{hotel.category}</Typography>
                </Box>
                <Box className={classes.columnField}>
                  <Typography className={classes.legend}>
                    Description
                  </Typography>
                  <Typography component="pre" className={classes.paragraph}>
                    {hotel.description}
                  </Typography>
                </Box>
                <Box className={classes.titleBox}>
                  <Typography variant="h6" color="primary">
                    Policies And Rules{' '}
                  </Typography>
                  <EditButton onClick={() => onEdit('policies')} />
                </Box>
                <Box className={classes.rowField}>
                  <Typography className={classes.legend}>
                    Check In Hour
                  </Typography>
                  <Typography>{hotel.checkInHour}</Typography>
                </Box>
                <Box className={classes.rowField}>
                  <Typography className={classes.legend}>
                    Check Out Hour
                  </Typography>
                  <Typography>{hotel.checkOutHour}</Typography>
                </Box>
                <Box className={classes.columnField}>
                  <Typography className={classes.legend}>Policies</Typography>
                  <Typography component="pre" className={classes.paragraph}>
                    {hotel.policiesAndRules}
                  </Typography>
                </Box>
                <Box className={classes.titleBox}>
                  <Typography variant="h6" color="primary">
                    Prices
                  </Typography>
                  <EditButton onClick={() => onEdit('prices')} />
                </Box>

                <Box className={classes.rowField}>
                  <Typography className={classes.legend}>
                    Lowest price
                  </Typography>
                  <Typography>USD${hotel.lowestPrice}</Typography>
                </Box>
                <Box className={classes.rowField}>
                  <Typography className={classes.legend}>
                    Taxes and Charges
                  </Typography>
                  <Typography>USD${hotel.taxesAndCharges}</Typography>
                </Box>
                <Box className={classes.titleBox}>
                  <Typography variant="h6" color="primary">
                    Address
                  </Typography>
                  <EditButton onClick={() => onEdit('address')} />
                </Box>

                <Box>
                  <Typography sx={{ mb: 2, fontSize: '14px' }}>
                    {hotel.address.holeAddress}
                  </Typography>
                </Box>
                <Box className={classes.titleBox}>
                  <Typography variant="h6" color="primary">
                    Contact
                  </Typography>
                  <EditButton onClick={() => onEdit('contact')} />
                </Box>
                <Box className={classes.rowField}>
                  <Typography className={classes.legend}>Telephone</Typography>
                  <Typography>{hotel.telephone}</Typography>
                </Box>
                {hotel?.email && (
                  <Box className={classes.rowField}>
                    <Typography className={classes.legend}>Email</Typography>
                    <Typography>{hotel.email}</Typography>
                  </Box>
                )}
                {hotel?.website && (
                  <Box className={classes.rowField}>
                    <Typography className={classes.legend}>Website</Typography>
                    <Typography sx={{ textTransform: 'initial' }}>
                      {hotel.website}
                    </Typography>
                  </Box>
                )}

                <Box className={classes.titleBox}>
                  <Typography variant="h6" color="primary">
                    Features
                  </Typography>
                  <EditButton onClick={() => onEdit('features')} />
                </Box>

                <Box
                  sx={{
                    display: 'flex',
                    columnGap: 4,
                    mb: 2,
                    flexWrap: 'wrap',
                  }}
                >
                  {features.map(
                    (feature) =>
                      feature.items &&
                      feature.items.length > 0 && (
                        <Box
                          key={feature.title}
                          sx={{
                            py: 2,

                            height: 'fit-content',
                            overflow: 'hidden',
                            flexWrap: 'wrap',
                          }}
                        >
                          <Typography
                            variant="subtitle1"
                            sx={{ mb: 2, fontWeight: 600, opacity: 0.8 }}
                          >
                            {feature.title}
                            <Typography
                              component="span"
                              sx={{ opacity: 0.8, fontSize: '16px' }}
                            >
                              {`(${feature.items.length})`}{' '}
                            </Typography>
                          </Typography>
                          {feature.items.map((item) => (
                            <Box
                              key={item.id}
                              sx={{ display: 'flex', gap: 3, mb: 2 }}
                            >
                              <Typography
                                sx={{
                                  textTransform: 'capitalize',
                                  fontSize: '14px',
                                }}
                              >
                                {item.name}
                              </Typography>
                            </Box>
                          ))}
                        </Box>
                      )
                  )}
                </Box>
              </Box>
            )}
          </Paper>
        </Fade>
      </Modal>
    </div>
  );
}

export default TransitionsModal;
