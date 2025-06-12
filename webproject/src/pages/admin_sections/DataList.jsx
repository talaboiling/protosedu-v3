import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import { Select, MenuItem } from '@mui/material';

const DataList = ({type="sync", data=[], endpoint="", asyncFunction=null, actionFunction=null}) => {
    const [loading, setLoading] = useState(false);
    const [listData, setListData] = useState(null);
    const [selected, setSelected] = useState(null);

    useEffect(()=>{
        async function fetchByEndpoint(){
            const responseData = await asyncFunction();
            // const diagnosticTests = responseData.filter(test=>test.test_type=="diagnostic");
            // setListData(diagnosticTests);
            setListData(responseData);
        }
        if (type==="sync"){
            setListData(data);
        }else if (type==="async"){
            setLoading(true);
            try {
                fetchByEndpoint();
            }catch (e){
                toast.error(e.message || "Error happened");
            }finally{
                setLoading(false);
            }
        }
    },[]);
    if (loading){
        return <p>Loading</p>;
    }
    if (listData){
        return (
            <Select
                labelId="demo-simple-select-label"
                value={selected}
                label="Выбери тест"
                onChange={e => {
                    setSelected(e.target.value)
                    actionFunction(e.target.value)
                    }
                }
                fullWidth
            >
               {listData.map(listElement => (
                    <MenuItem key={listElement.id} value={listElement.id}>
                        {listElement.title} {listElement?.description}
                    </MenuItem>
                ))}
            </Select>
        )
    }
}

export default DataList