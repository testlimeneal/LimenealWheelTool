import { TextField, Grid, Select, MenuItem, Box,Chip, OutlinedInput, useTheme,InputLabel } from '@material-ui/core';
// import MenuProps  from '@material-ui/core';
import { useEffect, useState } from 'react';
import configData from "../../config"
import axios from 'axios';
// import useTheme from '@material-ui/core';

const PersonalInfo = (props) => {
  const { formik } = props;
  const theme = useTheme();


  const [jobs,setJobs] = useState([])

  useEffect(async() => {
   const res = await axios.get(`${configData.API_SERVER}assessment/form/data`);
   setJobs(res.data.jobs)
  }, []);

  function getStyles(name, personName, theme) {
    return {
      fontWeight:
        personName.indexOf(name) === -1
          ? theme.typography.fontWeightRegular
          : theme.typography.fontWeightMedium,
    };
  }
  

  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
      <InputLabel id="test-select-label">Job Aspirations</InputLabel>

        <Select
          name="job_aspirations"
          label="Job Aspirations"
          variant="outlined"
          size="small"
          fullWidth
          multiple
          // labelWidth={ "text".length * 9}
          value={formik.values.job_aspirations}
          onChange={formik.handleChange}
          labelId="test-select-label" 
          // label="Job Aspirations"
          renderValue={(selected) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {selected.map((value) => (
                <Chip key={value} label={`${value.slice(2)}`} />
              ))}
            </Box>
          )}
          MenuProps={MenuProps}
          input={<OutlinedInput id="select-multiple-chip" label="Chip" />}

          error={formik.touched.job_aspirations && Boolean(formik.errors.job_aspirations)}
        >
          {jobs.length && jobs.map((choice) => (
            <MenuItem key={choice.id} value={`${choice.id}.${choice.title}`}
            
            style={getStyles(choice, formik.values.job_aspirations, theme)}
            >
              {choice.title}
            </MenuItem>
          ))}
        </Select>
      </Grid>
      <Grid item xs={12}>
        <TextField
          name="goals"
          label="Goals"
          variant="outlined"
          fullWidth
          multiline
          rows={4}
          value={formik.values.goals}
          onChange={formik.handleChange}
          error={formik.touched.goals && Boolean(formik.errors.goals)}
          helperText={formik.touched.goals && formik.errors.goals}
        />
      </Grid>
      {/* <Grid item xs={12}>
        <TextField
          name="name"
          label="Name"
          variant="outlined"
          size="small"
          fullWidth
          value={formik.values.name}
          onChange={formik.handleChange}
          error={formik.touched.name && Boolean(formik.errors.name)}
          helperText={formik.touched.name && formik.errors.name}
        />
      </Grid>
      <Grid item xs={6}>
        <TextField
          name="dob"
          label="Date of Birth"
          type="date"
          variant="outlined"
          fullWidth
          size="small"
          value={formik.values.dob}
          onChange={formik.handleChange}
          error={formik.touched.dob && Boolean(formik.errors.dob)}
          helperText={formik.touched.dob && formik.errors.dob}
        />
      </Grid>
      <Grid item xs={6}>
        <Select
          name="gender"
          label="Gender"
          variant="outlined"
          size="small"
          fullWidth
          value={formik.values.gender}
          onChange={formik.handleChange}
          error={formik.touched.gender && Boolean(formik.errors.gender)}
        >
          {['Male','Female','Other'].map((choice) => (
            <MenuItem key={choice} value={choice}>
              {choice}
            </MenuItem>
          ))}
        </Select>
      </Grid>
      <Grid item xs={6}>
        <Select
          name="status"
          label="Status"
          variant="outlined"
          size="small"
          fullWidth
          value={formik.values.status}
          onChange={formik.handleChange}
          error={formik.touched.status && Boolean(formik.errors.status)}
        >
          {['Married','Single','Widow'].map((choice) => (
            <MenuItem key={choice} value={choice}>
              {choice}
            </MenuItem>
          ))}
        </Select>
      </Grid>
      <Grid item xs={6}>
        <TextField
          name="mobile_no"
          label="Mobile Number"
          variant="outlined"
          fullWidth
          size="small"
          value={formik.values.mobile_no}
          onChange={formik.handleChange}
          error={formik.touched.mobile_no && Boolean(formik.errors.mobile_no)}
          helperText={formik.touched.mobile_no && formik.errors.mobile_no}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          name="email_id"
          label="Email"
          variant="outlined"
          type="email"
          fullWidth
          size="small"
          value={formik.values.email_id}
          onChange={formik.handleChange}
          error={formik.touched.email_id && Boolean(formik.errors.email_id)}
          helperText={formik.touched.email_id && formik.errors.email_id}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          name="address"
          label="Address"
          variant="outlined"
          fullWidth
          multiline
          rows={4}
          value={formik.values.address}
          onChange={formik.handleChange}
          error={formik.touched.address && Boolean(formik.errors.address)}
          helperText={formik.touched.address && formik.errors.address}
        />
      </Grid> */}
    </Grid>
  );
}

export default PersonalInfo;
