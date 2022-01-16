
export const styles = {
  modal: {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    minWidth: '360px',
    maxWidth: '500px',
    width: '100%',
    bgcolor: '#fff',
    border: '1px solid rgba(244,244,244,1)',

    borderRadius: 2,
    pt: 2,
       pb: 3.5,
    px: 3.5,
    maxHeight: '100%',
    overflowY: 'auto',
  
  },
  leyend: {
    width: '60%',
    color: 'text.secondary',
    fontSize: '14px',
    fontWeight: 500,
  },
  title: {
    textTransform: 'capitalize',
    mb: 2,
    mx: 'auto',
  },
  input:{
    '*':{
       fontSize:{xs:'14px',sm:'16px'},
    },
'input':{

p:{xs:'10px 14px',sm:'16.5px 14px'},
},
  },
  inputGrid:{mb:0.5},
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
} as const;
