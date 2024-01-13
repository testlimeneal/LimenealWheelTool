import React, { useEffect, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import Axios from '../../../config/axios';
import { Chip, Button, Autocomplete, TextField } from '@material-ui/core';
import { toast } from 'react-toastify';

const AdminDataTable = () => {
  const [users, setUsers] = useState([]);
  const [expandedRows, setExpandedRows] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedValue, setSelectedValue] = useState(null);
  const [adminusers, setAdminUsers] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await Axios.get(`superadmin/get-clientsubadmins/${selectedValue.user_id}/`);
        setUsers(response.data.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    if (selectedValue) {
      fetchData();
    } else {
      setUsers([]);
    }
  }, [selectedValue]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await Axios.get('superadmin/get-clientadmins/');
        setAdminUsers(response.data.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    fetchData();
  }, []);
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  const getStatusColor = (status) => {
    switch (status) {
      case 'Not Filled up the Form':
        return 'red';
      case 'Profile Form Filled':
        return 'yellow';
      case 'Level1 Test Given':
        return 'green';
      case 'Level2 Test Given':
        return 'blue';
      case 'Given all three tests':
        return 'purple';
      default:
        return 'white'; // Default color or choose a color for other cases
    }
  };
  const handleDownload = async (user_id) => {
    console.log(user_id);

    const hasNotProcessed = selectedRows.some((item) => item.status === 'Not Processed');
    const payload = { user_id, processed: !hasNotProcessed, data: selectedRows };
    const responseType = hasNotProcessed ? 'json' : 'blob';

    const res = await Axios.post('superadmin/download_reports/', payload, {
      responseType,
    });
    if (!hasNotProcessed) {
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'your-filename.zip');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      console.log(res.data);
      toast(res.data.msg, { autoClose: 7000 });
    }
    // console.log(hasNotProcessed)
    // console.log('Selected Rows for Download:', temp);
    setExpandedRows([]);
  };
  const rowExpansionTemplate = (data) => {
    // selectedRows = []
    console.log(data);
    return (
      <div className="p-3">
        {/* <Button onClick={()=>handleDownload(data.id)} variant="contained" style={{marginBottom:20}} disabled={!selectedRows.length}>Download</Button> */}
        <DataTable
          tableStyle={{ fontSize: '0.85em' }}
          style={{ fontSize: '1em' }}
          value={[data]}
          // selection={selectedRows}
          // onSelectionChange={(e) => setSelectedRows(e.value)}
        >
          {/* <Column selectionMode="multiple" headerStyle={{ width: '3rem' }}></Column> */}
          <Column field="user_email" header="User Email" />
          <Column field="user_username" header="User Username" />
          <Column field="org_client_name" header="Organization Client Name" />
          <Column field="address" header="Address" />
          <Column field="type_of_business" header="Type of Business" />
          <Column field="pan_no" header="PAN Number" />
          <Column field="gst_no" header="GST Number" />
          <Column field="uid" header="UID" />
          <Column field="admin_name" header="Admin Name" />
          <Column field="admin_designation" header="Admin Designation" />
          <Column field="employment_status" header="Employment Status" />
          <Column field="admin_contact_details" header="Admin Contact Details" />
          <Column field="admin_address" header="Admin Address" />
          <Column field="admin_email_id" header="Admin Email ID" />
          <Column field="lp1" header="LP1" />
          <Column field="lp2" header="LP2" />
          <Column field="lp3" header="LP3" />
          <Column field="ltb" header="LTB" />
          <Column field="ltf" header="LTF" />
        </DataTable>
      </div>
    );
  };

  const handleOnChange = (event, value) => {
    setSelectedValue(value);
  };

  return (
    <div>
      <Autocomplete
        sx={{marginBottom:2}}
        value={selectedValue}
        onChange={handleOnChange}
        id="combo-box-demo"
        options={adminusers}
        getOptionLabel={(option) =>
          `Email: ${option.user_email} | Org Client Name: ${option.org_client_name} | Admin Name: ${option.admin_name} | Admin Email: ${option.admin_email_id}`
        }
        renderInput={(params) => <TextField {...params} label="Created Under Admin" />}
        // onChange={handleOnChange}
      />
     {selectedValue ?  <DataTable
        value={users}
        expandedRows={expandedRows}
        onRowToggle={(e) => setExpandedRows(e.data)}
        rowExpansionTemplate={rowExpansionTemplate}
        onRowExpand={() => setSelectedRows([])}
        stripedRows
        filterDisplay="row"
        style={{ fontSize: '1em' }}
        paginator
        rows={15}
      >
        <Column expander={true} style={{ width: '1rem' }} />
        <Column field="org_client_name" header="Client Name" filter />
        <Column field="user_email" header="Client Email" />
        <Column field="user_username" header="Client Username" />
        {/* <Column field="date" header="Date" body={(rowData) => <span>{formatDate(rowData.date)}</span>} />
        <Column
          field="status"
          header="Status"
          body={(rowData) => (
            <Chip label={rowData.status} color="primary" style={{ background: getStatusColor(rowData.status) }} />
          )}
        /> */}
      </DataTable> : null}
    </div>
  );
};

export default AdminDataTable;
