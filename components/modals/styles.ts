export const styles = {
  modal: {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    minWidth: '360px',
    maxWidth: '500px',
    width: '100%',
    background: '#efefef',
    border: '1px solid rgba(244,244,244,1)',

    borderRadius: 2,

    pb: 3.5,
    px: 3,
    maxHeight: '100%',
    overflowY: 'auto',
  },
  contentContainer: {
    maxHeight: '60vh',
    borderTop: '1px solid #e6e6e6',
    borderBottom: '1px solid #e6e6e6',
  },
  legend: {
    width: '30%',
    minWidth: 120,
    color: 'text.secondary',
    fontSize: '14px',
    fontWeight: 500,
  },
  title: {
    textTransform: 'capitalize',
    mb: 3,
    mx: 'auto',
  },
  input: {
    '*': {
      fontSize: { xs: '14px', sm: '16px' },
    },
    input: {
      p: { xs: '10px 14px', sm: '16.5px 14px' },
    },
  },
  inputGrid: { mb: 0.5 },
  withIconLabel: {
    marginBottom: '10px',
    display: 'flex',
    gap: '10px',
    width: '100%',
    alignItems: 'center',
    my: 1.5,
    backgroundColor: '#e6e6e6',
    p: '6px',
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
    '* ': {
      fontSize: '14px !important',
    },
    time: { whiteSpace: 'break-spaces' },
    'p:last-child': {
      width: '50%',
      overflow: 'hidden',
      whiteSpace: 'pre',
      textOverflow: 'ellipsis',
    },
  },
  roomGuests: {
    display: 'flex',
    gap: 1,
    minWidth: 'max-content',
  },
} as const;
