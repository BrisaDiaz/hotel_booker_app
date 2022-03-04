import * as React from 'react';

import { v4 as uuidv4 } from 'uuid';
import { RoomModel } from '@/interfaces/index';
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
import CloseButton from '@/components/modals/CloseButton';
import currencyFixer from '@/utils/currencyFixer';
import { generateImageUrl } from '@/utils/generateImageUrl';
import Image from 'next/image';
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    modal: {
      position: 'absolute',
      borderRadius: theme.spacing(1),
      top: '50%',
      left: '50%',
      fontWeight: 200,
      background: '#efefef',
      transform: 'translate(-50%, -50%)',
      minWidth: 360,
      width: '100%',
      maxWidth: '800px',

      padding: theme.spacing(3),
      paddingTop: theme.spacing(1),
      backgroundColor: 'background.paper',

      maxHeight: '100%',

      overflowY: 'auto',
    },
    modalContent: {
      maxHeight: '80vh',
      overflow: 'scroll',
      borderTop: '1px solid #e6e6e6',
      borderBottom: '1px solid #e6e6e6',
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

      backgroundColor: '#e6e6e6',
      marginBottom: theme.spacing(2),
      padding: theme.spacing(1),
      paddingTop: theme.spacing(0.5),
      paddingBottom: theme.spacing(0.5),

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
type SectionToEdit =
  | 'about'
  | 'price'
  | 'aspect'
  | 'features'
  | 'capacity'
  | '';
type ComponentProps = {
  isOpen: boolean;
  onClose: () => void;
  onEdit: (sectionName: SectionToEdit) => void;
  roomType: RoomModel | null;
};

function TransitionsModal(props: ComponentProps) {
  const { isOpen, onClose, onEdit, roomType } = props;

  const classes = useStyles();

  const handleClose = () => {
    onClose();
  };

  if (!isOpen || !roomType) return <div />;
  const additionalQualities = [];
  roomType?.smocking &&
    additionalQualities.push({
      id: uuidv4(),
      name: 'smocking allowed',
    });
  roomType?.freeCancellation &&
    additionalQualities.push({
      id: uuidv4(),
      name: 'free cancellation',
    });
  const features = [
    { title: 'Services', items: roomType?.services },
    { title: 'Activities', items: roomType?.amenities },
    { title: 'Others Qualities', items: additionalQualities },
  ];
  return (
    <div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={isOpen}
        onClose={() => handleClose()}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={isOpen}>
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
                    <Image
                      placeholder="blur"
                      src={`${roomType.mainImage}`}
                      alt={`${roomType.name}`}
                      loading="lazy"
                      blurDataURL={generateImageUrl(roomType.mainImage, {
                        quality: 10,
                      })}
                      layout="fill"
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
                    <Box
                      sx={{ fontSize: '14px' }}
                      dangerouslySetInnerHTML={{ __html: roomType.description }}
                    />
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
                      maximum guests
                    </Typography>
                    <Typography>{roomType.maximumGuests}</Typography>
                  </Box>
                  <Box className={classes.rowField}>
                    <Typography
                      className={classes.legend}
                      variant="subtitle2"
                      color="text.secondary"
                    >
                      minimum nights
                    </Typography>
                    <Typography>
                      {' '}
                      {roomType.minimumStay
                        ? roomType.minimumStay
                        : 'not specified'}
                    </Typography>
                  </Box>

                  <Box className={classes.rowField}>
                    <Typography
                      className={classes.legend}
                      variant="subtitle2"
                      color="text.secondary"
                    >
                      maximum nights
                    </Typography>
                    <Typography>
                      {roomType.maximumStay
                        ? roomType.maximumStay
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
                    <Typography>
                      USD {currencyFixer(roomType.lowestPrice)}
                    </Typography>
                  </Box>

                  <Box className={classes.rowField}>
                    <Typography
                      className={classes.legend}
                      variant="subtitle2"
                      color="text.secondary"
                    >
                      Taxes and Charges
                    </Typography>
                    <Typography>
                      USD {currencyFixer(roomType.taxesAndCharges)}
                    </Typography>
                  </Box>
                  <Box className={classes.rowField}>
                    <Typography
                      className={classes.legend}
                      variant="subtitle2"
                      color="text.secondary"
                    >
                      Cancellation Fee
                    </Typography>
                    <Typography>
                      USD {currencyFixer(roomType.cancellationFee)}
                    </Typography>
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
