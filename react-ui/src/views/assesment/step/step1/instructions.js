import React, { useState, useEffect } from 'react';
import Typing from 'react-typing-animation';
import { Box, Avatar, Typography } from '@material-ui/core';
import vivian from '../../../../assets/images/users/vivian.jpeg';
import Typist from 'react-typist';

const MultiStepForm = () => {
    return (
        <Box>
            <Typography textAlign={'center'} fontWeight={'bold'} fontSize={20} mb={2}>
                Level 1 Instructions
            </Typography>
            <Box display={'flex'} width={'80%'} gap={2}>
                <Avatar src={vivian} sx={{ width: 56, height: 56 }} />
                <Typist avgTypingDelay={5}>
                    <span>
                        <strong>This is Vivian Alfread, the creator of Limeneal Wheel.</strong>{' '}
                        <em>I hope you are doing exceptionally well.</em> As we embark on the journey of assessment, let's delve into Level
                        1, where we illuminate your purpose.
                    </span>

                    <span>
                        Let's enrich this experience by incorporating a multitude of elements, crafting a narrative that not only defines
                        but amplifies your mission. Immerse yourself in a tapestry of ideas, aspirations, and goals, making this assessment
                        a comprehensive exploration of your potential.
                    </span>

                    <span>
                        Your purpose is the guiding star that shapes your endeavors, and in this assessment, we aim to uncover its depth and
                        significance. Let the canvas of your aspirations expand, incorporating the diverse colors of your ambitions.
                    </span>

                    <span>
                        As we traverse through this journey, each step is an opportunity to articulate and refine your purpose. Let your
                        thoughts flow freely, painting a vivid picture of your goals and aspirations.
                    </span>

                    <span>
                        <strong>In closing, I extend my gratitude for your participation in this transformative process.</strong> Thank you
                        for sharing your insights, dreams, and vision.{' '}
                        <em>Here's to a purpose-driven exploration and the exciting steps ahead!</em>
                    </span>

                    <span>
                        <strong>
                            <br />
                            <br />
                            Thank you,
                        </strong>
                        <br /> Vivian Alfread, <br />
                        Creator of Limeneal Wheel
                    </span>
                </Typist>
            </Box>
        </Box>
    );
};

export default MultiStepForm;
