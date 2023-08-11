import AddTodo from './AddTodo'
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import FilterAltOffIcon from '@mui/icons-material/FilterAltOff';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import ArchiveIcon from '@mui/icons-material/Archive';
import FolderOffIcon from '@mui/icons-material/FolderOff';
import UnarchiveIcon from '@mui/icons-material/Unarchive';
import Tooltip from '@mui/material/Tooltip';
import TodoList from './TodoList'
import DeleteIcon from '@mui/icons-material/Delete';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import React, { createContext, useEffect, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import { themes } from '../theme';
import 'react-toastify/dist/ReactToastify.css';
import TodoItem from './TodoItem';

export const TodoContext = createContext({});

export const ThemeContext = createContext(themes.light);

const TodoApp = () => {

    const [todoData, setTodoData] = useState([]);

    const [archive, setArchive] = useState([]);
    
    const [pages, setPages] = useState(0);

    const [activeTab, setActiveTab] = useState('all');

    const [showArchive, setShowArchive] = useState(true);

    const [trashCan, setTrashCan] = useState([]);

    const [showTrash, setShowTrash] = useState(null);

    const [showMenu, setShowMenu] = useState(false);

    const [showArchiveMenu, setShowArchiveMenu] = useState(false);

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

        if(tab === 'active')
        {
            setFilter((prev)=>({...prev, filterByStatus:'pending'}))
        }
        else if(tab === 'completed')
        {
            setFilter((prev)=>({...prev, filterByStatus:'completed'}))
        }
        else
        {
            setFilter((prev)=>({...prev, filterByStatus:''}))
        }
    }

    const handleClearCompleted = (e) =>
    {
        e.stopPropagation()
        let copyTodoData = todoData.filter(todo=>todo.pending);
        let archiveData = todoData.filter(todo=>!todo.pending);
        
        setTodoData(copyTodoData);
        setArchive((prev)=>[...prev, ...archiveData]);

        if(archiveData.length){
            toast.info("Completed todos are archived!")
        }
    }

    const handleFilteration = (e) =>
    {
        setFilter(prev=>({...prev, [e.target.name]: e.target.value}));
    }   

    const handleSelectAll = (e) =>
    {
        let copyData = [...todoData]
        copyData.map(todo=>{
            
                todo.pending = !e.target.checked
        })

            setTodoData(copyData)

    }

    const handleTrashCan = () =>
    {
        setShowTrash((prev)=>!prev);
    }

    useEffect(()=>
    {
        let todoRecord = JSON.parse(localStorage.getItem("todoData"));
        let todoArchive = JSON.parse(localStorage.getItem("todoArchive"));
        let trashCanData = JSON.parse(localStorage.getItem("trashCan"));
        if(todoRecord)
            setTodoData(todoRecord);
        if(todoArchive)
            setArchive(todoArchive);
        if(trashCanData)
            setTrashCan(trashCanData);
    },[])

    useEffect(()=>
    {
        localStorage.setItem("todoData", JSON.stringify(todoData));
        localStorage.setItem("todoArchive", JSON.stringify(archive));
        localStorage.setItem("trashCan", JSON.stringify(trashCan));

    },[todoData,archive])


    return (
        
        <TodoContext.Provider value={{todoData, setTodoData, activeTab, pages, setPages, filter, showArchive, archive, setArchive, setTrashCan, trashCan, showTrash}}>
            <ThemeContext.Provider value={{theme, setTheme}}>
            <div className={`wrapper flex justify-start items-center flex-col ${theme.context.backgroundOuter} h-[100vh] relative]`}>

                <h1 className={`text-5xl font-medium my-[55px] ${theme.context.title}`}>📓 Todo List</h1>

                <div className={`todoWrapper w-[47%] p-8 min-h-[420px] relative rounded ${theme.context.shadow} ${theme.context.backgroundInner} ${showTrash===true ? 'todoWrapperStart' : showTrash===false ? 'todoWrapperBack' : ''} `}>
                {
                    showArchive ?

                    <AddTodo/> :

                    <p className='h-[30px]'></p>
                }

                {
                    todoData.length!=0 && showArchive &&
                    <div>
                        <input type='checkbox' onChange={handleSelectAll}/>
                        <span className='text-sm px-2 text-gray-500'>Select All</span>
                    </div>
                    
                }

                    <TodoList/>

                    <div className={`flex justify-between items-center text-[13.5px] font-light ${theme.context.color}`}>

                        <p> {showArchive ? todoData.filter((todo)=>todo.pending).length + ' item(s) left': archive.length + ' item(s)'} </p>

                        {
                            showArchive 
                            ?
                                todoData.length 
                                ?
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
                                :  <div className='h-[100%] flex flex-col justify-center items-center absolute top-[30px] right-[43%]'>
                                    <FolderOffIcon style={{fontSize:'4.5rem', color:'rgba(0,0,0,.22)'}}/>
                                    <p style={{color:'rgba(0,0,0,.42)', fontSize:'1rem'}}>Add a Todo </p>
                                </div>

                            : archive.length==0 &&

                                <div className='h-[100%] flex flex-col justify-center items-center absolute top-[0] right-[42%]'>
                                    <FolderOffIcon style={{fontSize:'4.5rem', color:'rgba(0,0,0,.22)'}}/>
                                    <p style={{color:'rgba(0,0,0,.42)', fontSize:'1.2rem'}}>No Archive</p>
                                </div>
                        }
                    </div>

                    {
                        filter.isFilterOn ?

                            <Tooltip title="Filter Off" arrow>
                                <FilterAltOffIcon className={`absolute ${showArchive ? 'right-[20px] top-[20px]' : 'right-[60px] top-[20px]'}  cursor-pointer ${theme.context.color} `} onClick={()=>setFilter((prev)=>({...prev, isFilterOn: false}))}/>
                            </Tooltip>
                        
                        :
                        <Tooltip title="Filter On" arrow>
                            <FilterAltIcon className={`absolute ${showArchive ? 'right-[20px] top-[20px]' : 'right-[60px] top-[20px]'} cursor-pointer ${theme.context.color}`} onClick={()=>setFilter((prev)=>({...prev, isFilterOn: true}))}/>
                        </Tooltip>
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

                                {
                                    showArchive &&

                                    <div className='mb-[5px] flex gap-[10px]'>
                                        <p className='mb-[5px]'>Status - </p>
                                        <select className='w-[70%]' name='filterByStatus' onChange={handleFilteration} value={filter.filterByStatus}>
                                            <option value={''}>all</option>
                                            <option value={'pending'}>pending</option>
                                            <option value={'completed'}>completed</option>
                                        </select>
                                    </div>
                                }

                                <div className='mb-[5px] flex gap-[10px]'>
                                    <p className='mb-[5px]'>Priority - </p>
                                    <select className='w-[70%]' name='filterByPriority' onChange={handleFilteration} value={filter.filterByPriority}>
                                        <option value={''}>all</option>
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

                        <Tooltip title="Show Archive" arrow>
                            <ArchiveIcon className={`absolute right-[65px] top-[20px] cursor-pointer ${theme.context.color} `} onClick={()=>setShowArchive(false)}/>
                        </Tooltip>
                        
                        :
                        <Tooltip title="Hide Archive" arrow>
                            <UnarchiveIcon className={`absolute right-[100px] top-[20px] cursor-pointer ${theme.context.color}`} onClick={()=>setShowArchive(true)}/>
                        </Tooltip>

                    }
                    <div className='asbolute'>
                    {
                        !showArchive ? 

                        <Tooltip title="Show Menu" arrow>
                            <MoreVertIcon className={`absolute right-[20px] top-[20px] cursor-pointer ${theme.context.color}`} style={{cursor:'pointer'}} onClick={()=>setShowArchiveMenu((prev)=>!prev)}/>
                        </Tooltip>  
                        : null
                    }
                    <div>
                        
                    </div>
                    
                    {
                        !showArchive && showArchiveMenu &&
                        <div className={`flex justify-center rounded shadow-[0_0_4px_gray] absolute w-[100px] h-[40px] top-[20px] right-[-90px] ${theme.context.backgroundInner} ${theme.context.color}`}>
                            <button className='w-[100%] text-sm hover:opacity-[.78]' onClick={()=>{
                                
                                setTodoData((prev)=>[...prev, ...archive])
                                setArchive([]);
                                localStorage.removeItem("todoArchive");
                                setPages(Math.ceil(archive.length/6));
                                toast.info("Todos unarchived.")
                            }}>Unarchive All</button>
                        </div>
                    }
                    </div>


                </div>

                <Tooltip title={`${theme.name === 'light' ? 'Dark' : 'Light' } mode`} arrow>
                    <DarkModeIcon className={`absolute right-[20px] top-[20px] cursor-pointer ${theme.context.color}`} onClick={switchTheme} />
                </Tooltip>

                {
                    trashCan.length==0 ? 
                    <div className='absolute right-[20px] bottom-[20px] cursor-pointer' onClick={handleTrashCan}>
                        <Tooltip title="trash" arrow>
                            <img src='./images/trash.png' width="90px" className='object-cover '/>
                        </Tooltip>
                    </div>
                    :
                    <div className='absolute right-[40px] bottom-[25px] cursor-pointer' onClick={handleTrashCan}>
                        <Tooltip title="trash" arrow>
                            <img src='./images/trashes.png' width="50px" className='object-cover '/>
                        </Tooltip>
                    </div>
                }

                <div className={`trashWrapper absolute top-[160px] flex items-center justify-center h-[620px] min-w-[300px] w-[47vw] rounded ${showTrash===true ? 'trashWrapperStart' : showTrash===false ? 'trashWrapperBack' : ''} ${theme.context.backgroundInner} `}>

                    {
                        trashCan.length!=0 ?
                        <div className='flex flex-col'>
                            <div className='flex justify-between relative'>
                                <p className={`mb-[10px] ${theme.context.lightColor}`}>Trash</p>
                                <MoreVertIcon style={{color:'gray', cursor:'pointer'}} onClick={()=>setShowMenu((prev)=>!prev)}/>

                                {
                                    showMenu &&
                                    <div className={`flex justify-center absolute w-[100px] h-[40px] right-[20px] ${theme.context.backgroundOuter} ${theme.context.color}`}>
                                        <button className='w-[100%] text-sm hover:opacity-[.78]' onClick={()=>{
                                            setTrashCan([]);
                                            localStorage.removeItem('trashCan')
                                        }}>Clear All</button>
                                    </div>
                                }

                            </div>
                            <div className='overflow-auto h-[550px] w-[500px]' >
                            {
                                trashCan.map(todo=>(
                                    <TodoItem todo={todo} key={("todo"+todo.id)} />
                                ))
                            }                        
                            </div>
                        </div>
                        :
                        <div className='flex flex-col items-center'>
                            <DeleteIcon style={{fontSize:'5rem',  color:'rgba(0,0,0,.42)'}}/>
                            <p style={{ color:'rgba(0,0,0,.42)' }}>No todos in trash</p>
                        </div>
                    }

                </div>
                


            </div>    

            {/* logger */}

            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />

            </ThemeContext.Provider>
        </TodoContext.Provider>

    )
}

export default TodoApp