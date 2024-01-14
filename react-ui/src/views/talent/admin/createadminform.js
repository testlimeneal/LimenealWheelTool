import React from 'react';
import { useFormik } from 'formik';
import { Button, TextField, Container, Typography, Grid, FormControl, InputLabel,Select,MenuItem,Checkbox,ListItemText } from '@material-ui/core';
import Axios from '../../../config/axios';

const CreateAdminForm = (props) => {
  const { setValue } = props;
  const EMPLOYMENT_STATUS_CHOICES = [
    ('Full-Time Employee', 'Full-Time Employee'),
    ('Part-Time Employee', 'Part-Time Employee'),
    ('Full-Time Contract', 'Full-Time Contract'),
    ('Part-Time Contract', 'Part-Time Contract'),
    ('Temporary', 'Temporary'),
]
  const formik = useFormik({
    initialValues: {
      username: '',
      email: '',
      org_client_name: '',
      address: '',
      type_of_business: '',
      pan_no: '',
      gst_no: '',
      uid: '',
      admin_name: '',
      admin_designation: '',
      employment_status: '',
      admin_contact_details: '',
      admin_address: '',
      admin_email_id: '',
      lp1: 0,
      lp2: 0,
      lp3: 0,
      ltb: 0,
      ltf: 0
    },
    onSubmit: async (values) => {
      const res = await Axios.post('superadmin/create-admin/', values);
      setValue(0);
    },
  });

  return (
    <Container component="main" >
      <Typography component="h1" variant="h5" align="center">
        Push a New Admin User
      </Typography>
      <Typography component="p" variant="p" align="center" style={{ marginBottom: 15 }}>
        Created at Super-Admin Level
      </Typography>
      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
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
          <Grid item xs={6}>
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
          <Grid item xs={6}>
            <TextField
              fullWidth
              id="org_client_name"
              name="org_client_name"
              label="Org/Client Name"
              variant="outlined"
              value={formik.values.org_client_name}
              onChange={formik.handleChange}
              error={formik.touched.org_client_name && Boolean(formik.errors.org_client_name)}
              helperText={formik.touched.org_client_name && formik.errors.org_client_name}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              multiline
              fullWidth
              id="address"
              name="address"
              label="Address"
              variant="outlined"
              value={formik.values.address}
              onChange={formik.handleChange}
              error={formik.touched.address && Boolean(formik.errors.address)}
              helperText={formik.touched.address && formik.errors.address}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              id="type_of_business"
              name="type_of_business"
              label="Type of Business"
              variant="outlined"
              value={formik.values.type_of_business}
              onChange={formik.handleChange}
              error={formik.touched.type_of_business && Boolean(formik.errors.type_of_business)}
              helperText={formik.touched.type_of_business && formik.errors.type_of_business}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              id="pan_no"
              name="pan_no"
              label="PAN No"
              variant="outlined"
              value={formik.values.pan_no}
              onChange={formik.handleChange}
              error={formik.touched.pan_no && Boolean(formik.errors.pan_no)}
              helperText={formik.touched.pan_no && formik.errors.pan_no}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              id="gst_no"
              name="gst_no"
              label="GST No"
              variant="outlined"
              value={formik.values.gst_no}
              onChange={formik.handleChange}
              error={formik.touched.gst_no && Boolean(formik.errors.gst_no)}
              helperText={formik.touched.gst_no && formik.errors.gst_no}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              id="uid"
              name="uid"
              label="UID (Unique ID No)"
              variant="outlined"
              value={formik.values.uid}
              onChange={formik.handleChange}
              error={formik.touched.uid && Boolean(formik.errors.uid)}
              helperText={formik.touched.uid && formik.errors.uid}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              id="admin_name"
              name="admin_name"
              label="Admin Name"
              variant="outlined"
              value={formik.values.admin_name}
              onChange={formik.handleChange}
              error={formik.touched.admin_name && Boolean(formik.errors.admin_name)}
              helperText={formik.touched.admin_name && formik.errors.admin_name}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              id="admin_designation"
              name="admin_designation"
              label="Admin Designation"
              variant="outlined"
              value={formik.values.admin_designation}
              onChange={formik.handleChange}
              error={formik.touched.admin_designation && Boolean(formik.errors.admin_designation)}
              helperText={formik.touched.admin_designation && formik.errors.admin_designation}
            />
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth variant="outlined">
              <InputLabel id="employment_status_label">Employment Status</InputLabel>
              <Select
                labelId="employment_status_label"
                id="employment_status"
                name="employment_status"
                value={formik.values.employment_status}
                onChange={formik.handleChange}
                label="Employment Status"
              >
                {EMPLOYMENT_STATUS_CHOICES.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              id="admin_contact_details"
              name="admin_contact_details"
              label="Admin Contact Details"
              variant="outlined"
              value={formik.values.admin_contact_details}
              onChange={formik.handleChange}
              error={formik.touched.admin_contact_details && Boolean(formik.errors.admin_contact_details)}
              helperText={formik.touched.admin_contact_details && formik.errors.admin_contact_details}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              id="admin_address"
              name="admin_address"
              label="Admin Address"
              variant="outlined"
              value={formik.values.admin_address}
              onChange={formik.handleChange}
              error={formik.touched.admin_address && Boolean(formik.errors.admin_address)}
              helperText={formik.touched.admin_address && formik.errors.admin_address}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              id="admin_email_id"
              name="admin_email_id"
              label="Admin Email ID"
              variant="outlined"
              value={formik.values.admin_email_id}
              onChange={formik.handleChange}
              error={formik.touched.admin_email_id && Boolean(formik.errors.admin_email_id)}
              helperText={formik.touched.admin_email_id && formik.errors.admin_email_id}
            />
          </Grid>
            {/* <Grid item xs={6}>
              <FormControl fullWidth variant="outlined">
                <InputLabel id="rights_given_label">Rights Given</InputLabel>
                <Select
                  labelId="rights_given_label"
                  id="rights_given"
                  name="rights_given"
                  multiple
                  value={formik.values.rights_given}
                  onChange={formik.handleChange}
                  label="Rights Given"
                  renderValue={(selected) => selected.join(', ')}
                >
                  {ACCESS_CHOICES.map((option) => (
                    <MenuItem key={option} value={option}>
                      <Checkbox checked={formik.values.rights_given.includes(option)} />
                      <ListItemText primary={option} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid> */}
          <Grid item xs={6}>
            <TextField
              fullWidth
              id="lp1"
              name="lp1"
              label="Limeneal Wheel Career Purpose (LP1)"
              variant="outlined"
              type="number"
              value={formik.values.lp1}
              onChange={formik.handleChange}
              error={formik.touched.lp1 && Boolean(formik.errors.lp1)}
              helperText={formik.touched.lp1 && formik.errors.lp1}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              id="lp2"
              name="lp2"
              label="Limeneal Wheel Career Purpose + Passion (LP2)"
              variant="outlined"
              type="number"
              value={formik.values.lp2}
              onChange={formik.handleChange}
              error={formik.touched.lp2 && Boolean(formik.errors.lp2)}
              helperText={formik.touched.lp2 && formik.errors.lp2}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              id="lp3"
              name="lp3"
              label="Limeneal Wheel Career Purpose + Passion + Potential (LP3)"
              variant="outlined"
              type="number"
              value={formik.values.lp3}
              onChange={formik.handleChange}
              error={formik.touched.lp3 && Boolean(formik.errors.lp3)}
              helperText={formik.touched.lp3 && formik.errors.lp3}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              id="ltb"
              name="ltb"
              label="Limeneal Wheel Talent Basic (LTB)"
              variant="outlined"
              type="number"
              value={formik.values.ltb}
              onChange={formik.handleChange}
              error={formik.touched.ltb && Boolean(formik.errors.ltb)}
              helperText={formik.touched.ltb && formik.errors.ltb}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              id="ltf"
              name="ltf"
              label="Limeneal Wheel Talent Full (LTF)"
              variant="outlined"
              type="number"
              value={formik.values.ltf}
              onChange={formik.handleChange}
              error={formik.touched.ltf && Boolean(formik.errors.ltf)}
              helperText={formik.touched.ltf && formik.errors.ltf}
            />
          </Grid>
        </Grid>
        <Button type="submit" variant="contained" color="primary" style={{ marginTop: 30 }} fullWidth mt={2}>
          Create Admin User
        </Button>
      </form>
    </Container>
  );
};

export default CreateAdminForm;
