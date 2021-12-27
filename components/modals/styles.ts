export const styles = {
  modal: {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    minWidth: 360,
    maxWidth: 500,
    width: '100%',
    bgcolor: 'background.paper',
    border: '1px solid rgba(244,244,244,1)',
    boxShadow: 24,
    borderRadius: 2,
    p: 2,
    px: 3.5,
    maxHeight: '90%',
    overflowY: 'scroll',
    '&::-webkit-scrollbar': {
      display: 'none',
    },
  },
  leyend: {
    width: { xs: '50%' },
    color: 'text.secondary',
    fontSize: '14px',
    fontWeight: 500,
  },
  title: {
    textTransform: 'capitalize',
    mb: 2,
    align: 'center',
  },
  withIconLabel: {
    marginBottom: '10px',
    display: 'flex',
    gap: '10px',
    width: '100%',
    alignItems: 'center',
    my: 1.5,

    '& > * ': {
      color: 'primary.main',
    },
  },
  list: {
    display: 'flex',
    textTransform: 'capitalize',
    flexWrap: 'wrap',
    py: 0.7,
    ml: 1,
    fontSize: '14px !important',
    '& > * ': {
      fontSize: '14px !important',
    },
  },
  roomGuests: {
    display: 'flex',
    gap: 1,
    minWidth: 'max-content',
    '&:before': {
      content: '"•"',
      color: 'rgb(224 224 224)',
    },
  },
};
