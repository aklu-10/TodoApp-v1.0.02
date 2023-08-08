import React, { useContext, useState } from 'react'
import { TodoContext } from './TodoApp'
import { ThemeContext } from './TodoApp';

const AddTodo = () => {

    const [todoInput, setTodoInput] = useState('');

    const {todoData, setTodoData} = useContext(TodoContext);
    
    const {theme} = useContext(ThemeContext);

    const handleAddTodo = () =>
    {
        if(!todoInput) return;

        let lastTodo = todoData.slice(-1)[0]?.id;


        if(lastTodo)
            lastTodo = Number(lastTodo) + 1;
        else
            lastTodo = 1;

        let base = {
            id: lastTodo,
            todoName:todoInput,
            pending:true,
            priority:'low'
        }

        setTodoData((prev)=>([...prev, base]));

        setTodoInput('');

    }

    return (
        <div className='mt-[20px]'>
            <input className={`p-4 w-[100%] bg-[#f8f8f8] border border-t-0 border-l-0 border-r-0 border-b-1 text-sm focus:outline-0 bg-transparent ${theme.context.color}`} type='text' placeholder='Write your todos here...' value={todoInput} onChange={(e)=>setTodoInput(e.target.value)} onKeyDown={({key})=>{ key === 'Enter' && handleAddTodo() }}/>
        </div>
    )
}

export default AddTodo