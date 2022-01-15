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
import currencyFixer from '@/utils/currencyFixer'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import Paper from '@mui/material/Paper';
import ImageSlider from '@/components/ImageSlider';
import CloseButton from '@/components/modals/CloseButton';
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    modal: {
      position: 'absolute' ,
      borderRadius: theme.spacing(1),
      top: '50%',
      left: '50%',
      fontWeight: 200,
background:theme.palette.background,
      transform: 'translate(-50%, -50%)',
      minWidth: 360,
      width: '100%',
      maxWidth: '800px',

      padding: theme.spacing(3),
      paddingTop: theme.spacing(1),
      backgroundColor: 'background.paper',

      maxHeight: '95%',

      overflowY: 'auto',
     
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
  | 'contact'
  | 'price'
  | 'aspect'
  | 'features'
  | 'policies'
  | 'address'
  | '';
type ComponentProps = {
  isModalOpend: boolean;
  closeModal: ()=>void;
  onEdit: (sectionName:SectionToEdit)=>void;
  hotel: Hotel | null;
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
  if (!isModalOpend || !hotel) return <div />;
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
  const images: { title: string; image: string }[] = [
    { title: 'Hotel frame', image: hotel?.frameImage || '' },
    { title: 'Hotel Interior', image: hotel?.interiorImage || '' },
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

            {hotel && (
              <Box className={classes.modalContent}>
                <Box className={classes.titleBox}>
                  <Typography variant="subtitle1" color="primary">
                    Aspect{' '}
                  </Typography>
                  <EditButton onClick={() => onEdit('aspect')} />
                </Box>

                <ImageSlider images={images} />

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
                    <Typography>{hotel.name}</Typography>
                  </Box>
                  {hotel?.brand && (
                    <Box className={classes.rowField}>
                      <Typography
                        className={classes.legend}
                        variant="subtitle2"
                        color="text.secondary"
                      >
                        Brand
                      </Typography>
                      <Typography>{hotel.brand}</Typography>
                    </Box>
                  )}
                  <Box className={classes.rowField}>
                    <Typography
                      className={classes.legend}
                      variant="subtitle2"
                      color="text.secondary"
                    >
                      Category
                    </Typography>
                    <Typography>{hotel.category}</Typography>
                  </Box>
                  <Box className={classes.columnField}>
                    <Typography
                      className={classes.legend}
                      variant="subtitle2"
                      color="text.secondary"
                    >
                      Description
                    </Typography>
                   
                    
                      <Box sx={{fontSize:'14px'}}  dangerouslySetInnerHTML={{__html: hotel.description}}/>
                    
                  </Box>
                </Box>

                <Box className={classes.titleBox}>
                  <Typography variant="subtitle1" color="primary">
                    Policies And Rules
                  </Typography>
                  <EditButton onClick={() => onEdit('policies')} />
                </Box>

                <Box component="section">
                  <Box className={classes.rowField}>
                    <Typography
                      className={classes.legend}
                      variant="subtitle2"
                      color="text.secondary"
                    >
                      Check In Hour
                    </Typography>
                    <time>{hotel.checkInHour}</time>
                  </Box>
                  <Box className={classes.rowField}>
                    <Typography
                      className={classes.legend}
                      variant="subtitle2"
                      color="text.secondary"
                    >
                      Check Out Hour
                    </Typography>
                    <time>{hotel.checkOutHour}</time>
                  </Box>
                  <Box className={classes.columnField}>
                    <Typography
                      className={classes.legend}
                      variant="subtitle2"
                      color="text.secondary"
                    >
                      Policies
                    </Typography>
                    <Box sx={{fontSize:'14px'}} dangerouslySetInnerHTML={{__html: hotel.policiesAndRules}}/>
                    
                   
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
                    <Typography>USD {currencyFixer(hotel.lowestPrice)}</Typography>
                  </Box>
                  <Box component="section">
                    <Box className={classes.rowField}>
                      <Typography
                        className={classes.legend}
                        variant="subtitle2"
                        color="text.secondary"
                      >
                        Taxes and Charges
                      </Typography>
                      <Typography>USD {currencyFixer(hotel.taxesAndCharges)}</Typography>
                    </Box>
                  </Box>
                </Box>

                <Box className={classes.titleBox}>
                  <Typography variant="subtitle1" color="primary">
                    Address
                  </Typography>
                  <EditButton onClick={() => onEdit('address')} />
                </Box>
                <Box component="section">
                  <Box>
                    <Typography sx={{ mb: 2, fontSize: '14px' }}>
                      {hotel.address.holeAddress}
                    </Typography>
                  </Box>
                </Box>

                <Box className={classes.titleBox}>
                  <Typography variant="subtitle1" color="primary">
                    Contact
                  </Typography>
                  <EditButton onClick={() => onEdit('contact')} />
                </Box>
                <Box component="section">
                  <Box className={classes.rowField}>
                    <Typography
                      className={classes.legend}
                      variant="subtitle2"
                      color="text.secondary"
                    >
                      Telephone
                    </Typography>
                    <Typography>{hotel.telephone}</Typography>
                  </Box>
                  {hotel?.email && (
                    <Box className={classes.rowField}>
                      <Typography
                        className={classes.legend}
                        variant="subtitle2"
                        color="text.secondary"
                      >
                        Email
                      </Typography>
                      <Typography>{hotel.email}</Typography>
                    </Box>
                  )}
                  {hotel?.website && (
                    <Box className={classes.rowField}>
                      <Typography
                        className={classes.legend}
                        variant="subtitle2"
                        color="text.secondary"
                      >
                        Website
                      </Typography>
                      <Typography sx={{ textTransform: 'initial' }}>
                        {hotel.website}
                      </Typography>
                    </Box>
                  )}
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
