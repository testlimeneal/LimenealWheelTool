import React,{useState,useEffect} from 'react';
import { useFormik } from 'formik';
import { Button, TextField, Container, Typography, Grid ,Autocomplete} from '@material-ui/core';
import Axios from '../../../../config/axios';
const CreateUserForm = (props) => {
  const [selectedValue, setSelectedValue] = useState(null);

  const [users, setUsers] = useState([]);

  const handleOnChange = (event, value) => {
    setSelectedValue(value);

  };

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await Axios.get('superadmin/get-clientsubadmins/');
        setUsers(response.data.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    fetchData();
  }, []);

  const { setValue } = props;
  const formik = useFormik({
    initialValues: {
      username: '',
      email: '',
    },
    onSubmit: async (values) => {
      const payload = { ...values, admin_id: selectedValue['user_id'] ,type:'clientsubadmin'};
      const res = await Axios.post('superadmin/create-user/', payload);
      setValue(0);
    },
  });

  return (
    <Container component="main" maxWidth="xs">
      <Typography component="h1" variant="h5" align="center">
        Push a New User
      </Typography>
      <Typography component="p" variant="p" align="center" style={{ marginBottom: 15 }}>
        Created at Admin Level
      </Typography>
      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
          <Autocomplete
              value={selectedValue}
              onChange={handleOnChange}
              id="combo-box-demo"
              options={users}
              getOptionLabel={(option) =>
                `Email: ${option.user_email} | Org Client Name: ${option.org_client_name} | Admin Name: ${option.admin_name} | Admin Email: ${option.admin_email_id}`
              }
              renderInput={(params) => <TextField {...params} label="Created Under Client Admin" />}
              // onChange={handleOnChange}
            />
          </Grid>
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
        <Button type="submit" variant="contained" color="primary" style={{ marginTop: 30 }} fullWidth mt={2}>
          Create User
        </Button>
      </form>
    </Container>
  );
};

export default CreateUserForm;
