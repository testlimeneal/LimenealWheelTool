import React, { useEffect, useState } from 'react';
import axios from 'axios';
import configData from '../../config';
import { useSelector } from 'react-redux';
import { MobileStepper, Button, Typography, Radio, RadioGroup, FormControl, FormControlLabel } from '@material-ui/core';
import { KeyboardArrowRight } from '@material-ui/icons';
import Level3Bucket from '../../ui-component/bucket/level3';

let res = {};
let question_rankings = [];

function Step3(props) {
  const { setActiveLevel } = props;
  const [columns, setColumns] = useState({ requested: { items: [] } });
  const [selectedValue, setSelectedValue] = React.useState('');
  const [loading, setLoading] = useState(false);
  const account = useSelector((state) => state.account);
  const [activeStep, setActiveStep] = React.useState(0);
  const [questions, setQuestions] = React.useState([]);
  const [allowNext, setAllowNext] = React.useState(false);

  const optionsColumns = {};
  const otherColumns = {};

  const onDragEnd = (result, columns, setColumns) => {
    if (!result.destination) return;
    const { source, destination } = result;

    console.log(source, destination);
    if (
      source.droppableId !== destination.droppableId &&
      (destination.droppableId === 'requested' ||
        // source.droppableId === 'requested'  === To Restrict Change Between Buckets ===
        columns[destination.droppableId].items.length < 9)
    ) {
      const sourceColumn = columns[source.droppableId];
      const destColumn = columns[destination.droppableId];
      const sourceItems = [...sourceColumn.items];
      const destItems = [...destColumn.items];
      const [removed] = sourceItems.splice(source.index, 1);
      destItems.splice(destination.index, 0, removed);
      setColumns({
        ...columns,
        [source.droppableId]: {
          ...sourceColumn,
          items: sourceItems,
        },
        [destination.droppableId]: {
          ...destColumn,
          items: destItems,
        },
      });
    } else {
      const column = columns[source.droppableId];
      const copiedItems = [...column.items];
      const [removed] = copiedItems.splice(source.index, 1);
      copiedItems.splice(destination.index, 0, removed);
      setColumns({
        ...columns,
        [source.droppableId]: {
          ...column,
          items: copiedItems,
        },
      });
    }
  };

  for (const [columnId, column] of Object.entries(columns)) {
    if (column.name === 'Options') {
      optionsColumns[columnId] = column;
    } else {
      otherColumns[columnId] = column;
    }
  }

  useEffect(() => {
    setAllowNext(columns['requested']['items'].length !== 0);
    console.log(selectedValue);
    if (activeStep > 2 && selectedValue === '') {
      setAllowNext(true);
    } else if (activeStep > 2 && selectedValue.length > 0) {
      setAllowNext(false);
    }
  }, [columns, selectedValue]);

  useEffect(async () => {
    if (activeStep === 0) {
      res = await axios.get(`${configData.API_SERVER}assessment/level3`, {
        headers: { Authorization: `${account.token}` },
      });
    }
    setQuestions(res.data);
    const taskStatus = {
      requested: {
        name: 'Options',
        items: res.data[activeStep]['associated_traits'].map(({ ...e }) => ({
          ...e,
          id: e.id.toString(),
          text: e.name,
        })),
      },
      bucket1: {
        name: '⭐⭐⭐',
        items: [],
      },
      bucket2: {
        name: '⭐⭐',
        items: [],
      },
      bucket3: {
        name: '⭐',
        items: [],
      },
    };

    setColumns(taskStatus);

    console.log(question_rankings);
  }, [activeStep]);

  const handleRadioChange = (event) => {
    setSelectedValue(event.target.value);
  };

  const handleNext = () => {
    const questionId = questions[activeStep]['id'];
    const quizId = questions[activeStep]['quiz'];
    const negation = questions[activeStep]['negation'];

    const mapping = {
      0: 9,
      1: 9,
      2: 9,
      3: 8,
      4: 8,
      5: 8,
      6: 7,
      7: 7,
      8: 7,
    };
    setLoading(true);

    if ([0, 1, 2].includes(activeStep)) {
      const addToRankings = (items, rankOffset) => {
        items.forEach((option, index) => {
          question_rankings.push({
            answer: option.id,
            question: questionId,
            quiz: quizId,
            rank: negation ? 10 - (mapping[index] - rankOffset) : mapping[index] - rankOffset,
          });
        });
      };

      addToRankings(columns['bucket1']['items'], 0);
      addToRankings(columns['bucket2']['items'], 3);
      addToRankings(columns['bucket3']['items'], 6);

      console.log(question_rankings);
    } else {
      console.log(selectedValue);
      setSelectedValue('');
      question_rankings.push({
        question: questionId,
        quiz: quizId,
        nlp: selectedValue,
      });
    }
    (async () => {
      if (questions.length === activeStep + 1) {
        try {
          const response = await axios.post(`${configData.API_SERVER}assessment/level3response`, question_rankings, {
            headers: { Authorization: `${account.token}` },
          });
          setActiveLevel(3);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      }
    })();
    setLoading(false);
    if (!(questions.length === activeStep + 1)) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  console.log(optionsColumns);
  return (
    <div style={{ width: '100%', margin: '2rem 0' }}>
      <Typography variant="h3" margin={'auto'} textAlign={'center'} fontWeight={100} gutterBottom>
        {activeStep > 2 ? 'When you' : ''} {questions && questions.length && questions[activeStep]['text']}{' '}
        {activeStep > 2 ? 'do you...' : ''}
      </Typography>
      {console.log(questions[activeStep])}

      {activeStep <= 2 ? (
        <Level3Bucket
          columns={columns}
          onDragEnd={onDragEnd}
          optionsColumns={optionsColumns}
          otherColumns={otherColumns}
          setColumns={setColumns}
          activeStep={activeStep}
        />
      ) : (
        <FormControl>
          <RadioGroup
            aria-labelledby="demo-radio-buttons-group-label"
            name="radio-buttons-group"
            value={selectedValue}
            onChange={handleRadioChange}
          >
            <FormControlLabel value="visual" control={<Radio />} label={questions[activeStep]['visual_option']} />
            <FormControlLabel value="auditory" control={<Radio />} label={questions[activeStep]['auditory_option']} />
            <FormControlLabel
              value="kinesthetic"
              control={<Radio />}
              label={questions[activeStep]['kinesthetic_option']}
            />
          </RadioGroup>
        </FormControl>
      )}

      <MobileStepper
        variant="text"
        steps={3}
        position="static"
        activeStep={activeStep}
        nextButton={
          <Button size="small" onClick={handleNext} disabled={allowNext || loading}>
            {activeStep + 1 === questions.length
              ? loading
                ? 'Loading...'
                : 'Complete'
              : loading
              ? 'Loading...'
              : 'Next'}
            {activeStep + 1 === questions.length ? null : <KeyboardArrowRight />}
          </Button>
        }
      />
    </div>
  );
}

export default Step3;
