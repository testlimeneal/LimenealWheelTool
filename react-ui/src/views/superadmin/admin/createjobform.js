import React, { useState, useEffect, useRef } from 'react';
import { Box, TextField, Button } from '@material-ui/core';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ColumnGroup } from 'primereact/columngroup';
import { Row } from 'primereact/row';
import Axios from '../../../config/axios';
import { InputNumber } from 'primereact/inputnumber';

import { InputText } from 'primereact/inputtext';

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

  const [step, setStep] = useState(1);
  const [careerName, setCareerName] = useState('');
  const [activities, setActivities] = useState('');
  const [activitiesList, setActivitiesList] = useState([]);
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

      const temp2 = activities.split('\n').map((e) => ({ activity: e }));

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
      <Row>
        {rowData &&
          Array.from({ length: 9 }, (_, index) => index + 1).map((dimensionNumber) => (
            <Column key={dimensionNumber} header={rowData[`dimension${dimensionNumber}_name`]} colSpan={4} />
          ))}
      </Row>

      <Row>
        {rowData &&
          Array.from({ length: 9 }, (_, index) => index + 1).flatMap((dimensionNumber) => [
            <Column key={`${dimensionNumber}_virtue`} header={rowData[`dimension${dimensionNumber}_virtue`]} />,
            <Column key={`${dimensionNumber}_trait1`} header={rowData[`dimension${dimensionNumber}_trait1_name`]} />,
            <Column key={`${dimensionNumber}_trait2`} header={rowData[`dimension${dimensionNumber}_trait2_name`]} />,
            <Column key={`${dimensionNumber}_trait3`} header={rowData[`dimension${dimensionNumber}_trait3_name`]} />,
          ])}
      </Row>
    </ColumnGroup>
  );

  const cellEditor = (options) => {
    if (options.field === 'price') return priceEditor(options);
    else return textEditor(options);
  };
  const textEditor = (options) => {
    return (
      <InputText
        type="number"
        min={1}
        max={10}
        value={options.value}
        onChange={(e) => options.editorCallback(e.target.value)}
      />
    );
  };

  const priceEditor = (options) => {
    return (
      <InputNumber
        value={options.value}
        onValueChange={(e) => options.editorCallback(e.value)}
        mode="currency"
        currency="USD"
        locale="en-US"
      />
    );
  };

  const isPositiveInteger = (val) => {
    let str = String(val);

    str = str.trim();

    if (!str) {
      return false;
    }

    str = str.replace(/^0+/, '') || '0';
    let n = Math.floor(Number(str));

    return n !== Infinity && String(n) === str && n >= 0;
  };

  function calculateAverage(keys) {
    const array = activitiesList;
    if (array.length === 0 || !Array.isArray(keys) || keys.length === 0) {
      return 0;
    }

    const sumByKeys = keys.reduce((acc, key) => {
      const sum = array.reduce((innerAcc, obj) => innerAcc + parseFloat(obj[key]) || 0, 0);
      return { ...acc, [key]: sum };
    }, {});

    const totalCount = array.length;

    const overallSum = keys.reduce((acc, key) => acc + sumByKeys[key], 0);
    const overallAverage = overallSum / (totalCount * keys.length);

    return overallAverage;
  }

  const footerGroup = (
    <ColumnGroup>
      <Row>
        <Column footer="Average:" footerStyle={{ textAlign: 'right' }} />
        {activitiesList &&
          Array.from({ length: 9 }, (_, index) => index + 1).flatMap((dimensionNumber) => [
            <Column key={dimensionNumber} footer={calculateAverage([`dimension${dimensionNumber}_virtue_value`])} />,
            <Column key={dimensionNumber} footer={calculateAverage([`dimension${dimensionNumber}_trait1_value`])} />,
            <Column key={dimensionNumber} footer={calculateAverage([`dimension${dimensionNumber}_trait2_value`])} />,
            <Column key={dimensionNumber} footer={calculateAverage([`dimension${dimensionNumber}_trait3_value`])} />,
          ])}
      </Row>
      <Row>
        <Column footer="Dimension:" footerStyle={{ textAlign: 'right' }} />
        {activitiesList &&
          Array.from({ length: 9 }, (_, index) => index + 1).flatMap((dimensionNumber) => [
            <Column
              colSpan={4}
              key={dimensionNumber}
              footer={calculateAverage([
                `dimension${dimensionNumber}_virtue_value`,
                `dimension${dimensionNumber}_trait1_value`,
                `dimension${dimensionNumber}_trait2_value`,
                `dimension${dimensionNumber}_trait3_value`,
              ])}
            />,
          ])}
      </Row>
    </ColumnGroup>
  );

  const onCellEditComplete = (e) => {
    let { rowData, newValue, field, originalEvent: event } = e;

    switch (field) {
      case 'quantity':
      case 'price':
        if (isPositiveInteger(newValue)) rowData[field] = newValue;
        else event.preventDefault();
        break;

      default:
        if (newValue && newValue.trim().length > 0) rowData[field] = newValue;
        else event.preventDefault();
        break;
    }
    const temp = activitiesList;
    // setActivitiesList(temp);
    setForceUpdate((prev) => !prev);
  };

  switch (step) {
    case 1:
      return (
        <div>
          <Box>
            <TextField
              value={careerName}
              onChange={(e) => setCareerName(e.target.value)}
              label="Career Name"
              variant="outlined"
              fullWidth
              sx={{ marginBottom: 2 }}
            />

            <TextField
              value={activities}
              onChange={(e) => setActivities(e.target.value)}
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
            headerColumnGroup={headerGroup}
            footerColumnGroup={footerGroup}
            tableStyle={{ minWidth: '60rem', fontSize: '0.80rem' }}
            editMode="cell"
            style={{ fontSize: '0.5rem' }}
          >
            <Column field="activity" footer="gg" />
            {rowData &&
              Array.from({ length: 9 }, (_, index) => index + 1).flatMap((dimensionNumber) => [
                <Column
                  field={`dimension${dimensionNumber}_virtue_value`}
                  editor={(options) => cellEditor(options)}
                  onCellEditComplete={onCellEditComplete}
                />,
                <Column
                  field={`dimension${dimensionNumber}_trait1_value`}
                  editor={(options) => cellEditor(options)}
                  onCellEditComplete={onCellEditComplete}
                />,
                <Column
                  field={`dimension${dimensionNumber}_trait2_value`}
                  editor={(options) => cellEditor(options)}
                  onCellEditComplete={onCellEditComplete}
                />,
                <Column
                  field={`dimension${dimensionNumber}_trait3_value`}
                  editor={(options) => cellEditor(options)}
                  onCellEditComplete={onCellEditComplete}
                />,
              ])}
          </DataTable>
          <Button variant="contained" onClick={nextStep}>
            Next
          </Button>
        </Box>
      );

    // Add more cases for additional steps if needed

    default:
      return null;
  }
}

export default CreateJobForm;
