import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
// import { Button } from 'primereact/button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import { Select, MenuItem, InputLabel } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Axios from '../../config/axios';
import { Box, Tabs, Tab } from '@material-ui/core';
import CreateJobForm from './admin/createjobform';

export default function SuperAdminCareers() {
  const [careers, setCareers] = useState([]);
  const [clusters, setClusters] = useState([]);
  const [bucket, setBucket] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [newCareer, setNewCareer] = useState({});
  const [openConfirmationDialog, setOpenConfirmationDialog] = useState(false);

  useEffect(async () => {
    const res = await Axios.get('/superadmin/jobs/');
    const temp = await Axios.get('/superadmin/clusters_and_buckets/');
    const { career_clusters, buckets } = temp.data;
    setClusters(career_clusters);
    setBucket(buckets);
    setCareers(res.data);
  }, []);

  const handleAddCareer = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewCareer((prevCareer) => ({
      ...prevCareer,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      await Axios.post('/superadmin/jobs/', newCareer);

      const res = await Axios.get('/superadmin/jobs/');
      setCareers(res.data);

      setOpenDialog(false);
    } catch (error) {
      console.error('Error adding career:', error.message);
    }
  };

  const [selectedCareerId, setSelectedCareerId] = useState(null);

  const handleDelete = async (careerId) => {
    setSelectedCareerId(careerId);
    setOpenConfirmationDialog(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await Axios.delete(`/superadmin/jobs/${selectedCareerId}/`);

      const res = await Axios.get('/superadmin/jobs/');
      setCareers(res.data);

      setOpenConfirmationDialog(false);
    } catch (error) {
      console.error('Error deleting career:', error.message);
    }
  };
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleCancelDelete = () => {
    setOpenConfirmationDialog(false);
    setSelectedCareerId(null);
  };
  return (
    <Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
      <Tabs value={value} onChange={handleChange} centered>
        <Tab label="Career List" />
        <Tab label="Create Career" />
        
      </Tabs>
      <TabPanel value={value} index={0}>
        <div className="card">
          <DataTable
            style={{ fontSize: '1em' }}
            value={careers}
            stripedRows
            tableStyle={{ marginTop: 10, minWidth: '50rem' }}
            filterDisplay="row"
            paginator
            rows={15}
          >
            <Column field="title" header="Career Name" filter filterPlaceholder="Search by name"></Column>
            <Column field="career_cluster.name" header="Career Cluster"></Column>
            <Column field="lwdimension_field1.feature" header="LW 1"></Column>
            <Column field="lwdimension_field2.feature" header="LW 2"></Column>
            <Column field="lwdimension_field3.feature" header="LW 3"></Column>
            <Column
              body={(rowData) => (
                <>
                  <Button onClick={() => handleDelete(rowData.id)} color="secondary">
                    Delete
                  </Button>
                </>
              )}
            />
          </DataTable>
          <Dialog
            open={openConfirmationDialog}
            onClose={handleCancelDelete}
            fullWidth
            aria-labelledby="confirmation-dialog-title"
          >
            <DialogTitle id="confirmation-dialog-title">Confirm Delete</DialogTitle>
            <DialogContent>
              <p>Are you sure you want to delete this career?</p>
              <strong>Will affect the reports generated</strong>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCancelDelete} color="primary">
                Cancel
              </Button>
              <Button onClick={handleConfirmDelete} color="secondary">
                Confirm Delete
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      </TabPanel>
      <TabPanel value={value} index={1}>
      <CreateJobForm />
      </TabPanel>
    </Box>
  );
}

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Box role="tabpanel" hidden={value !== index} id={`tabpanel-${index}`} aria-labelledby={`tab-${index}`} {...other}>
      {value === index && <Box padding={5}>{children}</Box>}
    </Box>
  );
}
