import {
    TextField,
    Grid,
    Select,
    MenuItem,
    Box,
    Chip,
    OutlinedInput,
    useTheme,
    InputLabel,
    FormHelperText,
    Typography
} from '@material-ui/core';
import { useEffect, useState } from 'react';
import configData from '../../../config';
import axios from 'axios';

const PersonalInfo = (props) => {
    const { formik } = props;
    const theme = useTheme();

    const [selectedCluster1, setSelectedCluster1] = useState('');
    const [selectedCluster2, setSelectedCluster2] = useState('');

    const [selectedCluster1Jobs, setSelectedCluster1Jobs] = useState([]);
    const [selectedCluster2Jobs, setSelectedCluster2Jobs] = useState([]);

    const [cluster, setCluster] = useState([]);

    useEffect(async () => {
        const res = await axios.get(`${configData.API_SERVER}assessment/form/data`);
        const groupedData = res.data.jobs.reduce((acc, item) => {
            const clusterName = item.career_cluster.name;

            if (!acc[clusterName]) {
                acc[clusterName] = [];
            }

            acc[clusterName].push(item);
            return acc;
        }, {});

        setCluster(groupedData);
    }, []);

    useEffect(() => {
        formik.setFieldValue('job_aspirations', selectedCluster1Jobs.concat(selectedCluster2Jobs));
    }, [selectedCluster1Jobs, selectedCluster2Jobs]);

    useEffect(() => {
        setSelectedCluster1Jobs([]);
        setSelectedCluster2('')
        setSelectedCluster2Jobs([]);
    }, [selectedCluster1]);
    useEffect(() => {
        setSelectedCluster2Jobs([]);
    }, [selectedCluster2]);

    function getStyles(name, personName, theme) {
        return {
            fontWeight: personName.indexOf(name) === -1 ? theme.typography.fontWeightRegular : theme.typography.fontWeightMedium
        };
    }

    const ITEM_HEIGHT = 48;
    const ITEM_PADDING_TOP = 8;
    const MenuProps = {
        PaperProps: {
            style: {
                maxHeight: ITEM_HEIGHT * 3.5 + ITEM_PADDING_TOP,
                width: 250
            }
        }
    };

    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <Typography textAlign={'center'} fontSize={'1rem'} bgcolor={'beige'} width={'auto'}>Careers (Add upto 5 career paths overall from Cluster 1 and Cluster 2.</Typography>
            </Grid>
            <Grid item xs={6}>
                <>
                    <InputLabel required id="test-select-label">
                        Career Cluster 1
                    </InputLabel>
                    <Select
                        // name="career_cluster1"
                        label="Job Aspirations"
                        variant="outlined"
                        size="small"
                        fullWidth
                        value={selectedCluster1}
                        onChange={(e) => setSelectedCluster1(e.target.value)}
                        labelId="test-select-label"
                    >
                        {Object.keys(cluster) &&
                            Object.keys(cluster).map((choice) => (
                                <MenuItem key={choice} value={choice}>
                                    {choice}
                                </MenuItem>
                            ))}
                    </Select>
                </>
            </Grid>

            <Grid item xs={6}>
                <InputLabel id="test-select-label">Career Cluster 2</InputLabel>
                <Select
                    disabled={!selectedCluster1Jobs.length}
                    // name="job_aspirations"
                    label="Job Aspirations"
                    variant="outlined"
                    size="small"
                    fullWidth
                    value={selectedCluster2}
                    onChange={(e) => setSelectedCluster2(e.target.value)}
                    labelId="test-select-label"
                >
                    {Object.keys(cluster) &&
                        Object.keys(cluster)
                            .filter((key) => key !== selectedCluster1)
                            .map((choice) => (
                                <MenuItem key={choice} value={choice}>
                                    {choice}
                                </MenuItem>
                            ))}
                </Select>
            </Grid>

            <Grid item xs={6}>
                <InputLabel required id="test-select-label">
                    Career Paths 1
                </InputLabel>
                <Select
                    disabled={!selectedCluster1.length}
                    // name="job_aspirations"
                    label="Job Aspirations"
                    variant="outlined"
                    size="small"
                    fullWidth
                    multiple
                    value={selectedCluster1Jobs}
                    onChange={(e) => setSelectedCluster1Jobs(e.target.value)}
                    labelId="test-select-label"
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
                    {selectedCluster1.length &&
                        cluster[selectedCluster1].map((choice) => (
                            <MenuItem
                                key={choice.id}
                                value={`${choice.id}.${choice.title}`}
                                style={getStyles(choice, selectedCluster1Jobs, theme)}
                            >
                                {choice.title}
                            </MenuItem>
                        ))}
                </Select>
                <FormHelperText error>{formik.touched.job_aspirations && formik.errors.job_aspirations}</FormHelperText>
            </Grid>

            <Grid item xs={6}>
                <InputLabel id="test-select-label">Career Paths 2</InputLabel>
                <Select
                    disabled={!selectedCluster2.length}
                    // name="job_aspirations"
                    label="Job Aspirations"
                    variant="outlined"
                    size="small"
                    fullWidth
                    multiple
                    value={selectedCluster2Jobs}
                    onChange={(e) => setSelectedCluster2Jobs(e.target.value)}
                    labelId="test-select-label"
                    renderValue={(selected) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {console.log(selected)}
                            {selected.map((value) => (
                                <Chip key={value} label={`${value.slice(2)}`} />
                            ))}
                        </Box>
                    )}
                    MenuProps={MenuProps}
                    input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
                    error={formik.touched.job_aspirations && Boolean(formik.errors.job_aspirations)}
                >
                    {selectedCluster2.length &&
                        cluster[selectedCluster2].map((choice) => (
                            <MenuItem
                                key={choice.id}
                                value={`${choice.id}.${choice.title}`}
                                style={getStyles(choice, formik.values.job_aspirations, theme)}
                            >
                                {choice.title}
                            </MenuItem>
                        ))}
                </Select>
                <FormHelperText error>{formik.touched.job_aspirations && formik.errors.job_aspirations}</FormHelperText>
            </Grid>

            <Grid item xs={12}>
                <TextField
                    name="goals"
                    label="Your Career Objective / Goal"
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
            <Grid item xs={6}>
                <InputLabel required id="hobbies-label">
                    Preferred Hobbies/Interests (Top 3)
                </InputLabel>
                <TextField
                    name="hobbies"
                    label="Hobbies/Interests"
                    variant="outlined"
                    size="small"
                    fullWidth
                    value={formik.values.hobbies}
                    onChange={formik.handleChange}
                    error={formik.touched.hobbies && Boolean(formik.errors.hobbies)}
                    helperText={formik.touched.hobbies && formik.errors.hobbies}
                />
            </Grid>

            <Grid item xs={6}>
                <InputLabel id="sports-label">Do you enjoy playing sports?</InputLabel>
                <Select
                    // name="enjoy_sports"
                    label="Enjoy Sports"
                    variant="outlined"
                    size="small"
                    fullWidth
                    value={formik.values.enjoy_sports}
                    onChange={(e) => formik.setFieldValue('enjoy_sports', e.target.value)}
                    labelId="sports-label"
                >
                    {['Yes', 'No'].map((choice) => (
                        <MenuItem key={choice} value={choice}>
                            {choice}
                        </MenuItem>
                    ))}
                </Select>
            </Grid>

            {formik.values.enjoy_sports === 'Yes' && (
                <Grid item xs={6}>
                    <InputLabel required id="interested-sports-label">
                        Any 2 Most Interested Sports
                    </InputLabel>
                    <TextField
                        name="interested_sports"
                        label="Interested Sports"
                        variant="outlined"
                        size="small"
                        fullWidth
                        value={formik.values.interested_sports}
                        onChange={formik.handleChange}
                        error={formik.touched.interested_sports && Boolean(formik.errors.interested_sports)}
                        helperText={formik.touched.interested_sports && formik.errors.interested_sports}
                    />
                </Grid>
            )}
        </Grid>
    );
};

export default PersonalInfo;
