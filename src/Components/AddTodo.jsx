import React, { useContext, useState } from 'react'
import { TodoContext } from './TodoApp'
import { ThemeContext } from './TodoApp';
import InputLabel from '@mui/material/InputLabel';
import NativeSelect from '@mui/material/NativeSelect';
import Button from '@mui/material/Button';

const AddTodo = () => {

    const [todoInput, setTodoInput] = useState('');
    const [todoPriority, setTodoPriority] = useState('low');

    const {todoData, setTodoData} = useContext(TodoContext);
    
    const [validation, setValidation] = useState({
        todoInput:{
            errMsg:'Please provide a todo to add.',
            isValid:true
        }
    })

    const {theme} = useContext(ThemeContext);

    const handleAddTodo = () =>
    {
        if(!todoInput.trim())
        {
            setValidation((prev)=>({...prev, todoInput:{...prev.todoInput, isValid: false}}))
            setTimeout(()=>
            {
                setValidation((prev)=>({...prev, todoInput:{...prev.todoInput, isValid: true}}))
            },2000)
            return;
        } 

        setValidation((prev)=>({...prev, todoInput:{...prev.todoInput, isValid: true}}))

        let lastTodo = todoData.slice(-1)[0]?.id;


        if(lastTodo)
            lastTodo = Number(lastTodo) + 1;
        else
            lastTodo = 1;

        let base = {
            id: lastTodo,
            todoName:todoInput,
            pending:true,
            priority:todoPriority
        }

        setTodoData((prev)=>([...prev, base]));

        setTodoInput('');
        setTodoPriority('low');

    }

    return (
        <div className='my-[25px] mt-[50px] relative flex items-center justify-between'>

            <div className='w-[60%] min-w-[150px] relative'>
                <InputLabel variant="standard" htmlFor="uncontrolled-native" style={{fontSize:'.8rem', paddingLeft:'15px', color:'gray'}}>
                    Todo
                </InputLabel>
                
                <input className={`px-4 py-2 w-[100%] bg-[#f8f8f8] border 'border-b-1' ${validation.todoInput.isValid ? 'border-t-0 border-l-0 border-r-0  border-[rgba(0,0,0,.6)]' : 'border-[rgba(255,0,0,.64)]'} text-sm focus:outline-0 bg-transparent ${theme.context.color}`} type='text' placeholder='Write your todos here...' value={todoInput} onChange={(e)=>setTodoInput(e.target.value)} onKeyDown={({key})=>{ key === 'Enter' && handleAddTodo() }}/>
                {
                    !validation.todoInput.isValid && <span className='absolute left-[0px] bottom-[-32px] text-sm text-red-500 my-2 tracking-wide'>Please proivde a todo to add</span>
                }
            </div>

            <div className='mx-[20px]'>
                <InputLabel variant="standard" htmlFor="uncontrolled-native" style={{fontSize:'.8rem', marginBottom:'5px', color:'gray'}}>
                    Priority
                </InputLabel>
                
                <NativeSelect
                value={todoPriority}
                onChange={(e)=>setTodoPriority(e.target.value)}
                style={{color:'gray'}}
                >
                    <option value={'low'}>Low</option>
                    <option value={'medium'}>Medium</option>
                    <option value={'high'}>High</option>
                </NativeSelect>

            </div>

            <div className=' abolsute mt-[25px]'>
                <Button variant="contained" size='small' style={{background:'black'}} onClick={handleAddTodo}>Add Todo</Button>
            </div>

        </div>
    )
}

export default AddTodo