import React, { createContext, useEffect, useState } from 'react'
import AddTodo from './AddTodo'
import TodoList from './TodoList'
import { themes } from '../theme';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import FilterAltOffIcon from '@mui/icons-material/FilterAltOff';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import ArchiveIcon from '@mui/icons-material/Archive';
import UnarchiveIcon from '@mui/icons-material/Unarchive';

export const TodoContext = createContext({});

export const ThemeContext = createContext(themes.light);

const TodoApp = () => {

    const [todoData, setTodoData] = useState([]);

    const [archive, setArchive] = useState([]);
    
    const [pages, setPages] = useState(0);

    const [activeTab, setActiveTab] = useState('all');

    const [showArchive, setShowArchive] = useState(true);

    const [filter, setFilter] = useState({
        filterByTitle: '',
        filterByPriority: '',
        filterByStatus: '',
        isFilterOn: false
    });

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

        console.log(todoData, pages);
    }

    const handleClearCompleted = (e) =>
    {
        e.stopPropagation()
        let copyTodoData = todoData.filter(todo=>todo.pending);
        let archiveData = todoData.filter(todo=>!todo.pending);
        setTodoData(copyTodoData);
        setArchive((prev)=>[...prev, ...archiveData]);
    }

    const handleFilteration = (e) =>
    {
        setFilter(prev=>({...prev, [e.target.name]: e.target.value}));
    }   

    useEffect(()=>
    {
        let todoRecord = JSON.parse(localStorage.getItem("todoData"));
        let todoArchive = JSON.parse(localStorage.getItem("todoArchive"));
        if(todoRecord)
            setTodoData(todoRecord);
        if(todoArchive)
            setArchive(todoArchive);
    },[])

    useEffect(()=>
    {
        localStorage.setItem("todoData", JSON.stringify(todoData));
        localStorage.setItem("todoArchive", JSON.stringify(archive));

    },[todoData,archive])


    return (
        
        <TodoContext.Provider value={{todoData, setTodoData, activeTab, pages, setPages, filter, showArchive, archive, setArchive}}>
            <ThemeContext.Provider value={{theme, setTheme}}>
            <div className={`flex justify-start items-center flex-col ${theme.context.backgroundOuter} h-[100vh] relative`}>

                <h1 className={`text-5xl font-medium my-[55px] ${theme.context.color}`}>📓 Todo List</h1>

                <div className={`w-[47%] p-8 min-h-[420px] relative rounded ${theme.context.shadow} ${theme.context.backgroundInner}`}>
                    <AddTodo/>
                    <TodoList/>

                    <div className={`flex justify-between items-center text-[13.5px] font-light ${theme.context.color}`}>

                        <p> {showArchive ? todoData.filter((todo)=>todo.pending).length : archive.length} item(s) left</p>

                        {
                            showArchive && 
                            <>
                                <div className='w-[60%] flex justify-center my-4'>
                                {
                                    ['all','active','completed'].map((item, index)=>(
                                        <button key={item+index} className={`p-2 px-3 mx-2 rounded-lg ${item === activeTab ? 'border border-1' : '' }`} onClick={()=>toggleActive(item)}>{item}</button>
                                    ))
                                }
                                </div>

                                {
                                    activeTab !== 'active' ? 
                                    <p className='cursor-pointer' onClick={handleClearCompleted}>Clear Completed</p> : <p className='w-[100px]'></p>
                                }
                            </>
                        }
                    </div>

                    {
                        filter.isFilterOn ?

                        <FilterAltOffIcon className='absolute right-[20px] top-[20px] cursor-pointer' onClick={()=>setFilter((prev)=>({...prev, isFilterOn: false}))}/>
                        
                        :
                        <FilterAltIcon className='absolute right-[20px] top-[20px] cursor-pointer' onClick={()=>setFilter((prev)=>({...prev, isFilterOn: true}))}/>
                    }
                    
                    {
                        filter.isFilterOn &&
                        <div className='absolute right-[-45%] top-[0] bg-white w-[265px] h-[200px] p-2 rounded shadow'>
                            <p className='text-sm mb-[10px]'>Filter By : </p>
                            <div className='flex flex-col justify-around h-[150px]'>
                                <div className='mb-[5px] flex gap-[10px] items-center'>
                                    <p>Title - </p>
                                    <input className='border w-[79%] px-2' name='filterByTitle' onChange={handleFilteration} value={filter.filterByTitle} />
                                </div>
                                <div className='mb-[5px] flex gap-[10px]'>
                                    <p className='mb-[5px]'>Status - </p>
                                    <select className='w-[70%]' name='filterByStatus' onChange={handleFilteration} value={filter.filterByStatus}>
                                        <option value={'all'}>all</option>
                                        <option value={'pending'}>pending</option>
                                        <option value={'completed'}>completed</option>
                                    </select>
                                </div>
                                <div className='mb-[5px] flex gap-[10px]'>
                                    <p className='mb-[5px]'>Priority - </p>
                                    <select className='w-[70%]' name='filterByPriority' onChange={handleFilteration} value={filter.filterByPriority}>
                                        <option value={'all'}>all</option>
                                        <option value={'low'}>low</option>
                                        <option value={'medium'}>medium</option>
                                        <option value={'high'}>high</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                    }

                    {
                        showArchive ?

                        <ArchiveIcon className='absolute right-[65px] top-[20px] cursor-pointer' onClick={()=>setShowArchive(false)}/>
                        
                        :

                        <UnarchiveIcon className='absolute right-[65px] top-[20px] cursor-pointer' onClick={()=>setShowArchive(true)}/>

                    }



                </div>

                <DarkModeIcon className={`absolute right-[20px] top-[20px] cursor-pointer ${theme.context.color}`} onClick={switchTheme} />



            </div>    
            </ThemeContext.Provider>
        </TodoContext.Provider>

    )
}

export default TodoApp