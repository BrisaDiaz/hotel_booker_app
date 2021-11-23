import * as React from 'react';
import { useRouter } from 'next/router';
import { useMutation } from '@apollo/client';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import { useForm } from 'react-hook-form';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme } from '@mui/material/styles';
import validations from '@/utils/formValidations';
import { SIGN_IN } from '@/queries/index';
import {useAuth}from '../context/useAuth'
import Backdrop from '@/components/Backdrop';
import SnackBar from '@/components/SnackBar';

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

const theme = createTheme();

export default function SignIn() {

  const {setSession} = useAuth()
  const [errorMessage, setErrorMessage] = React.useState<string>('');

  const [signIn, { loading, error }] = useMutation(SIGN_IN, {
    onError: (graphError) => {
      setErrorMessage(graphError.message);
    },
    onCompleted: (data) => {
      const {email,firstName,lastName,role} = data.signin.user
setSession({email,firstName,lastName,role})
      role === 'ADMIN'
        ? router.push('/admin')
        : router.push('/search');
    },
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: 'onBlur' });
  const router = useRouter();
  const redirectToSignup = (data) => {
    router.push('/signup');
  };
  const onSubmit = async (data: any, event: any) => {
    event.preventDefault();
    try {
      await signIn({
        variables: { ...data },
      });
    } catch (err) {}
  };

  return (
    <Box
      sx={{
        maxWidth: '1200px',
        m: '0 auto',
      }}
    >
      {error && (
        <SnackBar
          severity="error"
          message={errorMessage || "Signin couldn't be complited"}
        />
      )}

      <Container component="main" maxWidth="xs">
        <CssBaseline />
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
            Sign In
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit(onSubmit)}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
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
              Sign In
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link
                  href="#"
                  variant="body2"
                  onClick={() => redirectToSignup()}
                >
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
        <Backdrop loading={loading} />
      </Container>
    </Box>
  );
}
