import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { Box, Autocomplete, TextField } from '@material-ui/core';
import configData from '../../../config';
// import { IconFileTypePdf } from '@tabler/icons';
import { IconButton } from '@material-ui/core';
import PictureAsPdfIcon from '@material-ui/icons/PictureAsPdf';

import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';

// import Table from '@mui/material/Table';
import MainCard from '../../../ui-component/cards/MainCard';
// import SecondaryAction from './../../ui-component/cards/CardSecondaryAction';

export default function Reports() {
    const account = useSelector((state) => state.account);
    const [data, setData] = React.useState([]);
    React.useEffect(async () => {
        const res = await axios.get(`${configData.API_SERVER}assessment/completed`, { headers: { Authorization: `${account.token}` } });
        setData(res.data);
        // const test = res.data.questions.map((i, index) => ({ ...i, ranking: {} }));
        // setData(test);
    }, []);
    function createData(name, calories, fat, carbs, protein) {
        return { name, calories, fat, carbs, protein };
    }

    const handleDownload = async (i) => {
        try {
            const res = await axios.post(
                `${configData.API_SERVER}assessment/report/download?type=${selected}`,
                { id: i },
                {
                    headers: { Authorization: `${account.token}` },
                    responseType: 'blob' // Set the responseType to 'blob' for binary data
                }
            );
            console.log(res.headers);
            const contentDisposition = res.headers['content-disposition'];
            const filename = contentDisposition.split('filename=')[1];

            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'Report.pdf'); // Set the desired file name and extension
            document.body.appendChild(link);
            link.click();

            // Cleanup
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error downloading the file:', error);
        }
    };

    const top100Films = [
        { title: 'Career', year: 1994 ,step:1},
        { title: 'Leadership', year: 1972,step:1 }
    ];

    const options = top100Films.map((option) => {
        return {
            ...option
        };
    });

    const[selected,setSelected] = React.useState('')

    return (
        <MainCard title="Reports">
            <Box sx={{ flexGrow: 1 }}>
                
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Assessment ID</TableCell>
                                <TableCell>Assessment Date</TableCell>
                                <TableCell>Level</TableCell>
                                <TableCell>Download</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data.map((row) => (
                                <TableRow key={row.name} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                    <TableCell component="th" scope="row">
                                        {row.id}
                                    </TableCell>
                                    <TableCell>18-10-2023</TableCell>
                                    {/* <TableCell>{row.title}</TableCell> */}
                                    <TableCell>{row.type}</TableCell>
                                    <TableCell style={{display:'flex'}}>
                                        <IconButton   onClick={() => handleDownload(row.id)} aria-label="download" size="large">
                                            <PictureAsPdfIcon fontSize="inherit" />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </MainCard>
    );
}
