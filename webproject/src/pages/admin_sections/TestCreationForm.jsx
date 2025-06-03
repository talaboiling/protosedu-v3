import React, {useEffect, useState} from 'react'
import styles from "./TestCreationForm.module.css"
import QuestionsCreator from './QuestionsCreator'
import { useForm } from 'react-hook-form'
import { createTest, deleteTest, updateTest } from '../../utils/apiService'
import { toast } from 'react-toastify'
import {buildFormDataForUpdate,buildFormDataForCreation } from '../../lib/helperFunctions'
import { Loader, X } from 'lucide-react'

const mockQuestions = [
    {
      title: "",
      image: "",
      answer_options: [
        {text: "", option_type:"text", is_correct: false}, 
        {text:"", option_type:"text", is_correct: false}, 
        {text:"", option_type:"text", is_correct: false},
        {text:"", option_type:"text", is_correct: false}
      ],
      order:1
    },
    {
      title: "",
      image: "",
      answer_options: [
        {text:"", option_type:"text", is_correct: false}, 
        {text:"", option_type:"text", is_correct: false}, 
        {text:"", option_type:"text", is_correct: false},
        {text:"", option_type:"text", is_correct: false}
      ],
      order:2
    }  
];

const TestCreationForm = ({mode, onClose, testData}) => {

    const [loading, setLoading] = useState(null);



    const {register, handleSubmit} = useForm({
        defaultValues: mode==="creation" ? {
            title:"",
            description: "",
            test_type:""
        } : {
            title:testData.title,
            description: testData.description,
            test_type:testData.test_type
        }
    });

    const [questions, setQuestions] = useState([]);

    console.log(mode);

    useEffect(()=>{
        if (mode=="update"){
            setQuestions(testData.questions);
        }else{
            setQuestions(mockQuestions);
        }
    }, [testData.id, mode]);

    console.log(testData);

    async function onSave(data){
        data["questions"] = [...questions];
        console.log(data);
        setLoading(true);
        if (mode==="creation"){
            const formData = new FormData();
            buildFormDataForCreation(formData, data);
            for (const [key, value] of formData.entries()) {
                console.log(key, value);
            }
            try{    
                const response = await createTest(formData);
                console.log(response);
                toast.success("Тест добавлен!");
            }catch (e){
                toast.error("Ошибка: " + e.message);
                throw new Error(e);
            }finally{
                setLoading(false);
                onClose();
            }
        }else if (mode==="update"){
            const id = testData.id;
            const formData = new FormData();
            buildFormDataForUpdate(formData, data);
            for (const [key, value] of formData.entries()) {
                console.log(key, value);
            }
            try{    
                console.log(formData);

                const response = await updateTest(formData);
                console.log(response);
                toast.success("Тест обновлен!");
            }catch (e){
                toast.error("Ошибка: " + e.message);
                throw new Error(e);
            }finally{
                setLoading(false);
                onClose();
            }
        }else{
            
        }
    };

    const deleteTestHandler = async (id) => {
        console.log(id, 134134212341234)
        try{    
            setLoading(true);
            const response = await deleteTest(id);
            console.log(response);
            toast.success("Тест удален!");
        }catch (e){
            toast.error("Ошибка: " + e.message);
            throw new Error(e);
        }finally{
            setLoading(false);
            onClose();
        }
    }

    return (
        <div>
            <form className={styles.form} style={{marginBottom: "1rem", position: "relative"}} onSubmit={handleSubmit(onSave)}>
                <div style={{width: "90%",margin: "auto", marginBottom: "20px", padding: "20px", borderBottom: "1px solid grey"}}>
                    <div className={styles.inputField}>
                        <label htmlFor="title">Title</label>
                        <input {...register("title")} type="text" placeholder="Enter title"/>
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
                            <option value="diagnostic">Диагностический</option>
                        </select>
                    </div>
                    <QuestionsCreator questions={questions} setQuestions={setQuestions}/>
                </div>
                <div style={{display: "flex", gap: "0.5rem"}}>
                    <button type='submit'>Save</button>
                    <button onClick={onClose}>Close</button>
                    {mode==="update" && (
                        <button
                            style={{
                                cursor: "pointer",
                                backgroundColor: "red",
                                color: "white",
                                padding: "20px"
                            }}
                            type='button'
                            onClick={()=>deleteTestHandler(testData.id)}
                        >
                            Удалить тест
                        </button>
                    )}
                </div>
            </form>
            {loading && <Loader />}
        </div>
    )
}

export default TestCreationForm