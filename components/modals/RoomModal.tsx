import * as React from 'react';

import { v4 as uuidv4 } from 'uuid';
import { RoomModel, Feature } from '@/interfaces/index';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import { createStyles, makeStyles } from '@mui/styles';
import { Theme } from '@mui/material/styles';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import ImageListItem from '@mui/material/ImageListItem';
import ImageList from '@mui/material/ImageList';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import Paper from '@mui/material/Paper';
import ImageSlider from '@/components/ImageSlider';
import CloseButton from '@/components/modals/CloseButton';
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    modal: {
      position: 'absolute' as 'absolute',
      borderRadius: theme.spacing(1),
      top: '50%',
      left: '50%',
      fontWeight: 200,

      transform: 'translate(-50%, -50%)',
      minWidth: 360,
      width: '100%',
      maxWidth: '800px',

      padding: theme.spacing(3),
      paddingTop: theme.spacing(1),
      backgroundColor: 'background.paper',

      maxHeight: '95%',

      overflowY: 'scroll',
      '&::-webkit-scrollbar': {
        display: 'none',
      },
    },
    modalContent: {
      '& > section': {
        marginLeft: theme.spacing(1),
      },
    },
    legend: {
      minWidth: '50%',

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
      overflowX: 'hidden',

      'nth-child(2)': {
        textOverflow: 'ellipsis',
        width: '50%',
      },
      '& > *': {
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
      '&:first-child': { marginBottom: 0, marginTop: theme.spacing(0) },
      display: 'flex',
      alignItems: 'center',

      backgroundColor: theme.palette.grey[100],
      marginBottom: theme.spacing(2),
      padding: theme.spacing(1),
      paddingTop: theme.spacing(0.5),
      paddingBottom: theme.spacing(0.5),
      opacity: 0.9,
      '& > *': {
        fontWeight: 600,
      },
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
        sx={{ pb: 1 }}
      >
        <EditOutlinedIcon fontSize="small" />
      </IconButton>
    </Tooltip>
  );
};

type ComponentProps = {
  isModalOpend: Boolean;
  closeModal: Function;
  onEdit: Function;
  roomType: Partial<RoomModel> | null;
};

