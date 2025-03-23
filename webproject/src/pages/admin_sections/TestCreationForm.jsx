import React, {useState} from 'react'
import styles from "./TestCreationForm.module.css"
import QuestionsCreator from './QuestionsCreator'
import { useForm } from 'react-hook-form'
import { createTest } from '../../utils/apiService'

const TestCreationForm = ({onClose}) => {

    const [loading, setLoading] = useState(null);

    const {register, handleSubmit} = useForm();

    const [questions, setQuestions] = useState([
        {
          title: "",
          image: "",
          answerType: "text", // can be "text" or "image"
          answers: [
            {text: "", answerType:"text", is_correct: false}, 
            {text:"", answerType:"text", is_correct: false}, 
            {text:"", answerType:"text", is_correct: false},
            {text:"", answerType:"text", is_correct: false}
          ],
          order:1
        },
        {
          title: "",
          image: "",
          answerType: "text", // can be "text" or "image"
          answers: [
            {text:"", answerType:"text", is_correct: false}, 
            {text:"", answerType:"text", is_correct: false}, 
            {text:"", answerType:"text", is_correct: false},
            {text:"", answerType:"text", is_correct: false}
          ],
          order:2
        }  
    ]);

    async function onSave(data){
        data["questions"] = questions;
        console.log(data);
        setLoading(true)
        try{    
            const response = await createTest(data);
            console.log(response);
        }catch (e){
            throw new Error(e);
        }finally{
            setLoading(false);
        }
    };

    return (
        <div>
            <form className={styles.form} style={{marginBottom: "1rem"}} onSubmit={handleSubmit(onSave)}>
                <div style={{width: "90%",margin: "auto", marginBottom: "20px", padding: "20px", borderBottom: "1px solid grey"}}>
                    <div className={styles.inputField}>
                        <label htmlFor="title">Title</label>
                        <input {...register("title")} type="text" placeholder="Enter title" />
                    </div>
                    <div className={styles.inputField}>
                        <label htmlFor="description">Description</label>
                        <textarea {...register("description")} placeholder="Enter description"></textarea>
                    </div>
                    <div className={styles.inputField}>
                        <label htmlFor="test_type">Type</label>
                        <select {...register("test_type")} name="test_type" style={{width: "fit-content"}}>
                            <option value="modo">Modo</option>
                            <option value="ent">Ent</option>
                        </select>
                    </div>
                    <QuestionsCreator questions={questions} setQuestions={setQuestions}/>
                </div>
                <div style={{display: "flex", gap: "0.5rem"}}>
                    <button type='submit'>Save</button>
                    <button onClick={onClose}>Close</button>
                </div>
            </form>
        </div>
    )
}

export default TestCreationForm