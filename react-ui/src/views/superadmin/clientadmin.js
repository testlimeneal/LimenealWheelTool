import * as React from 'react';


import { Box,Tabs,Tab } from '@material-ui/core';
// import CreateUserForm from './users/createuserform';
import CreateAdminForm from './clientadmin/createadminform';
// import UsersDataTable from './users/usersdatatable'
import AdminDataTable from './clientadmin/admindatatable';

export default function SuperAdminUsers() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
      <Tabs value={value} onChange={handleChange} centered>
        <Tab label="Client Admins" />
        <Tab label="Create Client-Admin" />
        
      </Tabs>
      <TabPanel value={value} index={0}>
        <AdminDataTable />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <CreateAdminForm setValue={setValue}/>
      </TabPanel>
    </Box>
  );
}


function TabPanel(props) {
    const { children, value, index, ...other } = props;
  
    return (
      <Box
        role="tabpanel"
        hidden={value !== index}
        id={`tabpanel-${index}`}
        aria-labelledby={`tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box padding={5}>
            {children}
          </Box>
        )}
      </Box>
    );
  }