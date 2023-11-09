import {
    Grid,
    TextField,
    FormHelperText,
    Select,
    MenuItem,
    InputLabel
  } from "@material-ui/core";
  
  const AccountDetails = (props) => {
    const { formik } = props;
    return (
      <Grid
        container
        minWidth={'100%'}
        spacing={2}
      >
        {/* <Grid
          item
          xs={12}
        >
          <TextField
            name="email_id"
            label="Email"
            variant="outlined"
            type="email"
            fullWidth
            size="small"
            error={Boolean(formik.touched.email && formik.errors.email)}
            onChange={formik.handleChange}
            value={formik.values.email}
          />
          
        </Grid> */}
        <Grid
          item
          xs={12}
        >
          <TextField
            name="name"
            label="Name"
            variant="outlined"
            type="text"
            fullWidth
            size="small"
            error={Boolean(formik.touched.name && formik.errors.name)}
            onChange={formik.handleChange}
            value={formik.values.name}
            helperText={formik.touched.name && formik.errors.name}
          />
          
        </Grid>

        <Grid item xs={6}>
        <InputLabel id="test-select-label">Date of Birth</InputLabel>
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
      <InputLabel id="test-select-label">Gender</InputLabel>

        <Select
          name="gender"
          label="Gender"
          variant="outlined"
          size="small"
          fullWidth
          value={formik.values.gender}
          onChange={formik.handleChange}
          error={formik.touched.gender && Boolean(formik.errors.gender)}
        >
          {['Male','Female','Other'].map((choice) => (
            <MenuItem key={choice} value={choice}>
              {choice}
            </MenuItem>
          ))}
        </Select>
      </Grid>

      <Grid item xs={6}>
      <InputLabel id="test-select-label">Marital Status</InputLabel>
        <Select
          name="status"
          label="Status"
          variant="outlined"
          size="small"
          fullWidth
          value={formik.values.status}
          onChange={formik.handleChange}
          error={formik.touched.status && Boolean(formik.errors.status)}
          helperText={formik.touched.status && formik.errors.status}
        >
          {['Married','Single','Widow'].map((choice) => (
            <MenuItem key={choice} value={choice}>
              {choice}
            </MenuItem>
          ))}
        </Select>
      </Grid>
      <Grid item xs={6}>
      <InputLabel id="test-select-label">Mobile Number</InputLabel>
        <TextField
          name="mobile_no"
          label=""
          variant="outlined"
          fullWidth
          size="small"
          value={formik.values.mobile_no}
          onChange={formik.handleChange}
          error={formik.touched.mobile_no && Boolean(formik.errors.mobile_no)}
          helperText={formik.touched.mobile_no && formik.errors.mobile_no}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          name="address"
          label="Address"
          variant="outlined"
          fullWidth
          multiline
          rows={4}
          value={formik.values.address}
          onChange={formik.handleChange}
          error={formik.touched.address && Boolean(formik.errors.address)}
          helperText={formik.touched.address && formik.errors.address}
        />
      </Grid>
        <Grid
          item
          xs={12}
        >
          {/* <TextField
            name="password"
            label="Password"
            variant="outlined"
            size='small'
            type="password"
            fullWidth
            error={Boolean(formik.touched.password && formik.errors.password)}
            onChange={formik.handleChange}
            value={formik.values.password}
          /> */}
        </Grid>
        <Grid
          item
          xs={12}
        >
          {/* <TextField
            name="confirmPassword"
            label="Confirm Password"
            variant="outlined"
            size="small"
            type="password"
            fullWidth
            error={Boolean(formik.touched.confirmPassword && formik.errors.confirmPassword)}
            onChange={formik.handleChange}
            value={formik.values.confirmPassword}
          /> */}
        </Grid>
        {console.log(formik)}
        {formik.errors.submit && (
          <Grid
            item
            xs={12}
          >
            <FormHelperText error>
              {formik.errors.submit}
            </FormHelperText>
          </Grid>
        )}
      </Grid>
    )
  }
  
  export default AccountDetails