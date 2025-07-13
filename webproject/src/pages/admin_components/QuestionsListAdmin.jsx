import React, { useEffect, useState } from 'react'
import styles from './TestPage.module.css';
import { X } from "lucide-react";
import { createQuestion, createTestQuestion, deleteChapter, deleteTestQuestion, editTestQuestion } from '../../utils/apiService';
import { toast } from 'react-toastify';
import Modal from '../../helpers/Modal';
import QuestionForm from './QuestionForm';
import QuestionItemAdmin from './QuestionItemAdmin';
import HPBs_Form from '../dashboard_sections/tests/HPBs_Form';
import { buildFormDataForCreation, buildFormDataForUpdate } from '../../lib/helperFunctions';

const QuestionsListAdmin = ({questions, testId}) => {
  const [loading, setLoading] = useState();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [questionToModify, setQuestionToModify] = useState(null);
  const [questionDelete, setQuestionDelete] = useState({
    confirmed: false,
    questionId: null
  });

  console.log(questionDelete);

  async function handleDeleteQuestion(questionId){
    if (questionDelete.confirmed){
      setLoading(true);
      try{  
        const data = await deleteTestQuestion(questionId, testId);
        toast.success("Вопрос удален");
      }catch(e){
        toast.error("Не получилось удалить вопрос");
      }finally{
        setLoading(false);
        setQuestionDelete({confirmed: false, questionId: null});
      }
    }else{
      setQuestionDelete(prev=>({...prev, questionId: questionId}));
    }
  }

  async function handleAddQuestion(qData){
    console.log(qData);
    setLoading(true);
    const formData = new FormData();
    buildFormDataForCreation(formData, qData);
    try{  
      const data = await createTestQuestion(formData);
      toast.success("Вопрос добавлен");
      setShowAddModal(false);
    }catch(e){
      toast.error("Не получилось добавить вопрос");
    }finally{
      setLoading(false);
    }
  }

  async function handleEditQuestion(qData, questionId){
    setLoading(true);
    const formData = new FormData();
    buildFormDataForUpdate(formData, qData);
    try{  
      const data = await editTestQuestion(formData, questionId);
      toast.success("Вопрос изменен");
      setShowEditModal(false);
    }catch(e){
      toast.error("Не получилось отредактировать вопрос");
    }finally{
      setLoading(false);
    }
  }

  function handleOpenAddQuestionModal(){
    setShowAddModal(true);
  }

  function handleOpenEditQuestionModal(question){
    setShowEditModal(true);
    setQuestionToModify(question);
  }

  useEffect(()=>{
    if (questionDelete.confirmed && questionDelete.questionId!=null){
      handleDeleteQuestion(questionDelete.questionId);
    }
  }, [questionDelete.confirmed]);

  return (
      <div className={styles.questionsList}>
        {questions.map((question, qIndex) => (
            <div className={styles.questionItem}>
              <QuestionItemAdmin 
                question={question} 
                qIndex={qIndex} 
                handleDeleteQuestion={handleDeleteQuestion}
              />
              <button onClick={()=>handleOpenEditQuestionModal(question)}>Modify</button>
            </div>
        ))}
  
        <div style={{display: "flex", gap:"1rem"}}>
          <button type="button" onClick={()=>setShowAddModal(true)}>
            Add Question
          </button>
        </div>
        {showAddModal && <Modal onClose={()=>setShowAddModal(false)} extraStyles={{maxHeight: "60vh", overflow: "scroll"}}>
          <QuestionForm mode="create" onSubmit={(data)=>handleAddQuestion(data)} testId={testId}/>
        </Modal>}
        {showEditModal && <Modal onClose={()=>setShowEditModal(false)} extraStyles={{maxHeight: "60vh", overflow: "scroll"}}>
          <QuestionForm mode="update" questionData={questionToModify} onSubmit={(data, questionId)=>handleEditQuestion(data, questionId)} testId={testId}/>
        </Modal>}
        {!questionDelete.confirmed && questionDelete.questionId!=null && <Modal onClose={()=>setQuestionDelete({confirmed: false, questionId: null})}>
          <HPBs_Form 
            header="Вы уверены что хотите удалить вопрос?" 
            paragraph="Удалив вопрос вы не сможете его вернуть" 
            buttons={[
              {label: "Отмена", onClick: ()=> setQuestionDelete({confirmed: false, questionId: null}), styles: {backgroundColor: "grey"}}, 
              {label: "Удалить", onClick: ()=> setQuestionDelete(prev=>({...prev, confirmed: true})), styles: {backgroundColor: "red"}}
            ]}
          />
        </Modal>}
      </div>
  );
}

export default QuestionsListAdmin;