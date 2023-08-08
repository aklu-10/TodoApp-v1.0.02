import React, { useContext, useEffect, useState } from 'react'
import { TodoContext } from './TodoApp';
import TodoItem from './TodoItem';
import FolderOffIcon from '@mui/icons-material/FolderOff';

const TodoList = () => {

    const {todoData, activeTab, pages, setPages, filter, showArchive, archive} = useContext(TodoContext);
    
    if(!todoData.length) return <p className='h-[350px]'></p>;

    const [currentPage, setCurrentPage] = useState(1);
    
    let todoRecord = [...todoData];

    if(activeTab === 'active')
        todoRecord = todoData.filter(todo=>todo.pending)
    else if(activeTab === 'completed')
        todoRecord = todoData.filter(todo=>!todo.pending)

    
    let slicedRecord = todoRecord?.slice(((currentPage-1)*6), ((currentPage-1)*6)+6);

    slicedRecord = slicedRecord.filter(todo=>
    {
        return todo.todoName?.toLowerCase().includes(filter.filterByTitle?.toLowerCase());
    })

    if(filter.filterByPriority && filter.filterByPriority!=='all')
    {
        slicedRecord = slicedRecord.filter(todo=>
        {
            return todo.priority === filter.filterByPriority;
        })
    }

    if(filter.filterByStatus && filter.filterByStatus!=='all')
    {
        slicedRecord = slicedRecord.filter(todo=>
        {
            if(filter.filterByStatus === 'pending')
                return todo.pending;
            else
                return !todo.pending;
        })
    }

    console.log(filter.filterByStatus)

    console.log(slicedRecord)


    const handlePagination = (page) =>
    {
        setCurrentPage(page);
    }

    useEffect(()=>
    {
        setPages(Math.ceil(todoData.length/6));

        if(!slicedRecord.length)
        {
            (currentPage !== 1) &&
            setCurrentPage(currentPage-1);
        }

    },[todoData])

    if(showArchive)
    {
        console.log("here", archive)
    }
    else
        console.log("asd", archive)

    return (

        <div className='min-h-[250px] '>

            <div className='h-[350px]'>
                {

                    !showArchive ? 

                    archive.length ?
                    archive?.map(todo=>(
                        <TodoItem isArchive={true} todo={todo} key={("todo"+todo.id)} />
                    )) : <div className='h-[100%] flex flex-col justify-center items-center'>
                            
                            <FolderOffIcon style={{fontSize:'4rem', color:'rgba(0,0,0,.22)'}}/>
                            <p style={{color:'rgba(0,0,0,.22)'}}>No Archive</p>
                    
                    </div>
                    :
                    slicedRecord?.map(todo=>(
                        <TodoItem todo={todo} key={("todo"+todo.id)} />
                    ))

                }
            </div> 

            <div className='flex justify-center flex-wrap w-[400px] m-auto mt-[20px]'>
                {
                    [...Array(pages).keys()].map(page=>(
                        <button key={page} className={`w-[60px] py-1 px-2 mx-2 rounded ${ currentPage === page+1 ? 'bg-black text-white' : '' }`} onClick={()=>handlePagination(page+1)}>{page+1}</button>
                    ))
                }
            </div>

        </div>

    )
}

export default TodoList