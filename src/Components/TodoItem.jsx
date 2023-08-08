import React, { useContext, useState } from 'react'
import { TodoContext } from './TodoApp';
import ClearIcon from '@mui/icons-material/Clear';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import { ThemeContext } from './TodoApp';

const TodoItem = ({todo, isArchive}) => {

    console.log(todo)

    const [toggler, setToggler] = useState({
        checkbox:false,
        cross:false,
        edit:false
    });

    let priorityColor = {
        'low':'text-green-500',
        'medium':'text-yellow',
        'high':'text-red',
    }

    const {todoData, setTodoData, archive, setArchive} = useContext(TodoContext);

    const {theme} = useContext(ThemeContext);

    const handleDeleteTodo = (id) =>
    {
        
        if(isArchive)
        {
            let copyData = [...archive];
            copyData = copyData.filter(todo=>todo.id!==id)
            setArchive(copyData);
        }
        else
        {
            let copyTodoData = [...todoData];
            copyTodoData = copyTodoData.filter(todo=>todo.id!==id)
            setTodoData(copyTodoData)
        }


    }

    const displayCross = () =>
    {
        setToggler((prev)=>({...prev, cross: !toggler.cross}))
    }

    const toggleCheckBtn = (id) =>
    {
        setToggler((prev)=>({...prev, checkbox: !toggler.checkbox, cross:false }))

        let copyTodoData = [...todoData];
        copyTodoData = copyTodoData.map(todo=>{
            if(todo.id===id)
                todo.pending = !todo.pending
            return todo;
        });

        let archiveData = [...archive];
        let removedTodoFromArchive = archiveData.filter(todo=>todo.id===id)
        archiveData = archiveData.filter(todo=>todo.id!=id);

        if(isArchive){
            setTodoData([...copyTodoData, {...removedTodoFromArchive[0], pending:true}])
            setArchive(archiveData);
        }
        else{
            setTodoData([...copyTodoData])
        }

    }

    const togglerEdit = () =>
    {
        setToggler((prev)=>({...prev, edit: !toggler.edit}))
    }

    return (
            <div
            className="flex items-center border border-t-0 border-l-0 border-r-0 border-b-1"
            onMouseEnter={displayCross}
            onMouseLeave={displayCross}
            >
                {todo.pending ? (
                    <RadioButtonUncheckedIcon
                    style={{ color: "lightgray", fontSize: "1.2rem", cursor: "pointer" }}
                    onClick={() => toggleCheckBtn(todo.id)}
                    />
                ) : (
                    <CheckCircleOutlineIcon
                    style={{ color: "green", fontSize: "1.2rem", cursor: "pointer" }}
                    onClick={() => toggleCheckBtn(todo.id)}
                    />
                )}
                <div className="flex justify-between p-4 w-[100%]">
                    <div className='flex justify-between w-[90%]'>
                        <p
                        className={`w-[100%] outline-0 ${
                            !todo.pending ? "line-through text-slate-400" : ''
                        } ${priorityColor[todo.priority]} `}
                        contentEditable={toggler.edit}
                        onDoubleClick={togglerEdit}
                        onBlur={togglerEdit}
                        >
                        {todo.todoName}
                        </p>

                        <button className={`border w-[100px] text-[12px] rounded-xl ${todo.pending ? 'bg-red-400 text-white border border-2 border-red-500' : 'bg-green-300 text-slate-600 border-green-500 border border-2' }`}>{todo.pending ? 'Pending' : 'Completed'}</button>
                    </div>
                    {toggler.cross && ((!todo.pending && isArchive) || todo.pending) && (
                    <ClearIcon
                        style={{ color: "red", fontSize: "1.2rem", cursor: "pointer" }}
                        onClick={()=>handleDeleteTodo(todo.id)}
                    />
                    )}
                </div>
            </div>
    );
};

export default TodoItem;
