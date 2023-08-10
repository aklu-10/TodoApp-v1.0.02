import React, { useContext, useEffect, useState } from 'react'
import { TodoContext } from './TodoApp';
import TodoItem from './TodoItem';

const TodoList = () => {

    const {todoData, activeTab, pages, setPages, filter, showArchive, archive} = useContext(TodoContext);
    
    if(!todoData.length && !archive.length) return <p className='h-[350px]'></p>;

    const [currentPage, setCurrentPage] = useState(1);
    
    let todoRecord = [...todoData];

    if(activeTab === 'active'){
        todoRecord = todoData.filter(todo=>todo.pending)
        setPages(Math.ceil(todoRecord.length/6));
    }
    else if(activeTab === 'completed'){
        todoRecord = todoData.filter(todo=>!todo.pending)
        setPages(Math.ceil(todoRecord.length/6));
    }

    let slicedRecord;

    if(showArchive)
    {
        slicedRecord = todoRecord?.slice(((currentPage-1)*6), ((currentPage-1)*6)+6);
    }
    else
    {
        slicedRecord = archive?.slice(((currentPage-1)*6), ((currentPage-1)*6)+6)

        console.log(slicedRecord)
    }

    if(showArchive)
    {
        if(filter.filterByTitle || filter.filterByPriority || filter.filterByStatus)
        {
            slicedRecord = [...todoData].filter(todo=>
            {
                return ( (filter.filterByTitle ? todo.todoName?.toLowerCase().includes(filter.filterByTitle?.toLowerCase()) : true) && (filter.filterByPriority ? todo.priority === filter.filterByPriority : true) && (filter.filterByStatus ? filter.filterByStatus === 'pending' ? todo.pending : !todo.pending : true) )
            })
            
            setPages(Math.ceil(slicedRecord.length/6));
            slicedRecord = slicedRecord?.slice(((currentPage-1)*6), ((currentPage-1)*6)+6)
        }
    }
    else
    {
        if(filter.filterByTitle || filter.filterByPriority)
        {
            slicedRecord = [...archive].filter(todo=>
            {
                return ( (filter.filterByTitle ? todo.todoName?.toLowerCase().includes(filter.filterByTitle?.toLowerCase()) : true) && (filter.filterByPriority ? todo.priority === filter.filterByPriority : true) && (filter.filterByStatus ? filter.filterByStatus === 'pending' ? todo.pending : !todo.pending : true) )
            })
    
            setPages(Math.ceil(slicedRecord.length/6));
            slicedRecord = slicedRecord?.slice(((currentPage-1)*6), ((currentPage-1)*6)+6)
        }
    }


    const handlePagination = (page) =>
    {
        setCurrentPage(page);
    }

    useEffect(()=>
    {
        if(showArchive)
        {
            if(filter.filterByTitle || filter.filterByStatus || filter.filterByPriority)
            {
                
            }
            else
            {
                setPages(Math.ceil(todoData.length/6));
            }

            if(!slicedRecord.length)
            {
                (currentPage !== 1) &&
                setCurrentPage(currentPage-1);
            }

        }
        else
        {

            if(currentPage!=1)
                setCurrentPage(1);
            setPages(Math.ceil(archive.length/6));
        }

    },[todoData, filter, showArchive])


    return (

        <div className='min-h-[250px] '>

            <div className='min-h-[350px]'>
                {
                    !showArchive ? 

                    //archive
                        slicedRecord.length ?
                        slicedRecord?.map(todo=>(
                            <TodoItem isArchive={true} todo={todo} key={("todo"+todo.id)} />
                        ))
                        : archive.length!=0 && <div className='h-[400px] flex justify-center items-center'><p className='text-gray-400'>No Results</p></div>
                    :
                        slicedRecord.length ? 
                        slicedRecord?.map(todo=>(
                            <TodoItem todo={todo} key={("todo"+todo.id)} />
                        ))
                        : todoData.length!=0 && <div className='h-[400px] flex justify-center items-center'><p className='text-gray-400'>No Results</p></div>

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