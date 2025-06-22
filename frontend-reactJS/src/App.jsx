// src/App.js
import { useState, useEffect } from 'react';
import Todo from './components/Todo';
import InputForm from './components/InputForm';
import './App.css';

function App() {
  const [todos, setTodos] = useState([]);
  const [selectedTodo, setSelectedTodo] = useState(null);

  const fetchTodos = async () => {
    const response = await fetch('http://localhost:3000/todos');
    const data = await response.json();
    setTodos(data);
  };

  const addTodo = async (todo) => {
    await fetch('http://localhost:3000/todos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(todo),
    });
    fetchTodos(); // refresh the list
  };

  const updateTodo = async (todo) => {
    await fetch(`http://localhost:3000/todos/${todo.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(todo),
    });
    setSelectedTodo(null);
    fetchTodos();
  };

  const deleteTodo = async (id) => {
    await fetch(`http://localhost:3000/todos/${id}`, {
      method: 'DELETE',
    });
    fetchTodos(); // refresh the list
  };

  const editTodo = (id) => {
    const found = todos.find((t) => t.id === id);
    if (found) setSelectedTodo(found);
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <div className="App">
      <h1>Todo List</h1>
      <InputForm addTodo={addTodo} updateTodo={updateTodo} selectedTodo={selectedTodo}/>
     <Todo todoObject={todos} deleteTodo={deleteTodo} editTodo={editTodo} />
    </div>
  );
}

export default App;
