import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import React, { memo, useContext, useEffect, useState } from 'react'
import { TodoContext } from './TodoApp';
import TodoItem from './TodoItem';

const TodoList = () => {

    const {todoData, activeTab, pages, setPages, filter, showArchive, archive} = useContext(TodoContext);
    
    if(!todoData.length && !archive.length) return <p className='h-[350px]'></p>;

    const [currentPage, setCurrentPage] = useState(1);

    const [lastPage, setLastPage] = useState([1,5]);
    
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

        if(page === lastPage[1])
        {
            setLastPage([lastPage[1]-1,lastPage[1]+2])
        }

        if(page === 1)
        {
            setLastPage([1,5]);
        }

        if(page == pages || page == pages-1)
        {
            setLastPage([ [...Array(pages).keys()].length-5 <0 ? 1 : [...Array(pages).keys()].length-5, [...Array(pages).keys()].length ])
        }
    }


    const handleNext = () =>
    {
        setCurrentPage(currentPage+1);

        if(currentPage === lastPage[1])
        {
            setLastPage([lastPage[1]-1,lastPage[1]+2])
        }
        if(currentPage === 1)
        {
            setLastPage([1,5]);
        }

        if(currentPage == pages || currentPage == pages-1)
        {
            setLastPage([ [...Array(pages).keys()].length-5 <0 ? 1 : [...Array(pages).keys()].length-5, [...Array(pages).keys()].length ])
        }
    }

    const handlePrevious = () =>
    {
        setCurrentPage(currentPage-1);

        if(currentPage-1 === lastPage[0])
        {
            setLastPage([lastPage[0]-1,lastPage[0]+2])
        }

        if(currentPage === 1)
        {
            setLastPage([1,5]);
        }

        if(currentPage == pages || currentPage == pages-1)
        {
            setLastPage([ [...Array(pages).keys()].length-5 <0 ? 1 : [...Array(pages).keys()].length-5, [...Array(pages).keys()].length ])
        }
    }

    useEffect(()=>
    {
        if(showArchive)
        {
            if(!(filter.filterByTitle || filter.filterByStatus || filter.filterByPriority) )
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

            <div className='flex justify-center items-center flex-wrap w-[100%] m-auto mt-[20px]'>
                
                {
                    pages>1 &&
                    <button onClick={handlePrevious} disabled={currentPage===1 ? true : false}>
                        <ChevronLeftIcon  style={{cursor:'pointer', color:`${currentPage===1 ? 'gray' : 'black'}`}}/>
                    </button>
                }
                {
                    [...Array(pages).keys()].map(page=>{

                        if(page==0)
                            return <button key={page} className={`w-[30px] py-1 px-2 mx-2 rounded-[50px] ${ currentPage === page+1 ? 'bg-black text-white' : '' }`} onClick={()=>handlePagination(page+1)}>{page+1}</button>

                        if(page >= lastPage[0] && page< lastPage[1])
                            return <button key={page} className={`w-[30px] py-1 px-2 mx-2 rounded-[50px] ${ currentPage === page+1 ? 'bg-black text-white' : '' }`} onClick={()=>handlePagination(page+1)}>{page+1}</button>

                        else if(page===lastPage[1]+1)
                            return <span>...</span>

                        else if(page === [...Array(pages).keys()].length-1)
                            return <button key={page} className={`w-[30px] py-1 px-2 mx-2 rounded-[50px] ${ currentPage === page+1 ? 'bg-black text-white' : '' }`} onClick={()=>handlePagination(page+1)}>{page+1}</button>

                        else if(page==1 && lastPage[0]!=1)
                            return <span>...</span>
                    })
                }
                {
                    pages>1  &&
                    <button onClick={handleNext} disabled={currentPage===pages ? true : false}>
                        <ChevronRightIcon style={{cursor:'pointer', color:`${currentPage===pages ? 'gray' : 'black'}`}}/>
                    </button>
                }
            </div>

        </div>

    )
}

export default memo(TodoList)