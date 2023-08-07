import React, { useContext } from 'react'
import { TodoContext } from './TodoApp';
import TodoItem from './TodoItem';

const TodoList = () => {


    const {todoData, activeTab} = useContext(TodoContext);

    let todoRecord = todoData;

    if(activeTab === 'active')
        todoRecord = todoData.filter(todo=>todo.pending)
    else if(activeTab === 'completed')
        todoRecord = todoData.filter(todo=>!todo.pending)

    return (

        <div className='min-h-[250px]'>
            {
                todoRecord?.map(todo=>(
                    <TodoItem todo={todo} key={("todo"+todo.id)} />
                ))
            }
        </div>

    )
}

export default TodoList