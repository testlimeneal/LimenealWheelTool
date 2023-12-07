import React from 'react';
import {
  Grid,
  TextField,
  FormHelperText,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from '@material-ui/core';

const EducationDetails = (props) => {
  const { formik } = props;

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <TextField
          name="school_name"
          label="School Name"
          variant="outlined"
          fullWidth
          size="small"
          value={formik.values.school_name}
          onChange={formik.handleChange}
          error={formik.touched.school_name && Boolean(formik.errors.school_name)}
          helperText={formik.touched.school_name && formik.errors.school_name}
        />
      </Grid>

      <Grid item xs={4}>
        <TextField
          name="school_grade"
          label="Grade"
          variant="outlined"
          fullWidth
          size="small"
          value={formik.values.school_grade}
          onChange={formik.handleChange}
          error={formik.touched.school_grade && Boolean(formik.errors.school_grade)}
          helperText={formik.touched.school_grade && formik.errors.school_grade}
        />
      </Grid>

      <Grid item xs={4}>
        <TextField
          name="school_division"
          label="Division"
          variant="outlined"
          fullWidth
          size="small"
          value={formik.values.school_division}
          onChange={formik.handleChange}
          error={formik.touched.school_division && Boolean(formik.errors.school_division)}
          helperText={formik.touched.school_division && formik.errors.school_division}
        />
      </Grid>
      

      <Grid item xs={4}>
        <FormControl sx={{ minWidth: '100%' }}>
          <InputLabel required id="board-label">
            Board
          </InputLabel>
          <Select
            labelId="board-label"
            id="school_board"
            label="Board"
            size="small"
            name="school_board"
            error={Boolean(formik.touched.school_board && formik.errors.school_board)}
            onChange={formik.handleChange}
            value={formik.values.school_board}
            helperText={formik.touched.school_board && formik.errors.school_board}
          >
            {['IB', 'ICSE', 'CBSE', 'UK', 'US', 'Others'].map((choice) => (
              <MenuItem key={choice} value={choice}>
                {choice}
              </MenuItem>
            ))}
          </Select>
          {formik.values.school_board === 'Others' && (
            <TextField
              name="otherBoard"
              label="Other Board"
              variant="outlined"
              fullWidth
              size="small"
              value={formik.values.otherBoard}
              onChange={formik.handleChange}
              error={formik.touched.otherBoard && Boolean(formik.errors.otherBoard)}
              helperText={formik.touched.otherBoard && formik.errors.otherBoard}
              sx={{marginTop:2}}
            />
          )}
          <FormHelperText error>{formik.errors.school_board}</FormHelperText>
        </FormControl>
      </Grid>
      <Grid item xs={6}>
        <TextField
          name="college_name"
          label="College Name"
          variant="outlined"
          fullWidth
          size="small"
          value={formik.values.college_name}
          onChange={formik.handleChange}
          error={formik.touched.college_name && Boolean(formik.errors.college_name)}
          helperText={formik.touched.college_name && formik.errors.college_name}
        />
      </Grid>
      <Grid item xs={6}>
        <TextField
          name="university_name"
          label="University"
          variant="outlined"
          fullWidth
          size="small"
          value={formik.values.university_name}
          onChange={formik.handleChange}
          error={formik.touched.university_name && Boolean(formik.errors.university_name)}
          helperText={formik.touched.university_name && formik.errors.university_name}
        />
      </Grid>

      

      <Grid item xs={6}>
        <TextField
          name="specialization"
          label="Specialization"
          variant="outlined"
          fullWidth
          size="small"
          value={formik.values.specialization}
          onChange={formik.handleChange}
          error={formik.touched.specialization && Boolean(formik.errors.specialization)}
          helperText={formik.touched.specialization && formik.errors.specialization}
        />
      </Grid>

      <Grid item xs={6}>
        <TextField
          name="qualification"
          label="Existing Qualification/Degree (Optional)"
          variant="outlined"
          fullWidth
          size="small"
          value={formik.values.qualification}
          onChange={formik.handleChange}
          error={formik.touched.qualification && Boolean(formik.errors.qualification)}
          helperText={formik.touched.qualification && formik.errors.qualification}
        />
      </Grid>
    </Grid>
  );
};

export default EducationDetails;
