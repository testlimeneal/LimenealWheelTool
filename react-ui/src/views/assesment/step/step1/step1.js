import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@material-ui/core';



const Step1 = (props) => {
    const { question,setDisabled } = props;
    const  temp = question.answers.map((answer) => {
        return { ...answer, isTouched: false };
      });

    console.log(question)
    const [questions, setQuestions] = useState(temp);

    const reorder = (list, startIndex, endIndex) => {
        
        const result = Array.from(list);
        result[startIndex]['isTouched'] = true
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);
        const countFalse = result.filter(item => item.isTouched === false).length;

        if (countFalse === 1) {
        // Find the first 'false' isTouched item and set it to 'true'
            const firstFalseItem = result.find(item => item.isTouched === false);
            firstFalseItem.isTouched = true;
        }
        let ranking = {}
        console.log(result.map((res,index) => {question.ranking[res.id] = 9-index}))
        console.log(ranking)
        setDisabled(!result.every(item => item.isTouched === true))
    
        return result;
    };
    
    const getItemStyle = (isDragging, draggableStyle) => ({
        background: isDragging ? '#757ce8' : 'white',
        color:isDragging ? "white" : "black",
        ...draggableStyle
    });

    const onDragEnd = (result) => {
        if (!result.destination) {
            return;
        }
        let movedItems = reorder(questions, result.source.index, result.destination.index);
        setQuestions(movedItems);
    };

    return (
        <TableContainer component={Paper}>
            <Typography fontWeight={'bold'} fontSize={'md'} marginLeft={2}>{question.text}</Typography>
            <Typography fontSize={'0.7rem'} textAlign={'center'}></Typography>
            <Table aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>Rank</TableCell>
                        <TableCell>Option<Typography fontSize={'small'} fontWeight={100}>Drag and drop the options listed on the right in order of your preferred ranking</Typography></TableCell>
                    </TableRow>
                </TableHead>
                {/* <TableBody> */}
                <DragDropContext onDragEnd={onDragEnd}>
                    {/* ドロップできる範囲 */}
                    <Droppable droppableId="droppable">
                        {(provided, snapshot) => (
                            <TableBody
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                                // style={getListStyle(snapshot.isDraggingOver)}
                            >
                                {/*　ドラッグできる要素　*/}
                                {questions.map((question, index) => (
                                    <Draggable key={question.id} draggableId={'q-' + question.id} index={index}>
                                        {(provided, snapshot) => (
                                            <TableRow
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}
                                            >
                                                <TableCell component="th" scope="row" style={{ color:'inherit', width: '50%', padding: '0.5rem' }}>
                                                    {question.isTouched ? index+1 : ''}
                                                </TableCell>
                                                <TableCell style={{ color:'inherit',width: '50%', padding: '0.5rem' }}>{question.text}</TableCell>
                                            </TableRow>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </TableBody>
                        )}
                    </Droppable>
                </DragDropContext>
                {/* </TableBody> */}
            </Table>
        </TableContainer>
    );
};

export default Step1;
