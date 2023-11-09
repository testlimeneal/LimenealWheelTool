import {
    Typography,
    List,
    ListItem,
    ListItemText
  } from '@material-ui/core';
  
  const ReviewInfo = ({ formik }) => {
    const { values } = formik;
    return (
      <>
        <Typography variant="overline" >
          Account Details
        </Typography>
        <List>
          <ListItem>
            <ListItemText
              primary="Name"
              secondary={values.name}
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="Date of Birth"
              secondary={values.dob}
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="Address"
              secondary={values.address}
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="Gender"
              secondary={values.gender}
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="Mobile No."
              secondary={values.mobile_no}
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="Status"
              secondary={values.status}
            />
          </ListItem>
        </List>
        <Typography variant="overline">
          Personal Information
        </Typography>
        <List>
          <ListItem>
            <ListItemText
              primary="Job Aspirations"
              secondary={values.job_aspirations.map(job => job.replace(/^\d+\./, '').trim()).join(', ')}
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="Goals"
              secondary={values.goals}
            />
          </ListItem>
          
         
         
        </List>
      </>
    )
  }
  
  export default ReviewInfo