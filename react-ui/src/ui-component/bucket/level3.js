import React from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { MobileStepper, Button, Typography, Box, Grid, Paper, List, ListItem, ListItemTex } from '@material-ui/core';

const Level3Bucket = ({ columns, onDragEnd, optionsColumns, otherColumns, setColumns, activeStep }) => {
    return (
        <Box display="flex" justifyContent="center" height="100%">
            <DragDropContext onDragEnd={(result) => onDragEnd(result, columns, setColumns)}>
                <div style={{ display: 'flex', flexDirection: 'column', width: '90%', height: '100%' }}>
                    <Grid container justifyContent="center">
                        {Object.entries(optionsColumns).map(([columnId, column]) => (
                            <Grid item key={columnId}>
                                <Paper style={{ padding: '16px' }}>
                                    <h2>{column.name}</h2>
                                    <List style={{ display: 'flex', flexDirection: 'row' }}>
                                        <Droppable droppableId={columnId}>
                                            {(provided, snapshot) => (
                                                <div
                                                    {...provided.droppableProps}
                                                    ref={provided.innerRef}
                                                    style={{
                                                        background: snapshot.isDraggingOver ? 'lightblue' : 'lightgrey',
                                                        padding: 4,
                                                        flexWrap: 'wrap',
                                                        background: '#f5f5f5',
                                                        padding: '0.5rem',
                                                        width: '100%',
                                                        display: 'flex',
                                                        overflowX: 'auto'
                                                    }}
                                                >
                                                    {column.items.map((item, index) => (
                                                        <Draggable key={item.id} draggableId={item.id} index={index}>
                                                            {(provided, snapshot) => (
                                                                <div
                                                                    ref={provided.innerRef}
                                                                    {...provided.draggableProps}
                                                                    {...provided.dragHandleProps}
                                                                    style={{
                                                                        fontSize: 12,
                                                                        userSelect: 'none',
                                                                        padding: 12,
                                                                        margin: '0 8px 0 0',
                                                                        minWidth: '100px',
                                                                        backgroundColor: snapshot.isDragging ? '#263B4A' : 'white',
                                                                        color: 'purple',
                                                                        margin: 2,
                                                                        ...provided.draggableProps.style
                                                                    }}
                                                                >
                                                                    {index + 1}. {item.text}
                                                                </div>
                                                            )}
                                                        </Draggable>
                                                    ))}
                                                    {provided.placeholder}
                                                </div>
                                            )}
                                        </Droppable>
                                    </List>
                                </Paper>
                            </Grid>
                        ))}
                    </Grid>
                    <div style={{ display: 'flex', margin: 'auto' }}>
                        {Object.entries(otherColumns).map(([columnId, column], index) => {
                            return (
                                <div
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center'
                                        // display:
                                    }}
                                    key={columnId}
                                >
                                    <h2 style={{ textAlign: 'center', margin: '0.5rem 0' }}>
                                        {column.name}
                                        <br />
                                        {column.items.length}/9
                                    </h2>
                                    <div style={{ margin: 8 }}>
                                        <Droppable droppableId={columnId} key={columnId}>
                                            {(provided, snapshot) => {
                                                return (
                                                    <div
                                                        {...provided.droppableProps}
                                                        ref={provided.innerRef}
                                                        className="emoji-background-div"
                                                        style={{
                                                            background: snapshot.isDraggingOver ? 'lightblue' : '#f5f5f5',
                                                            padding: '1rem',
                                                            width: 250,
                                                            minHeight: 500,
                                                            borderRadius: '1rem',
                                                            border: '1px solid gray',
                                                            background: '#f5f5f5',
                                                            backgroundSize: '100% 100%',
                                                            backgroundRepeat: 'no-repeat'
                                                        }}
                                                    >
                                                        {column.items.map((item, index) => {
                                                            // console.log(item)
                                                            return (
                                                                <Draggable key={item.id} draggableId={item.id} index={index}>
                                                                    {(provided, snapshot) => {
                                                                        const commonStyles = {
                                                                            userSelect: 'none',
                                                                            padding: 12,
                                                                            fontSize: 12,
                                                                            width: `100%`,
                                                                            overflow: 'visible',
                                                                            margin: 'auto',
                                                                            margin: '8px auto',
                                                                            background: 'purple',
                                                                            transform: 'scale(.76, .5)',
                                                                            

                                                                            backgroundColor: snapshot.isDragging ? '#263B4A' : '#F5F5DC',
                                                                            color: 'purple',
                                                                            textAlign: 'center',
                                                                            ...provided.draggableProps.style
                                                                        };
                                                                        
                                                                        const styles = {
                                                                            0: {
                                                                                ...commonStyles,
                                                                                
                                                                                background: `linear-gradient(to right, #CBCEE3 ${10*(index+1)}%, #f5f5f5 ${10*(index+1)}%)`,
                                                                                // backgroundColor: snapshot.isDragging ? '#263B4A' : 'white'
                                                                            },
                                                                            1: {
                                                                                ...commonStyles,
                                                                                borderRadius:'50%',
                                                                                width:`${(index + 1) * 11}%`,
                                                                                backgroundColor: snapshot.isDragging ? '#263B4A' : 'lightblue'

                                                                                // backgroundColor: snapshot.isDragging ? '#263B4A' : 'white'
                                                                                // Add specific styles for activeStep 1 here
                                                                            },
                                                                            2: {
                                                                                ...commonStyles
                                                                                // Add specific styles for activeStep 2 here
                                                                            }
                                                                        };
                                                                        const activeStepStyles = styles[activeStep] || commonStyles;

                                                                        return (
                                                                            <div
                                                                                ref={provided.innerRef}
                                                                                {...provided.draggableProps}
                                                                                {...provided.dragHandleProps}
                                                                                style={activeStepStyles}
                                                                            >
                                                                                {index + 1}. {item.text} 
                                                                            </div>
                                                                        );
                                                                    }}
                                                                </Draggable>
                                                            );
                                                        })}
                                                        {provided.placeholder}
                                                    </div>
                                                );
                                            }}
                                        </Droppable>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </DragDropContext>
        </Box>
    );
};

export default Level3Bucket;
