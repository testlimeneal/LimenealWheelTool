import React from 'react';
import { useFormik } from 'formik';
import { Button, TextField, Container, Typography, Grid } from '@material-ui/core';
import Axios from '../../../config/axios';
const CreateUserForm = (props) => {
  const {setValue} = props;
  const formik = useFormik({
    initialValues: {
      username: '',
      email: '',
    },
    onSubmit: async(values) => {
      // Implement your API call to create a new user here
      // You can use libraries like axios to make the API call
      // After the user is created, you can redirect or show a success message
      const res = await Axios.post('superadmin/create-user/',values)
      setValue(0)
    },
  });

  return (
    <Container component="main" maxWidth="xs">
      <Typography component="h1" variant="h5" align="center" >
        Push a New User
      </Typography>
      <Typography component="p" variant="p" align="center" style={{marginBottom:15}}>
        Created at Super-Admin Level
      </Typography>
      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              id="username"
              name="username"
              label="Username"
              variant="outlined"
              value={formik.values.username}
              onChange={formik.handleChange}
              error={formik.touched.username && Boolean(formik.errors.username)}
              helperText={formik.touched.username && formik.errors.username}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              id="email"
              name="email"
              label="Email"
              variant="outlined"
              value={formik.values.email}
              onChange={formik.handleChange}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
            />
          </Grid>
        </Grid>
        <Button type="submit" variant="contained" color="primary" style={{marginTop:30}} fullWidth mt={2} >
          Create User
        </Button>
      </form>
    </Container>
  );
};

export default CreateUserForm;
