import React, { createContext, useEffect, useState } from 'react'
import AddTodo from './AddTodo'
import TodoList from './TodoList'
import { themes } from '../theme';
import DarkModeIcon from '@mui/icons-material/DarkMode';

export const TodoContext = createContext({});

export const ThemeContext = createContext(themes.light);

const TodoApp = () => {

    const [todoData, setTodoData] = useState([]);

    const [activeTab, setActiveTab] = useState('all');

    const [theme, setTheme] = useState({name:'light', context: themes['light']});

    const switchTheme = () =>
    {
        if(theme.name==='light')
            setTheme({name:'dark', context: themes['dark']})
        else
            setTheme({name:'light', context: themes['light']})
    }

    const toggleActive = (tab) =>
    {
        setActiveTab(tab)
    }

    const handleClearCompleted = (e) =>
    {
        e.stopPropagation()
        let copyTodoData = [...todoData];
        copyTodoData = copyTodoData.filter(todo=>todo.pending);
        setTodoData(copyTodoData);
    }

    useEffect(()=>
    {
        let todoRecord = JSON.parse(localStorage.getItem("todoData"));
        if(todoRecord)
            setTodoData(todoRecord);
    },[])

    useEffect(()=>
    {
        localStorage.setItem("todoData", JSON.stringify(todoData));

    },[todoData])


    return (
        
        <TodoContext.Provider value={{todoData, setTodoData, activeTab}}>
            <ThemeContext.Provider value={{theme, setTheme}}>
            <div className={`flex justify-start items-center flex-col ${theme.context.backgroundOuter} h-[100vh] relative`}>

                <h1 className={`text-5xl font-medium my-[55px] ${theme.context.color}`}>📓 Todo List</h1>

                <div className={`w-[47%] p-8 min-h-[420px] rounded ${theme.context.shadow} ${theme.context.backgroundInner}`}>
                    <AddTodo/>
                    <TodoList/>

                    <div className={`flex justify-between items-center text-[13.5px] font-light ${theme.context.color}`}>

                        <p> {todoData.filter((todo)=>todo.pending).length} item(s) left</p>

                        <div className='w-[60%] flex justify-center my-4'>
                        {
                            ['all','active','completed'].map((item, index)=>(
                                <button key={item+index} className={`p-2 px-3 mx-2 rounded-lg ${item === activeTab ? 'border border-1' : '' }`} onClick={()=>toggleActive(item)}>{item}</button>
                            ))
                        }
                        </div>

                        {
                            activeTab !== 'active' && 
                        <p className='cursor-pointer' onClick={handleClearCompleted}>Clear Completed</p>
                        }
                    </div>
                </div>

                <DarkModeIcon className={`absolute right-[20px] top-[20px] cursor-pointer ${theme.context.color}`} onClick={switchTheme} />

            </div>    
            </ThemeContext.Provider>
        </TodoContext.Provider>

    )
}

export default TodoApp