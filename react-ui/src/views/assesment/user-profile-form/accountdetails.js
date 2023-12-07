import { Grid, TextField, FormHelperText, Select, MenuItem, InputLabel, FormControl } from '@material-ui/core';

const AccountDetails = (props) => {
    const { formik } = props;
    return (
        <Grid container minWidth={'100%'} spacing={2}>
            <Grid item xs={1.02}>
                <FormControl fullWidth>
                    <InputLabel required id="demo-simple-select-helper-label">Title</InputLabel>
                    <Select
                        id="demo-simple-select-helper"
                        label="Title"
                        variant="outlined"
                        size="small"
                        name="title"
                        error={Boolean(formik.touched.title && formik.errors.title)}
                        onChange={formik.handleChange}
                        value={formik.values.title}
                        helperText={formik.touched.title && formik.errors.title}
                        
                    >
                        <MenuItem value={'Mr'}>Mr.</MenuItem>
                        <MenuItem value={'Mrs'}>Mrs.</MenuItem>
                        <MenuItem value={'Ms'}>Ms.</MenuItem>
                        <MenuItem value={'Dr'}>Dr.</MenuItem>
                    </Select>
                    <FormHelperText error>{formik.errors.title}</FormHelperText>
                </FormControl>
            </Grid>
            <Grid item xs={3.66}>
                <TextField
                    name="first_name"
                    required
                    label="First Name"
                    variant="outlined"
                    type="text"
                    fullWidth
                    size="small"
                    error={Boolean(formik.touched.first_name && formik.errors.first_name)}
                    onChange={formik.handleChange}
                    value={formik.values.first_name}
                    helperText={formik.touched.first_name && formik.errors.first_name}
                />
            </Grid>
            <Grid item xs={3.66}>
                <TextField
                    name="middle_name"
                    label="Middle Name"
                    variant="outlined"
                    type="text"
                    fullWidth
                    size="small"
                    error={Boolean(formik.touched.middle_name && formik.errors.middle_name)}
                    onChange={formik.handleChange}
                    value={formik.values.middle_name}
                    helperText={formik.touched.middle_name && formik.errors.middle_name}
                />
            </Grid>
            <Grid item xs={3.66}>
                <TextField
                    name="last_name"
                    required
                    label="Last Name"
                    variant="outlined"
                    type="text"
                    fullWidth
                    size="small"
                    error={Boolean(formik.touched.last_name && formik.errors.last_name)}
                    onChange={formik.handleChange}
                    value={formik.values.last_name}
                    helperText={formik.touched.last_name && formik.errors.last_name}
                />
            </Grid>

            <Grid item xs={6}>
                <InputLabel required id="test-select-label">
                    Date of Birth
                </InputLabel>
                <TextField
                    name="dob"
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
                <InputLabel required id="test-select-label">
                    Gender
                </InputLabel>

                <Select
                    name="gender"
                    label="Gender"
                    variant="outlined"
                    size="small"
                    fullWidth
                    value={formik.values.gender}
                    onChange={formik.handleChange}
                    error={formik.touched.gender && Boolean(formik.errors.gender)}
                    helperText={formik.touched.dob && formik.errors.dob}
                >
                    {['Male', 'Female', 'Other'].map((choice) => (
                        <MenuItem key={choice} value={choice}>
                            {choice}
                        </MenuItem>
                    ))}
                </Select>
                <FormHelperText error>{formik.errors.gender}</FormHelperText>
            </Grid>

            <Grid item xs={6}>
                <InputLabel required id="test-select-label">
                    Marital Status
                </InputLabel>
                <Select
                    name="marital_status"
                    label="Marital Status"
                    variant="outlined"
                    size="small"
                    fullWidth
                    value={formik.values.marital_status}
                    onChange={formik.handleChange}
                    error={formik.touched.marital_status && Boolean(formik.errors.marital_status)}
                    helperText={formik.touched.marital_status && formik.errors.marital_status}
                >
                    {['Married', 'Single', 'Widow'].map((choice) => (
                        <MenuItem key={choice} value={choice}>
                            {choice}
                        </MenuItem>
                    ))}
                </Select>
                <FormHelperText error>{formik.errors.marital_status}</FormHelperText>
            </Grid>
            <Grid item xs={6}>
                <InputLabel required id="test-select-label">
                    Professional Status
                </InputLabel>
                <Select
                    name="professional_status"
                    label="Professional Status"
                    variant="outlined"
                    size="small"
                    fullWidth
                    value={formik.values.professional_status}
                    onChange={formik.handleChange}
                    error={formik.touched.professional_status && Boolean(formik.errors.professional_status)}
                    helperText={formik.touched.professional_status && formik.errors.professional_status}
                >
                    {['Working', 'Student', 'Retired'].map((choice) => (
                        <MenuItem key={choice} value={choice}>
                            {choice}
                        </MenuItem>
                    ))}
                </Select>
                <FormHelperText error>{formik.errors.professional_status}</FormHelperText>
            </Grid>
            <Grid item xs={6}>
                <InputLabel required id="test-select-label">
                    Primary Mobile Number
                </InputLabel>
                <TextField
                    name="primary_mobile_no"
                    label=""
                    variant="outlined"
                    fullWidth
                    size="small"
                    value={formik.values.primary_mobile_no}
                    onChange={formik.handleChange}
                    error={formik.touched.primary_mobile_no && Boolean(formik.errors.primary_mobile_no)}
                    helperText={formik.touched.primary_mobile_no && formik.errors.primary_mobile_no}
                />
            </Grid>
            <Grid item xs={6}>
                <InputLabel id="test-select-label">Secondary Mobile Number</InputLabel>
                <TextField
                    name="secondary_mobile_no"
                    label=""
                    variant="outlined"
                    fullWidth
                    size="small"
                    value={formik.values.secondary_mobile_no}
                    onChange={formik.handleChange}
                    error={formik.touched.secondary_mobile_no && Boolean(formik.errors.secondary_mobile_no)}
                    helperText={formik.touched.secondary_mobile_no && formik.errors.secondary_mobile_no}
                />
            </Grid>
            <Grid item xs={6}>
                <TextField
                    required
                    name="residential_address"
                    label="Residential Address"
                    variant="outlined"
                    fullWidth
                    multiline
                    rows={4}
                    value={formik.values.residential_address}
                    onChange={formik.handleChange}
                    error={formik.touched.residential_address && Boolean(formik.errors.residential_address)}
                    helperText={formik.touched.residential_address && formik.errors.residential_address}
                />
            </Grid>
            <Grid item xs={6}>
                <TextField
                    name="current_address"
                    label="Current Address"
                    variant="outlined"
                    fullWidth
                    multiline
                    rows={4}
                    value={formik.values.current_address}
                    onChange={formik.handleChange}
                    error={formik.touched.current_address && Boolean(formik.errors.current_address)}
                    helperText={formik.touched.current_address && formik.errors.current_address}
                />
            </Grid>
        </Grid>
    );
};

export default AccountDetails;
