import React from 'react';
import { Box } from '@material-ui/core';
import { MobileStepper, Stepper, Step, StepButton } from '@material-ui/core';
import { Button } from '@material-ui/core';
import { KeyboardArrowRight } from '@material-ui/icons';
import MainCard from './../../ui-component/cards/MainCard';
// import SecondaryAction from './../../ui-component/cards/CardSecondaryAction';
import axios from 'axios';
import configData from '../../config';
import CustomizedDividers from './options';
import { useDispatch, useSelector } from 'react-redux';
import Form from './form';
import Step2 from './step2';
import Step3 from './step3';

let res = [];

export default function HorizontalLinearAlternativeLabelStepper() {
    const [activeSteps, setActiveSteps] = React.useState(0);

    const [data, setData] = React.useState([]);
    const [quizID, setQuizId] = React.useState('');
    const [disabled, setDisabled] = React.useState(true);
    const account = useSelector((state) => state.account);
    const [completed, setCompleted] = React.useState({});
    const [isRegistered, setIsRegistered] = React.useState(false);

    React.useEffect(async () => {
        const res = await axios.get(`${configData.API_SERVER}assessment/quiz/1`, {
            headers: { Authorization: `${account.token}` }
        });
        setIsRegistered(true);
        if (isRegistered) {
            if(!res.data?.level_reached) {
                const test = res.data.questions.map((i, index) => ({ ...i, ranking: {} }));
                setQuizId(res?.id);
                setData(test);
            } else {
                console.log(res.data.level_reached)
                setActiveSteps(res.data.level_reached)
            }
             
        }
    }, [isRegistered]);

    const [activeQuestion, setActiveQuestion] = React.useState(0);

    const handleNext = () => {
        (function scroll() {

            const c = document.documentElement.scrollTop || document.body.scrollTop;
            if (c > 0) {
                window.requestAnimationFrame(scroll);
                window.scrollTo(0, c - c / 8); // You can adjust the "8" to control the scrolling speed.
            }
        })();

        console.log('hhn');
        // console.log(data[activeQuestion])
        console.log(data[activeQuestion]?.ranking);
        res.push(data[activeQuestion]?.ranking);
        setActiveQuestion((prevActiveStep) => prevActiveStep + 1);
        setDisabled(true);
    };

    const handleComplete = async () => {
        res.push(data[activeQuestion]?.ranking);
        const transformedArray = [];
        console.log(res);
        

        data.forEach((quiz, quizIndex) => {
            quiz.answers.forEach((answer, answerIndex) => {
                const quizi = 1;
                const question = quiz.id; // Adjust the index as needed (starting from 2)
                const answerId = answer.id;
                const rank =quiz.negation ? 10 - res[quizIndex][answer.id] : res[quizIndex][answer.id] ; // Starting rank from 1
                console.log()
                transformedArray.push({ quiz: quizi, question, answer: answerId, rank });
            });
        });

        console.log(transformedArray);

        await axios.post(`${configData.API_SERVER}assessment/userresponses/`, transformedArray, {
            headers: { Authorization: `${account.token}` }
        });

        setActiveSteps(1);
    };
    const handleStep = (step) => () => {
        setActiveSteps(step);
    };

    function renderComponent(activeSteps) {
        console.log(activeSteps)
        switch (activeSteps) {
            case 0:
                return data.length && <CustomizedDividers key={data[activeQuestion]['id']} setDisabled={setDisabled} question={data[activeQuestion]} />;
            case 1:
                return <Step2 setActiveSteps={setActiveSteps}/>;
            case 2:
                return <Step3 setActiveSteps={setActiveSteps} />;
            
            case 3:
                return <>Successfully Completed the Assesment</>
            default:
                return null;
        }
    }

    return (
        <MainCard title="Assesments">
            <Box sx={{ flexGrow: 1 }}>
                {!isRegistered && data.length === 0 && (
                    <Box>
                        <Form setIsRegistered={setIsRegistered} />
                    </Box>
                )}

                {isRegistered  && (
                    <Box>
                        {console.log("heeeeeee")}
                        <Box>
                            <Stepper activeStep={activeSteps}>
                                {[1, 2, 3].map((label, index) => (
                                    <Step key={label} completed={completed[index]}>
                                        <StepButton color="inherit">Level {label}</StepButton>
                                    </Step>
                                ))}
                            </Stepper>
                        </Box>
                        <Box marginY={2}>{ renderComponent(activeSteps)}</Box>
                        {activeSteps === 0 ? (
                            <MobileStepper
                                variant="text"
                                steps={data.length}
                                position="static"
                                activeStep={activeQuestion}
                                sx={{ width: '70%', margin: 'auto', flexGrow: 1 }}
                                nextButton={
                                    activeQuestion === data.length - 1 ? (
                                        <Button size="small" onClick={handleComplete} disabled={disabled}>
                                            Complete
                                            <KeyboardArrowRight />
                                        </Button>
                                    ) : (
                                        <Button size="small" onClick={handleNext} disabled={disabled || activeQuestion === data.length - 1}>
                                            Next
                                            <KeyboardArrowRight />
                                        </Button>
                                    )
                                }
                            />
                        ) : null}
                    </Box>
                )}
            </Box>
        </MainCard>
    );
}
