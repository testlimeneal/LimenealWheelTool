import React, { useEffect, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import Axios from '../../../../config/axios';
import { Chip,Button } from '@material-ui/core';
import {  toast } from 'react-toastify';


const HelloWorld = () => {
  const [users, setUsers] = useState([]);
  const [expandedRows, setExpandedRows] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);


  useEffect(() => {
    async function fetchData() {
      try {
        const response = await Axios.get('superadmin/get-users/');
        setUsers(response.data);
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
  const handleDownload = async(user_id) => {
    console.log(user_id)
    
    const hasNotProcessed = selectedRows.some(item => item.status === "Not Processed");
    const payload = {user_id,processed:!hasNotProcessed,data: selectedRows}
    const responseType = hasNotProcessed ? 'json' : 'blob';

    const res = await Axios.post('superadmin/download_reports/',payload, {
      responseType,
    })

    console.log(res,"Response")
    
    if (!hasNotProcessed) {
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'your-filename.zip');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      console.log(res.data)
      toast(res.data.msg,{ autoClose: 7000 });
    }
    // console.log(hasNotProcessed)
    // console.log('Selected Rows for Download:', temp);
    setExpandedRows([]);
  };
  const rowExpansionTemplate = (data) => {
    // selectedRows = []
    // console.log(data)
    return (
      <div className="p-3">
        <Button onClick={()=>handleDownload(data.id)} variant="contained" style={{marginBottom:20}} disabled={!selectedRows.length}>Download</Button>

        <DataTable tableStyle={{fontSize:'1em'}} style={{fontSize:'1em'}} value={data.allowed_reports}  selection={selectedRows}
        onSelectionChange={(e) => setSelectedRows(e.value)}>
          <Column selectionMode="multiple" headerStyle={{ width: '3rem' }}></Column>
          <Column field="combinedColumn" header="Level - Report Type" body={(rowData) => `${rowData.level} - ${rowData.report_type}`} />
          <Column field="status" header="Report Status" />
          <Column field="payment" header="Payment Status" />

        </DataTable>
      </div>
    );
  };

  return (
    <div>
      <DataTable
        value={users}
        expandedRows={expandedRows}
        onRowToggle={(e) => setExpandedRows(e.data)}
        rowExpansionTemplate={rowExpansionTemplate}
        onRowExpand={()=> setSelectedRows([])}
        stripedRows
        filterDisplay="row"
        style={{ fontSize: '1em' }}
        paginator
        rows={15}
      >
        <Column expander={true} style={{ width: '5rem' }} />
        <Column field="user" header="User" filter />
        <Column field="username" header="Username" />
        <Column field="date" header="Date" body={(rowData) => <span>{formatDate(rowData.date)}</span>} />
        <Column
          field="status"
          header="Status"
          body={(rowData) => (
            <Chip label={rowData.status} color="primary" style={{ background: getStatusColor(rowData.status) }} />
          )}
        />
      </DataTable>
    </div>
  );
};

export default HelloWorld;
