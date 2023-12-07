import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Box, Typography, MobileStepper, Stepper, Step, StepButton, Button } from '@material-ui/core';
import { KeyboardArrowRight } from '@material-ui/icons';
import axios from 'axios';
import MainCard from './../../ui-component/cards/MainCard';
import UserProfileForm from './user-profile-form/form';
import Stopwatch from '../../ui-component/Stopwatch';
import configData from '../../config';
import Step1 from './step/step1/step1';
import Step2 from './step2';
import Step3 from './step3';
import Instructions from './step/step1/instructions';

let res = [];

export default function Assesment() {
  const [activeLevel, setActiveLevel] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);
  const [disabled, setDisabled] = useState(true);
  const account = useSelector((state) => state.account);
  const [isRegistered, setIsRegistered] = useState(false);

  useEffect(async () => {
    const res = await axios.get(`${configData.API_SERVER}assessment/quiz/1`, {
      headers: { Authorization: `${account.token}` },
    });
    setIsRegistered(true);
    if (isRegistered) {
      if (!res.data?.level_reached) {
        const test = res.data.questions.map((i) => ({ ...i, ranking: {} }));
        setData(test);
      } else {
        setActiveLevel(res.data.level_reached);
      }
    }
  }, [isRegistered]);

  const [activeQuestion, setActiveQuestion] = useState(0);

  const handleNext = () => {
    setIsLoading(true);
    (function scroll() {
      const c = document.documentElement.scrollTop || document.body.scrollTop;
      if (c > 0) {
        window.requestAnimationFrame(scroll);
        window.scrollTo(0, c - c / 8);
      }
    })();
    res.push(data[activeQuestion]?.ranking);

    setActiveQuestion((prevActiveStep) => prevActiveStep + 1);

    setDisabled(true);
    setIsLoading(false);
  };

  const handleComplete = async () => {
    setIsLoading(true);
    res.push(data[activeQuestion]?.ranking);
    const transformedArray = [];

    data.forEach((quiz, quizIndex) => {
      quiz.answers.forEach((answer) => {
        const quizi = 1;
        const question = quiz.id;
        const answerId = answer.id;
        const rank = quiz.negation ? 10 - res[quizIndex][answer.id] : res[quizIndex][answer.id];
        transformedArray.push({ quiz: quizi, question, answer: answerId, rank });
      });
    });

    await axios.post(`${configData.API_SERVER}assessment/userresponses/`, transformedArray, {
      headers: { Authorization: `${account.token}` },
    });
    setIsLoading(false);
    setActiveLevel(1);
  };

  function renderComponent(activeLevel) {
    switch (activeLevel) {
      case 4:
        return <Instructions />;
      case 0:
        return (
          data.length && (
            <Step1 key={data[activeQuestion]['id']} setDisabled={setDisabled} question={data[activeQuestion]} />
          )
        );
      case 1:
        return <Step2 setActiveLevel={setActiveLevel} />;
      case 2:
        return <Step3 setActiveLevel={setActiveLevel} />;

      case 3:
        return <>Successfully Completed the Assesment</>;
      default:
        return null;
    }
  }

  return (
    <MainCard title="Assesments">
      <Box sx={{ flexGrow: 1 }}>
        {!isRegistered && data.length === 0 && (
          <Box>
            <UserProfileForm setIsRegistered={setIsRegistered} />
          </Box>
        )}
        {isRegistered && (
          <Box>
            <Box>
              <Stepper activeStep={activeLevel}>
                {[1, 2, 3].map((label, index) => (
                  <Step key={label}>
                    <StepButton color="inherit">Level {label}</StepButton>
                  </Step>
                ))}
              </Stepper>
            </Box>
            {activeLevel < 3 && (
              <Box display={'flex'} justifyContent={'flex-end'} mt={2} mb={-7}>
                <Stopwatch />
              </Box>
            )}
            <Box marginY={2}>{renderComponent(activeLevel)}</Box>

            {activeLevel === 0 ? (
              <>
                <MobileStepper
                  variant="text"
                  steps={data.length}
                  position="static"
                  activeStep={activeQuestion}
                  sx={{ width: '70%', margin: 'auto', flexGrow: 1 }}
                  nextButton={
                    activeQuestion === data.length - 1 ? (
                      isLoading ? (
                        <Button size="small" disabled>
                          Loading...
                        </Button>
                      ) : (
                        <Button size="small" onClick={handleComplete} disabled={disabled}>
                          Complete
                          <KeyboardArrowRight />
                        </Button>
                      )
                    ) : isLoading ? (
                      <Button size="small" disabled>
                        Loading...
                      </Button>
                    ) : (
                      <Button
                        size="small"
                        onClick={handleNext}
                        disabled={disabled || activeQuestion === data.length - 1}
                      >
                        Next
                        <KeyboardArrowRight />
                      </Button>
                    )
                  }
                />
                <Typography marginTop={2} textAlign={'center'} bgcolor={'beige'}>
                  Please ensure you have answered to your satisfaction, since you will not have an opportunity to revert
                  to this page.
                </Typography>
              </>
            ) : null}
          </Box>
        )}
      </Box>
    </MainCard>
  );
}
