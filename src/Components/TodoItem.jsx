import React, { useContext, useState } from 'react'
import { TodoContext } from './TodoApp';
import ClearIcon from '@mui/icons-material/Clear';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import { ThemeContext } from './TodoApp';
import { toast } from 'react-toastify';

const TodoItem = ({todo, isArchive}) => {

    console.log(todo)

    const [toggler, setToggler] = useState({
        checkbox:false,
        cross:false,
        edit:false
    });

    let priorityColor = {
        'low':['text-green-500', 'bg-green-500'],
        'medium':['text-yellow-500', 'bg-yellow-500'],
        'high':['text-red-500', 'bg-red-500'],
    }

    const {todoData, setTodoData, archive, setArchive, setPages} = useContext(TodoContext);

    const {theme} = useContext(ThemeContext);

    const handleDeleteTodo = (id) =>
    {
        
        if(confirm("Are you sure to delete?"))
        {
            if(isArchive)
            {
                let copyData = [...archive];
                copyData = copyData.filter(todo=>todo.id!==id)
                setArchive(copyData);
                setPages(Math.ceil(archive.length/6));
            }
            else
            {
                let copyTodoData = [...todoData];
                copyTodoData = copyTodoData.filter(todo=>todo.id!==id)
                setTodoData(copyTodoData)
            }
        }
    }

    const displayCross = () =>
    {
        setToggler((prev)=>({...prev, cross: !toggler.cross}))
    }

    const toggleCheckBtn = (e, id) =>
    {
        e.preventDefault();

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

            if(confirm("Are you sure to unarchived this todo?"))
            {
                setTodoData([...copyTodoData, {...removedTodoFromArchive[0], pending:true}])
                setArchive(archiveData);
                toast.info("Todo unarchived.")
            }

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
                    onClick={(e) => toggleCheckBtn(e, todo.id)}
                    />
                ) : (
                    <CheckCircleOutlineIcon
                    style={{ color: "green", fontSize: "1.2rem", cursor: "pointer" }}
                    onClick={(e) => toggleCheckBtn(e, todo.id)}
                    />
                )}
                <div className="flex justify-between p-4 w-[100%]">
                    <div className='flex justify-between w-[90%]'>
                        <p
                        className={`w-[100%] break-all outline-0 ${
                            !todo.pending ? "line-through text-slate-400" : priorityColor[todo.priority][0]
                        }`}
                        contentEditable={toggler.edit}
                        onDoubleClick={togglerEdit}
                        onBlur={togglerEdit}
                        >
                        {todo.todoName}
                        </p>

                        <button className={`border w-[110px] text-[12px] rounded-xl mx-2 text-white self-start ${priorityColor[todo.priority][1]}`}> {todo.priority}</button>

                        <button className={`border w-[110px] text-[12px] rounded-xl self-start ${todo.pending ? 'bg-red-400 text-white ' : 'bg-green-500 text-white' }`}>{todo.pending ? 'Pending' : 'Completed'}</button>

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
