import React, { useEffect, useState, useRef } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import axios from 'axios';
import configData from '../../config';
import { useSelector } from 'react-redux';
import { MobileStepper, Button, Typography, Radio, RadioGroup, FormControl, FormControlLabel } from '@material-ui/core';
import { KeyboardArrowRight, KeyboardArrowLeft } from '@material-ui/icons';
import Level3Bucket from '../../ui-component/bucket/level3';

let res = {};
let question_rankings = [];

function Step2(props) {
    const {setActiveSteps} = props
    const [columns, setColumns] = useState({ requested: { items: [] } });
    // const radioGroupRef = useRef(null);
    const [selectedValue, setSelectedValue] = React.useState(''); // You can set an initial value if needed

    const account = useSelector((state) => state.account);
    const [activeStep, setActiveStep] = React.useState(0);
    const [questions, setQuestions] = React.useState([]);
    const [allowNext, setAllowNext] = React.useState(false);

    const optionsColumns = {};
    const otherColumns = {};

    const onDragEnd = (result, columns, setColumns) => {
        if (!result.destination) return;
        const { source, destination } = result;

        console.log(source,destination)
        if (source.droppableId !== destination.droppableId && ((destination.droppableId === 'requested') || (source.droppableId === 'requested' && columns[destination.droppableId].items.length < 9))) {
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
                    items: sourceItems
                },
                [destination.droppableId]: {
                    ...destColumn,
                    items: destItems
                }
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
                    items: copiedItems
                }
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
        console.log(selectedValue)
        if (activeStep > 2 && selectedValue === '') {
            setAllowNext(true)
        } else if(activeStep > 2 && selectedValue.length>0) {
          setAllowNext(false)
        }
    }, [columns,selectedValue]);

    useEffect(async () => {


        if (activeStep === 0) {
            res = await axios.get(`${configData.API_SERVER}assessment/level3`, {
                headers: { Authorization: `${account.token}` }
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
                    // text:'hello'
                }))
            },
            bucket1: {
                name: '⭐⭐⭐',
                items: []
            },
            bucket2: {
                name: '⭐⭐',
                items: []
            },
            bucket3: {
                name: '⭐',
                items: []
            }
        };

        // console.log(tas)
        setColumns(taskStatus);

        console.log(question_rankings)
    }, [activeStep]);

    const handleRadioChange = (event) => {
        setSelectedValue(event.target.value);
    };

    const handleNext = () => {
        const questionId = questions[activeStep]['id'];
        const quizId = questions[activeStep]['quiz'];
        const negation = questions[activeStep]['negation']

        if ([0, 1,2].includes(activeStep)) {
            const addToRankings = (items, rankOffset) => {
                items.forEach((option, index) => {
                    question_rankings.push({
                        answer: option.id,
                        question: questionId,
                        quiz: quizId,
                        rank: negation ? 27-rankOffset+index+1 : rankOffset - index
                    });
                });
            };

            addToRankings(columns['bucket1']['items'], 27);
            addToRankings(columns['bucket2']['items'], 18);
            addToRankings(columns['bucket3']['items'], 9);

            // question_rankings.push(rankings);

            console.log(question_rankings);



        } else {
            // const selectedValue = radioGroupRef.current.value;
            // console.log(radioGroupRef.current); // This will log the selected value
            console.log(selectedValue);
            setSelectedValue('');
            question_rankings.push({
                question: questionId,
                quiz: quizId,
                nlp: selectedValue
            });
            // console.log(questions[activeStep]);
        }

        // console.log(questions.length,activeStep+1)
        (async () => {
          if (questions.length === activeStep + 1) {
            try {
              const response = await axios.post(`${configData.API_SERVER}assessment/level3response`,question_rankings,   {
                headers: { Authorization: `${account.token}` }
              });
              setActiveSteps(3)
              // Handle the response data here
              console.log(response.data); // Example: log the response data
              
            } catch (error) {
              console.error("Error fetching data:", error);
              // Handle the error here
            }
          }
        })();
        if (!(questions.length === activeStep + 1)) {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
        }
    };

    console.log(optionsColumns)
    return (
        <div style={{ width: '100%', margin: '2rem 0' }}>
            <Typography variant="h3" margin={'auto'} textAlign={'center'} fontWeight={100} gutterBottom>
                
                {activeStep > 2 ? "When you" : ''} {questions && questions.length && questions[activeStep]['text']} {activeStep > 2 ? "do you..." : ''}
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
                        <FormControlLabel value="kinesthetic" control={<Radio />} label={questions[activeStep]['kinesthetic_option']} />
                    </RadioGroup>
                </FormControl>
            )}

           
            <MobileStepper
                variant="text"
                steps={3}
                position="static"
                activeStep={activeStep}
                nextButton={
                    <Button
                        size="small"
                        onClick={handleNext}
                        disabled={allowNext}
                    >
                        Next
                        <KeyboardArrowRight />
                    </Button>
                }
            />
        </div>
    );
}

export default Step2;
