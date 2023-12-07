import { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Box, Stepper, Step, StepLabel, Grid, FormHelperText, Button } from '@material-ui/core';
import PersonalInfo from './personalinfo';
import AccountDetails from './accountdetails';
import EducationDetails from './educationdetails';
import ReviewInfo from './reviewinfo';
import axios from 'axios';
import configData from '../../../config';
//Job Search Bar
import { useSelector } from 'react-redux';

const steps = [' Account Details', 'Education Details', 'Personal Info', 'Review and Submit'];

const Form = (props) => {
    const [activeStep, setActiveStep] = useState(0);
    const account = useSelector((state) => state.account);
    const { setIsRegistered } = props;
    const handleBack = () => {
        setActiveStep((prevStep) => prevStep - 1);
    };

    const validationSchema = (activeStep) => {
        switch (activeStep) {
            case 0:
                return Yup.object().shape({
                    first_name: Yup.string().required('First Name is required'),
                    title: Yup.string().required('required'),
                    last_name: Yup.string().required('Last Name is required'),
                    dob: Yup.date().required('Date of birth is required'),
                    gender: Yup.string().required('Gender is required'),
                    professional_status: Yup.string().required('Status is required'),
                    primary_mobile_no: Yup.string().required('Mobile number is required'),
                    residential_address: Yup.string().required('Address is required')
                });
            case 2:
                return Yup.object().shape({
                    job_aspirations: Yup.array()
                        .min(1, 'At least one job aspiration is required')
                        .max(5, 'You can have up to 5 job aspirations')
                        .of(Yup.string())
                        .required('Job aspirations are required'),
                    goals: Yup.string().required('Goals are required')
                });

            default:
                return Yup.object();
        }
    };

    const formik = useFormik({
        initialValues: {
            //step1
            title: '',
            first_name: '',
            middle_name: '',
            last_name: '',
            dob: '',
            gender: '',
            marital_status: '',
            professional_status: '',
            primary_mobile_no: '',
            secondary_mobile_no: '',
            residential_address: '',
            current_address: '',

            //step2
            school_name: '',
            school_grade: '',
            school_divion: '',
            school_board: '',
            otherBoard: '',
            college_name: '',
            university_name: '',
            specialization: '',
            qualification: '',

            //step3
            job_aspirations: [],
            goals: '',
            hobbies: '',
            enjoy_sports: '',
            
        },
        validationSchema: validationSchema(activeStep),
        onSubmit: async () => {
            console.log(activeStep);
            if (activeStep === steps.length - 1) {
                const formValues = formik.values;

                const fullName = `${formValues.title}. ${formValues.first_name} ${formValues.middle_name ? formValues.middle_name + ' ' : ''}${formValues.last_name}`;
                formValues['name'] = fullName.trim();


                formValues['job_aspirations'] = formValues['job_aspirations'].map((item) => parseInt(item, 10));
                if(formValues.school_board === 'Others') {
                    formValues.school_board = formValues.otherBoard
                }

                if(formValues.enjoy_sports === 'No') {
                    formValues.interested_sports = ''  
                }

                await axios.post(`${configData.API_SERVER}assessment/user-profiles/`, formValues, {
                    headers: { Authorization: `${account.token}` }
                });
                setActiveStep((prevStep) => prevStep + 1);
                setIsRegistered(true);
            } else {
                setActiveStep((prevStep) => prevStep + 1);
            }
        }
    });

    const formContent = (step) => {
        switch (step) {
            case 0:
                return <AccountDetails formik={formik} />;
            case 1:
                return <EducationDetails formik={formik} />;
            case 2:
                return <PersonalInfo formik={formik} />;
            case 3:
                return <ReviewInfo formik={formik} />;
            default:
                return <div></div>;
        }
    };

    return (
        <Box
            sx={{
                padding: 2
            }}
        >
            <Stepper activeStep={activeStep} orientation="horizontal">
                {steps.map((label, index) => (
                    <Step key={index}>
                        <StepLabel>{label}</StepLabel>
                    </Step>
                ))}
            </Stepper>
            <Grid container>
                <Grid item xs={12} sx={{ padding: '20px' }}>
                    {formContent(activeStep)}
                </Grid>
                {formik.errors.submit && (
                    <Grid item xs={12}>
                        <FormHelperText error>{formik.errors.submit}</FormHelperText>
                    </Grid>
                )}
                <Grid item xs={12}>
                    <Button disabled={activeStep === 0} onClick={handleBack}>
                        Back
                    </Button>
                    {activeStep === steps.length - 1 ? (
                        <Button onClick={formik.handleSubmit}>Submit</Button>
                    ) : (
                        <Button onClick={formik.handleSubmit}>Next</Button>
                    )}
                </Grid>
            </Grid>
        </Box>
    );
};

export default Form;
