import React, { useContext, useState } from 'react'
import { TodoContext } from './TodoApp';
import ClearIcon from '@mui/icons-material/Clear';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import { ThemeContext } from './TodoApp';

const TodoItem = ({todo}) => {

    const [toggler, setToggler] = useState({
        checkbox:false,
        cross:false,
        edit:false
    });

    const {todoData, setTodoData} = useContext(TodoContext);

    const {theme} = useContext(ThemeContext);

    const handleDeleteTodo = (id) =>
    {
        let copyTodoData = [...todoData];
        copyTodoData = copyTodoData.filter(todo=>todo.id!==id)
        setTodoData(copyTodoData)
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

        setTodoData(copyTodoData)
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
                    <p
                    className={`w-[100%] outline-0 ${
                        !todo.pending ? "line-through" : ""
                    } ${theme.context.color} `}
                    contentEditable={toggler.edit}
                    onDoubleClick={togglerEdit}
                    onBlur={togglerEdit}
                    >
                    {todo.todoName}
                    </p>
                    {toggler.cross && (
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