function TransitionsModal(props: ComponentProps) {
  const { isModalOpend, closeModal, onEdit, roomType } = props;

  if (!isModalOpend || !roomType) return <div />;
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

  let aditionalQualities = [];
  roomType?.smooking &&
    aditionalQualities.push({
      id: uuidv4(),
      name: 'smooking allowed',
    });
  roomType?.freeCancelation &&
    aditionalQualities.push({
      id: uuidv4(),
      name: 'free cancelation',
    });
  const features = [
    { title: 'Services', items: roomType?.services },
    { title: 'Activities', items: roomType?.amenities },
    { title: 'Others Qualities', items: aditionalQualities },
  ];
  return (
    <div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={() => handleClose()}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <Paper elevation={4} className={classes.modal}>
            <Box sx={{ mt: 0.5 }}>
              <CloseButton handleClose={handleClose} />
            </Box>

            {roomType && (
              <Box className={classes.modalContent}>
                <Box className={classes.titleBox}>
                  <Typography variant="subtitle1" color="primary">
                    Aspect{' '}
                  </Typography>
                  <EditButton onClick={() => onEdit('aspect')} />
                </Box>

                <ImageList
                  sx={{
                    width: '100%',
                    maxHeight: '500px',
                    overflow: 'hidden',
                    objectFit: 'cover',
                    objectPosition: 'center bottom',
                  }}
                  rowHeight={500}
                  cols={1}
                >
                  <ImageListItem cols={1}>
                    <img
                      src={`${roomType.mainImage}`}
                      srcSet={`${roomType.mainImage}`}
                      alt={`${roomType.name}`}
                      loading="lazy"
                    />
                  </ImageListItem>
                </ImageList>

                <Box className={classes.titleBox}>
                  <Typography variant="subtitle1" color="primary">
                    About{' '}
                  </Typography>
                  <EditButton onClick={() => onEdit('about')} />
                </Box>
                <Box component="section">
                  <Box className={classes.rowField}>
                    <Typography
                      className={classes.legend}
                      variant="subtitle2"
                      color="text.secondary"
                    >
                      Name
                    </Typography>
                    <Typography>{roomType.name}</Typography>
                  </Box>

                  <Box className={classes.rowField}>
                    <Typography
                      className={classes.legend}
                      variant="subtitle2"
                      color="text.secondary"
                    >
                      Category
                    </Typography>
                    <Typography>{roomType.category}</Typography>
                  </Box>
                  <Box className={classes.columnField}>
                    <Typography
                      className={classes.legend}
                      variant="subtitle2"
                      color="text.secondary"
                    >
                      Description
                    </Typography>
                    <Typography component="pre" className={classes.paragraph}>
                      {roomType.description}
                    </Typography>
                  </Box>
                </Box>

                <Box className={classes.titleBox}>
                  <Typography variant="subtitle1" color="primary">
                    Capacity
                  </Typography>
                  <EditButton onClick={() => onEdit('capacity')} />
                </Box>

                <Box component="section">
                  <Box className={classes.rowField}>
                    <Typography
                      className={classes.legend}
                      variant="subtitle2"
                      color="text.secondary"
                    >
                      mts<sup>2</sup>
                    </Typography>
                    <Typography>
                      {roomType.mts2} mts<sup>2</sup>
                    </Typography>
                  </Box>
                  <Box className={classes.rowField}>
                    <Typography
                      className={classes.legend}
                      variant="subtitle2"
                      color="text.secondary"
                    >
                      maximun guests
                    </Typography>
                    <Typography>{roomType.maximunGuests}</Typography>
                  </Box>
                  <Box className={classes.rowField}>
                    <Typography
                      className={classes.legend}
                      variant="subtitle2"
                      color="text.secondary"
                    >
                      minimun nights
                    </Typography>
                    <Typography>
                      {' '}
                      {roomType.minimunStay
                        ? roomType.minimunStay
                        : 'not specified'}
                    </Typography>
                  </Box>

                  <Box className={classes.rowField}>
                    <Typography
                      className={classes.legend}
                      variant="subtitle2"
                      color="text.secondary"
                    >
                      maximun nights
                    </Typography>
                    <Typography>
                      {roomType.maximunStay
                        ? roomType.maximunStay
                        : 'not specified'}
                    </Typography>
                  </Box>
                  <Box className={classes.rowField}>
                    <Typography
                      className={classes.legend}
                      variant="subtitle2"
                      color="text.secondary"
                    >
                      Beds
                    </Typography>
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                      }}
                    >
                      {roomType.beds.map((bed) => (
                        <Typography key={bed.type} sx={{ fontSize: 'inherit' }}>
                          {bed.quantity} {bed.type}
                          {bed.quantity > 1 ? ' beds' : ' bed'}
                        </Typography>
                      ))}
                    </Box>
                  </Box>
                </Box>
                <Box className={classes.titleBox}>
                  <Typography variant="subtitle1" color="primary">
                    Prices
                  </Typography>
                  <EditButton onClick={() => onEdit('price')} />
                </Box>
                <Box component="section">
                  <Box className={classes.rowField}>
                    <Typography
                      className={classes.legend}
                      variant="subtitle2"
                      color="text.secondary"
                    >
                      Lowest price
                    </Typography>
                    <Typography>USD ${roomType.lowestPrice}</Typography>
                  </Box>

                  <Box className={classes.rowField}>
                    <Typography
                      className={classes.legend}
                      variant="subtitle2"
                      color="text.secondary"
                    >
                      Taxes and Charges
                    </Typography>
                    <Typography>USD ${roomType.taxesAndCharges}</Typography>
                  </Box>
                  <Box className={classes.rowField}>
                    <Typography
                      className={classes.legend}
                      variant="subtitle2"
                      color="text.secondary"
                    >
                      Cancelation Fee
                    </Typography>
                    <Typography>USD ${roomType.cancelationFee}</Typography>
                  </Box>
                </Box>

                <Box className={classes.titleBox}>
                  <Typography variant="subtitle1" color="primary">
                    Features
                  </Typography>
                  <EditButton onClick={() => onEdit('features')} />
                </Box>
                <Box component="section">
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
                              variant="subtitle2"
                              color="text.secondary"
                              sx={{ mb: 2 }}
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
              </Box>
            )}
          </Paper>
        </Fade>
      </Modal>
    </div>
  );
}

export default TransitionsModal;