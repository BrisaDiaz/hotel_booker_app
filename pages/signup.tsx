import * as React from 'react';
import { useMutation, useLazyQuery } from '@apollo/client';
import Avatar from '@mui/material/Avatar';
import { useRouter } from 'next/router';
import Button from '@mui/material/Button';
import Alerts from '@/components/Alerts';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { useForm } from 'react-hook-form';
import { SIGN_UP, SIGN_OUT } from '@/queries/index';
import validations from '@/utils/formValidations';
function Copyright(props: any) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

export default function SignUp() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: 'onBlur' });
  const router = useRouter();
  const redirectToSignin = () => {
    router.push('/signin');
  };
  const [signUp, { error, data, loading }] = useMutation(SIGN_UP);

  const onSubmit = async (formData: any, event: any) => {
    try {
      await signUp({ variables: formData });
    } catch (e) {
      console.log(e);
    }
  };
  if (data?.signup?.name && !loading) {
    redirectToSignin();
  }

  const [signOut] = useMutation(SIGN_OUT);
  const handdleSignOut = async () => {
    try {
      await signOut({
        variables: { date: new Date(Date.now()).toISOString() },
      });
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <Box
      sx={{
        maxWidth: '1200px',
        m: '0 auto',
      }}
    >
      {!loading && error && (
        <Alerts type="error" alerts={error.graphQLErrors} />
      )}
      <Button sx={{ ml: 'auto' }} onClick={() => handdleSignOut()}>
        Sign Out
      </Button>
      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
            <LockOutlinedIcon sx={{ color: '#fff' }} />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit(onSubmit)}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="given-name"
                  required
                  {...register('firstName', { ...validations.name })}
                  error={errors['firstName'] && true}
                  label={
                    errors['firstName']
                      ? errors['firstName'].message
                      : 'First Name'
                  }
                  fullWidth
                  id="firstName"
                  autoFocus
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="lastName"
                  {...register('lastName', { ...validations.lastname })}
                  error={errors['lastName'] && true}
                  label={
                    errors['lastName'] ? errors['lastName'].message : 'lastName'
                  }
                  autoComplete="family-name"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  type="email"
                  id="email"
                  label={
                    errors['email'] ? errors['email'].message : 'Email Address'
                  }
                  {...register('email', { ...validations.email })}
                  error={errors['email'] && true}
                  autoComplete="email"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  type="password"
                  {...register('password', { ...validations.password })}
                  error={errors['password'] && true}
                  label={
                    errors['password'] ? errors['password'].message : 'Password'
                  }
                  type="password"
                  id="password"
                  autoComplete="new-password"
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, p: 2 }}
            >
              Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link
                  href="#"
                  variant="body2"
                  onClick={() => redirectToSignin()}
                >
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 5 }} />
      </Container>
    </Box>
  );
}
