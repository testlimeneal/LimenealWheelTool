import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { Box, Autocomplete, TextField, Fab, CircularProgress } from '@material-ui/core';
import configData from '../../../config';
// import { IconFileTypePdf } from '@tabler/icons';
import { IconButton } from '@material-ui/core';
import PictureAsPdfIcon from '@material-ui/icons/PictureAsPdf';
import CheckIcon from '@material-ui/icons/Check';
import SaveIcon from '@material-ui/icons/Save';
import { green } from '@material-ui/core/colors';

import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';

// import Table from '@mui/material/Table';
import MainCard from '../../../ui-component/cards/MainCard';
// import SecondaryAction from './../../ui-component/cards/CardSecondaryAction';

export default function Reports() {
    const account = useSelector((state) => state.account);

    
    const [success, setSuccess] = React.useState([]);
    const [loading, setLoading] = React.useState([]);
    

    const getButtonSx = (index) => ({
        ...(success[index] && {
            bgcolor: green[500],
            '&:hover': {
                bgcolor: green[700]
            }
        })
    });
    
    const updateSuccessAtIndex = (index) => setSuccess(prevSuccess => [...prevSuccess.slice(0, index), !prevSuccess[index], ...prevSuccess.slice(index + 1)]);
    const updateLoadingAtIndex = (index) => setLoading(prevLoading => [...prevLoading.slice(0, index), !prevLoading[index], ...prevLoading.slice(index + 1)]);


    const handleButtonClick = async (i,index) => {
        updateLoadingAtIndex(index);
        try {
            const res = await axios.post(
                `${configData.API_SERVER}assessment/report/download?type=${selected}`,
                { id: i },
                {
                    headers: { Authorization: `${account.token}` },
                    responseType: 'blob' 
                }
            );
            updateSuccessAtIndex(index)
            updateLoadingAtIndex(index);
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

        // setSuccess(true);
        // setLoading(false);
    };

    const [data, setData] = React.useState([]);
    React.useEffect(async () => {
        const res = await axios.get(`${configData.API_SERVER}assessment/completed`, { headers: { Authorization: `${account.token}` } });
        setData(res.data);
        setLoading(new Array(res.data.length).fill(false))
        setSuccess(new Array(res.data.length).fill(false))
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
        { title: 'Career', year: 1994, step: 1 },
        { title: 'Leadership', year: 1972, step: 1 }
    ];

    const options = top100Films.map((option) => {
        return {
            ...option
        };
    });

    const [selected, setSelected] = React.useState('');

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
                            {data.map((row,index) => (
                                <TableRow key={row.name} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                    <TableCell component="th" scope="row">
                                        {row.id}
                                    </TableCell>
                                    <TableCell>18-10-2023</TableCell>
                                    {/* <TableCell>{row.title}</TableCell> */}
                                    <TableCell>{row.type}</TableCell>
                                    <TableCell style={{ display: 'flex' }}>
                                        {/* <IconButton onClick={() => handleDownload(row.id)} aria-label="download" size="large"> */}
                                        <Box sx={{ m: 1, position: 'relative' }}>
                                        <Fab aria-label="save" color="primary" sx={getButtonSx(index)} onClick={()=>{return !success[index] ? handleButtonClick(row.id,index) : null}}>
                                            {success[index] ? <CheckIcon /> : <SaveIcon />}
                                        </Fab>
                                        {loading[index] && (
                                            <CircularProgress
                                                size={68}
                                                sx={{
                                                    color: green[500],
                                                    position: 'absolute',
                                                    top: -6,
                                                    left: -6,
                                                    zIndex: 1
                                                }}
                                            />
                                        )}
                                        </Box>
                                        {/* </IconButton> */}
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
