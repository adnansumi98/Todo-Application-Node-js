import "./index.css"

const Todo = ({todoObject, deleteTodo, editTodo}) => {
  return (
    <ul className="todo-container">
      {
      todoObject.map((todo) => (
        <li key={todo.id} className="todo-item">
          <h1 className="todo-heading">{todo.todo}</h1>
          <p className="todo-due-date">due date: <br/> {todo.dueDate}</p>
          <p className="todo-status">status: <br/>{todo.status}</p>
          <p className="todo-category">category: <br/>{todo.category}</p>
          <p className="todo-priority">priority: <br/>{todo.priority}</p>
            <button className="todo-button todo-edit-button" onClick={() => editTodo(todo.id)}>✏️</button>
            <button className="todo-button todo-delete-button" onClick={() => deleteTodo(todo.id)}>🗑️</button>
       </li>
      )
    )
    }
    </ul>
  );
};

export default Todo;
