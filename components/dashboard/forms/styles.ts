export const styles = {
  root: {
    maxWidth: '900px',
    background: 'inherit',
    width: '100%',
    margin: '0 auto',
    pb: 4,
    pt: 1,
    px: { sm: 1 },
  },
  title: {
    mt: { sm: 2 },
    mb: 5,
    fontWeight: 600,
    opacity: 0.8,
  },

  formButtons: {
    display: 'flex',
    justifyContent: 'center',
    gap: '10px',
    padding: 2,
    mt: 1.5,
  },
  buttons: {
    padding: '10px 40px',
    margin: 0,
  },
  paper: {
    padding: '10px',
  },
  groupTitle: {
    fontWeight: 500,
    color: '#484848',

    mb: '10px',
    px: '10px',
    width: 'max-content',
  },
  fieldset: {
    my: 4,
    py: 2,
    borderRadius: 5,
    border: '1px solid  rgb(0 0 0 / 10%)',
    padding: { xs: '15px', sm: '20px', md: '25px ' },
    background: '#fff',

    boxShadow:
      '0px 3px 3px -2px rgb(0 0 0 / 20%), 0px 3px 4px 0px rgb(0 0 0 / 14%), 0px 1px 8px 0px rgb(0 0 0 / 12%)',
    '&:hover': {
      boxShadow:
        '0px 3px 20px -2px rgb(0 0 0 / 14%), 0px 3px 20px 0px rgb(0 0 0 / 8%), 0px 1px 20px 0px rgb(0 0 0 / 8%)',
    },
  },

  textField: {
    width: '100%',
    my: 1,
    '*': {
      fontSize: { xs: '14px', sm: '16px' },
    },
    input: {
      p: { xs: '10px 14px', sm: '16.5px 14px' },
    },
  },
};
