import React, { useEffect, useState, useRef } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import axios from 'axios';
import configData from '../../config';
import { useSelector } from 'react-redux';
import { MobileStepper, Button, Typography, Radio, RadioGroup, FormControl, FormControlLabel } from '@material-ui/core';
import { KeyboardArrowRight, KeyboardArrowLeft } from '@material-ui/icons';
import DragAndDropComponent from '../../ui-component/bucket/dragdrop';

let res = {};
let question_rankings = [];

function Step2(props) {
    const { setActiveSteps } = props;
    const [columns, setColumns] = useState({ requested: { items: [] } });
    // const radioGroupRef = useRef(null);
    const [selectedValue, setSelectedValue] = React.useState(''); // You can set an initial value if needed
    const [loading, setLoading] = useState(false);
    const account = useSelector((state) => state.account);
    const [activeQuestion, setActiveQuestion] = React.useState(0);
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
                (source.droppableId === 'requested' && columns[destination.droppableId].items.length < 9))
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
        (function scroll() {
            const c = document.documentElement.scrollTop || document.body.scrollTop;
            const targetPosition = (document.documentElement.scrollHeight || document.body.scrollHeight) * 0.1; // 10% from the top

            if (c > targetPosition) {
                window.requestAnimationFrame(scroll);
                window.scrollTo(0, c - c / 32); // You can adjust the "8" to control the scrolling speed.
            }
        })();
    };

    for (const [columnId, column] of Object.entries(columns)) {
        if (column.name === 'Options') {
            optionsColumns[columnId] = column;
        } else {
            otherColumns[columnId] = column;
        }
    }

    useEffect(() => {
        // setLoading(true);

        setAllowNext(columns['requested']['items'].length !== 0);
        console.log(selectedValue);
        if (activeQuestion > 2 && selectedValue === '') {
            setAllowNext(true);
        } else if (activeQuestion > 2 && selectedValue.length > 0) {
            setAllowNext(false);
        }
    }, [columns, selectedValue]);

    useEffect(async () => {
        //   res = await axios.get(`${configData.API_SERVER}assessment/level2response`, {
        //     headers: { Authorization: `${account.token}` }
        // });
        // console.log(res)

       
        if (activeQuestion === 0) {
            res = await axios.get(`${configData.API_SERVER}assessment/quiz2`, {
                headers: { Authorization: `${account.token}` }
            });
        }

        setQuestions(res.data[0]['level2questions']);
        const taskStatus = {
            requested: {
                name: 'Options',
                items: res.data[0]['level2questions'][activeQuestion]['options'].map(({ ...e }) => ({
                    ...e,
                    id: e.id.toString(),
                    content: e.text
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

        setColumns(taskStatus);

        console.log(question_rankings);
    }, [activeQuestion]);

    const handleRadioChange = (event) => {
        setSelectedValue(event.target.value);
    };

    const handleNext = () => {

        const questionId = questions[activeQuestion]['id'];
        const quizId = questions[activeQuestion]['quiz'];
        const negation = questions[activeQuestion]['negation']

        const mapping = {
            0: 9,
            1: 9,
            2: 9,
            3: 8,
            4: 8,
            5: 8,
            6: 7,
            7: 7,
            8: 7
        }

        setLoading(true)

        if ([0, 1, 2].includes(activeQuestion)) {
            const addToRankings = (items, rankOffset) => {
                items.forEach((option, index) => {
                    question_rankings.push({
                        answer: option.id,
                        question: questionId,
                        quiz: quizId,
                        rank: negation ? 10 - (mapping[index] - rankOffset) : mapping[index] - rankOffset
                    });
                });
            };

            addToRankings(columns['bucket1']['items'], 0);
            addToRankings(columns['bucket2']['items'], 3);
            addToRankings(columns['bucket3']['items'], 6);

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
            // console.log(questions[activeQuestion]);
        }

        // console.log(questions.length,activeQuestion+1)
        (async () => {
            if (questions.length === activeQuestion + 1) {
                try {
                    const response = await axios.post(`${configData.API_SERVER}assessment/level2response`, question_rankings, {
                        headers: { Authorization: `${account.token}` }
                    });

                    setActiveSteps(2);
                    // Handle the response data here
                    console.log(response.data);
                    return
                    // Example: log the response data
                } catch (error) {
                    console.error('Error fetching data:', error);
                    // Handle the error here
                }
            } else {
                setActiveQuestion((prevActiveStep) => prevActiveStep + 1);
            }
        })();
        setLoading(false)
        (function scroll() {
            const c = document.documentElement.scrollTop || document.body.scrollTop;
            if (c > 0) {
                window.requestAnimationFrame(scroll);
                window.scrollTo(0, c - c / 8); // You can adjust the "8" to control the scrolling speed.
            }
        })();
    };

    return (
        <div style={{ width: '100%', margin: '2rem 0' }}>
            <Typography variant="h3" margin={'auto'} textAlign={'center'} fontWeight={100} gutterBottom>
                {activeQuestion > 2 ? 'When you' : ''} {questions && questions.length && questions[activeQuestion]['text']}{' '}
                {activeQuestion > 2 ? 'do you...' : ''}
            </Typography>
            {console.log(questions[activeQuestion])}

            {activeQuestion <= 2 ? (
                <DragAndDropComponent
                    columns={columns}
                    onDragEnd={onDragEnd}
                    optionsColumns={optionsColumns}
                    otherColumns={otherColumns}
                    setColumns={setColumns}
                    activeQuestion={activeQuestion}
                />
            ) : (
                <FormControl>
                    <RadioGroup
                        aria-labelledby="demo-radio-buttons-group-label"
                        name="radio-buttons-group"
                        value={selectedValue}
                        onChange={handleRadioChange}
                    >
                        <FormControlLabel value="visual" control={<Radio />} label={questions[activeQuestion]['visual_option']} />
                        <FormControlLabel value="auditory" control={<Radio />} label={questions[activeQuestion]['auditory_option']} />
                        <FormControlLabel value="kinesthetic" control={<Radio />} label={questions[activeQuestion]['kinesthetic_option']} />
                    </RadioGroup>
                </FormControl>
            )}

            <MobileStepper
                variant="text"
                steps={questions.length}
                position="static"
                activeStep={activeQuestion}
                nextButton={
                    <Button size="small" onClick={handleNext} disabled={allowNext || loading}>
                        {activeQuestion + 1 === questions.length ? (
                            loading ? 'Loading...' : 'Complete'
                        ) : (
                            loading ? 'Loading...' : 'Next'
                        )}
                        {activeQuestion + 1 === questions.length ? null : <KeyboardArrowRight />}
                    </Button>
                }
            />
        </div>
    );
}

export default Step2;
