const email = {
  required: 'Email is required.',
  pattern: {
    value:
      /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
    message: 'Invalid email.',
  },
};
const password = {
  required: 'Password is required.',
  minLength: {
    value: 5,
    message: 'Password must be at least 5 characters.',
  },
};
const name = {
  required: 'Name is required.',
  minLength: {
    value: 3,
    message: 'Name must be at least 3 characters.',
  },
  pattern: {
    value: /^[A-Za-zñÑáÁéÉíÍóÓúÚÜü]+$/,
    message: 'Name must only contain alphabetic characters without spaces.',
  },
};
const lastname = {
  required: 'Last name is required.',
  minLength: {
    value: 3,
    message: 'Last name must be at least 3 characters.',
  },
  pattern: {
    value: /^[A-Za-zñÑáÁéÉíÍóÓúÚÜü]+$/,
    message:
      'Last Name must only contain alphabetic characters without spaces.',
  },
};
const telephone = {
  required: 'Telephone is required.',

  pattern: {
    value: /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}$/,
    message: 'Invalid format +xx (xxx) xxx-xxxx.',
  },
};
const website = {
  pattern: {
    value:
      /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi,
    message: 'Invalid website url',
  },
};
const validations = { email, password, name, lastname, telephone, website };

export default validations;
