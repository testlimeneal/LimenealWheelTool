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

  const handleCancelDelete = () => {
    setOpenConfirmationDialog(false);
    setSelectedCareerId(null);
  };
  return (
    <div className="card">
      <Button variant="contained" color="primary" onClick={handleAddCareer} >
        Add Career
      </Button>

      <DataTable
        style={{ fontSize: '1em' }}
        value={careers}
        stripedRows
        tableStyle={{ marginTop:10,minWidth: '50rem' }}
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
      <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Add New Career</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="title"
            name="title"
            label="Career Name"
            type="text"
            fullWidth
            value={newCareer.title}
            onChange={handleInputChange}
          />
          <InputLabel htmlFor="career_cluster_id">Career Cluster</InputLabel>
          <Select
            id="career_cluster_id"
            name="career_cluster_id"
            label="LW 1"
            value={newCareer.career_cluster}
            onChange={handleInputChange}
            fullWidth
          >
            {clusters.map((cluster) => (
              <MenuItem key={cluster.id} value={cluster.id}>
                {cluster.name}
              </MenuItem>
            ))}
          </Select>
          <InputLabel htmlFor="lwdimension_field1_id">LW Dimension 1</InputLabel>
          <Select
            id="lwdimension_field1_id"
            name="lwdimension_field1_id"
            label="LW 1"
            value={newCareer.lwdimension_field1_id}
            onChange={handleInputChange}
            fullWidth
          >
            {bucket.map((cluster) => (
              <MenuItem key={cluster.id} value={cluster.id}>
                {cluster.feature}
              </MenuItem>
            ))}
          </Select>
          <InputLabel htmlFor="lwdimension_field2_id">LW Dimension 2</InputLabel>
          <Select
            id="lwdimension_field2_id"
            name="lwdimension_field2_id"
            label="LW 2"
            value={newCareer.lwdimension_field2_id}
            onChange={handleInputChange}
            fullWidth
          >
            {bucket.map((cluster) => (
              <MenuItem key={cluster.id} value={cluster.id}>
                {cluster.feature}
              </MenuItem>
            ))}
          </Select>
          <InputLabel htmlFor="lwdimension_field3_id">LW Dimension 3</InputLabel>
          <Select
            id="lwdimension_field3_id"
            name="lwdimension_field3_id"
            label="LW 3"
            value={newCareer.lwdimension_field3_id}
            onChange={handleInputChange}
            fullWidth
          >
            {bucket.map((cluster) => (
              <MenuItem key={cluster.id} value={cluster.id}>
                {cluster.feature}
              </MenuItem>
            ))}
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={openConfirmationDialog}
        onClose={handleCancelDelete}
        fullWidth
        aria-labelledby="confirmation-dialog-title"
      >
        <DialogTitle id="confirmation-dialog-title">Confirm Delete</DialogTitle>
        <DialogContent>
          <p>Are you sure you want to delete this career?</p><strong>Will affect the reports generated</strong>
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
  );
}
