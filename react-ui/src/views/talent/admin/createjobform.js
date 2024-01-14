import React, { useState, useEffect, useRef } from 'react';
import { Box, TextField, Button, Radio } from '@material-ui/core';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ColumnGroup } from 'primereact/columngroup';
import { Row } from 'primereact/row';
import Axios from '../../../config/axios';
import { InputNumber } from 'primereact/inputnumber';

import { InputText } from 'primereact/inputtext';
import { useFormik } from 'formik';

function addKeyValueToObjects(array, key, value) {
  array.forEach((obj) => {
    // Add the key-value pair to the top-level object
    obj[key] = value;

    // Check if the object has chiefvirtue property and add key-value pair
    if (obj.chiefvirtue && typeof obj.chiefvirtue === 'object') {
      obj.chiefvirtue[key] = value;
    }

    // Check if the object has traits property and it's an array
    if (obj.traits && Array.isArray(obj.traits)) {
      // Add the key-value pair to each object within traits array
      obj.traits.forEach((trait) => {
        if (typeof trait === 'object') {
          trait[key] = value;
        }
      });
    }
  });
}

function CreateJobForm() {
  const [forceUpdate, setForceUpdate] = useState(false);
  const [selectedPriorities, setSelectedPriorities] = useState({});

  const [step, setStep] = useState(1);
  // const [careerName, setCareerName] = useState('');
  // const [activities, setActivities] = useState('ASssssss\nSjjjjjjj');
  const [activitiesList, setActivitiesList] = useState([]);
  const formik = useFormik({
    initialValues: {
      careerName: '',
      activities: '',
    },
    // validationSchema,
    onSubmit: (values) => {
      // Handle form submission logic, e.g., calling nextStep()
      // setCareerName(values.careerName);
      // setActivities(values.activities);
      nextStep();
    },
  });

  useEffect(async () => {
    if (step === 2) {
      const res = await Axios.get('superadmin/get-dimensions/');
      function convertToSingleObject(jsonData) {
        // Initialize an object to store the result
        const resultObject = {};

        // Iterate through each item in the JSON data
        jsonData.forEach((item, index) => {
          const dimensionKey = `dimension${index + 1}`;

          // Dimension information
          resultObject[`${dimensionKey}_name`] = item.bucket.feature;
          resultObject[`${dimensionKey}_id`] = item.bucket.id;
          resultObject[`${dimensionKey}_value`] = 0;

          // Virtue information
          resultObject[`${dimensionKey}_virtue`] = item.virtue.virtue;
          resultObject[`${dimensionKey}_virtue_id`] = item.virtue.virtue_id;
          resultObject[`${dimensionKey}_virtue_value`] = 0;

          // Trait information for each trait
          Object.entries(item.traits).forEach(([traitKey, trait]) => {
            resultObject[`${dimensionKey}_trait${traitKey}_name`] = trait.name;
            resultObject[`${dimensionKey}_trait${traitKey}_id`] = trait.id;
            resultObject[`${dimensionKey}_trait${traitKey}_value`] = 0;
          });
        });

        return resultObject;
      }

      // Example usage with your provided JSON
      const jsonData = res.data;
      const singleObject = convertToSingleObject(jsonData);

      const temp2 = formik.values.activities.split('\n').map((e) => ({ activity: e }));

      for (let i = 0; i < temp2.length; i++) {
        for (let key in singleObject) {
          temp2[i][key] = singleObject[key];
        }
      }
      setActivitiesList(temp2);
    }
  }, [step]);

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const rowData = activitiesList[0];
  const headerGroup = (
    <ColumnGroup>
      <Row>
        <Column header={'Task'} rowSpan={3} />
      </Row>
    </ColumnGroup>
  );

  const renderPriorityRadioButtons = (rowData) => {
    const handleChange = (event) => {
      const { value } = event.target;
      setSelectedPriorities((prevSelectedPriorities) => ({
        ...prevSelectedPriorities,
        [rowData.activity]: value,
      }));
    };

    return (
      <div>
        <Radio
          name={`priority_${rowData.activity}`}
          value="High"
          onChange={handleChange}
          checked={selectedPriorities[rowData.activity] === 'High'}
        />
        High
        <Radio
          name={`priority_${rowData.activity}`}
          value="Medium"
          onChange={handleChange}
          checked={selectedPriorities[rowData.activity] === 'Medium'}
        />
        Medium
        <Radio
          name={`priority_${rowData.activity}`}
          value="Low"
          onChange={handleChange}
          checked={selectedPriorities[rowData.activity] === 'Low'}
        />
        Low
      </div>
    );
  };

  switch (step) {
    case 1:
      return (
        <div>
          <Box component={'form'} onSubmit={formik.handleSubmit}>
            <TextField
              name="careerName"
              value={formik.values.careerName}
              onChange={formik.handleChange}
              label="Career Name"
              variant="outlined"
              fullWidth
              sx={{ marginBottom: 2 }}
            />

            <TextField
              name="activities"
              value={formik.values.activities}
              onChange={formik.handleChange}
              multiline
              label="Tasks (Separated by Line)"
              variant="outlined"
              fullWidth
              sx={{ marginBottom: 2 }}
            />

            <Button variant="contained" onClick={nextStep}>
              Next
            </Button>
          </Box>
        </div>
      );

    case 2:
      return (
        <Box>
          <DataTable
            value={activitiesList}
            // headerColumnGroup={headerGroup}
            tableStyle={{ minWidth: '60rem', fontSize: '0.80rem' }}
            editMode="cell"
            style={{ fontSize: '0.5rem' }}
          >
            <Column field="activity" header='Tasks' />
            <Column body={renderPriorityRadioButtons} header="Priority" />

          </DataTable>
          <Button variant="contained" onClick={nextStep}>
            Next
          </Button>
        </Box>
      );

    default:
      return null;
  }
}

export default CreateJobForm;
