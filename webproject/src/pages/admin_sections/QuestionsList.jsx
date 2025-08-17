import React from 'react';
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import {
    DndContext,
    closestCenter,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import {
    SortableContext,
    arrayMove,
    useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { updateTaskContents } from '../../utils/apiService';

function SortableItem({ id, children, question, handleEditQuestion, handleDeleteQuestion, index }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        setActivatorNodeRef,
        transform,
        transition,
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div ref={setNodeRef} style={style}>
            <li
                key={index}
                onClick={() => handleEditQuestion(index)}
                className="questions"
            >
                <p className="defaultStyle">{index + 1}.</p>
                {question.title || `Вопрос ${index + 1}`} <span>Вопрос: {question.question_text.slice(0, 15)}</span>
                <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 4
                }}>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteQuestion(index);
                        }}
                        className="transBtn"
                        style={{ paddingTop: "3px" }}
                    >
                        <DeleteForeverIcon sx={{ color: "darkred" }} />
                    </button>
                    <div
                        ref={setActivatorNodeRef}
                        {...listeners}
                        {...attributes}
                        style={{
                            cursor: 'grab',
                            padding: '4px',
                            userSelect: 'none',
                        }}
                    >
                        &#9776; {/* Unicode for a hamburger icon */}
                    </div>
                </div>
            </li>
        </div>
    );
};

const QuestionsList = ({ questions, handleEditQuestion, handleDeleteQuestion, setQuestions, metaData }) => {

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: { distance: 5 },
        })
    );
    async function handleDragEnd(event) {
        const { active, over } = event;
        console.log(active, over);
        try {
            const { courseId, sectionId, chapterId } = metaData;
            console.log(courseId, sectionId, chapterId);
            questions.forEach((question, index) => question.order = index + 1);
            const response = await updateTaskContents(courseId, sectionId, chapterId, questions[0].task, questions);
            console.log(response);
            console.log('New order saved to backend');
            return true;
        } catch (error) {
            console.error('Error saving tasks order:', error);
            setQuestions(previousQuestions);
        }
    };

    const handleDragOver = (event) => {
        const { active, over } = event;
        if (over && active.id !== over.id) {
            const oldIndex = active.data.current.sortable.index;
            const newIndex = over.data.current.sortable.index;
            const currentQuestions = [...questions];
            [currentQuestions[oldIndex], currentQuestions[newIndex]] = [currentQuestions[newIndex], currentQuestions[oldIndex]];
            setQuestions(currentQuestions);
        }
    };

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
            modifiers={[restrictToVerticalAxis]}
            onDragOver={handleDragOver}
        >
            <SortableContext items={questions}>
                <ul>
                    {questions.map((question, index) => (
                        <SortableItem
                            key={question.id}
                            id={question.id}
                            index={index}
                            question={question}
                            handleDeleteQuestion={handleDeleteQuestion} handleEditQuestion={handleEditQuestion}
                        >
                            {question}
                        </SortableItem>
                    ))}
                </ul>
            </SortableContext>
        </DndContext>
    )
}

export default QuestionsList