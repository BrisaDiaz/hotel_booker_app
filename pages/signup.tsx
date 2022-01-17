import * as React from 'react';
import Head from 'next/head';
import { useMutation } from '@apollo/client';
import Avatar from '@mui/material/Avatar';
import { useRouter } from 'next/router';
import Button from '@mui/material/Button';
import SnackBar from '@/components/SnackBar';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { useForm } from 'react-hook-form';
import { SIGN_UP } from '@/queries/index';
import Backdrop from '@/components/Backdrop';
import validations from '@/utils/formValidations';
import AppBar from '@/components/layouts/AppBar';
import { WithLayoutPage } from '@/interfaces/index';
import useNotification from '@/hooks/useNotification'
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

const SignUp: WithLayoutPage = () => {
  const { notification,notify} = useNotification({autoClean:true})

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: 'onBlur' });
  const router = useRouter();
  const redirectToSignin = () => {
    router.push('/signin');
  };
  const [signUp, { loading ,data}] = useMutation(SIGN_UP, {
    onCompleted: () => {
      notify({type:'success',content:'SingUp complited successfully'})
    },
    onError: ({message}) => {
      notify( {type:'error', content:message});
    },
  });

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

  return (
    <div>
      <Head>
        <title>Signup</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Box
          sx={{
            maxWidth: '1200px',
            mx: 'auto',
            mt:2
          }}
        >
          {notification.content && (
            <SnackBar
              severity={notification.type}
              message={notification.content}
            />
          )}
      

          <Container component="main" maxWidth="xs">
            <Box
              sx={{
                marginTop: 12,
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
                  sx={{ mt: 3 ,      'input':{background:'#fff'}}}
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
                        errors['lastName']
                          ? errors['lastName'].message
                          : 'lastName'
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
                        errors['email']
                          ? errors['email'].message
                          : 'Email Address'
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
                        errors['password']
                          ? errors['password'].message
                          : 'Password'
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
          <Backdrop loading={loading} />
        </Box>
      </main>
    </div>
  );
};

SignUp.getLayout = (page: React.ReactNode) => (
  <>
    <AppBar />
    <>{page}</>
  </>
);
export default SignUp;
