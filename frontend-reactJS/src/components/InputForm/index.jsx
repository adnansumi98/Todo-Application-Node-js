import { useState, useEffect } from 'react'
import "./index.css"

const InputForm = ({addTodo, updateTodo, selectedTodo}) => {
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('');
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState('');
  const [buttonText, setButtonText] = useState('Add Task');

  const resetForm = () => {
    setTitle('');
    setDueDate('');
    setPriority('');
    setCategory('');
    setStatus('');
  }

  useEffect(() => {
    if (selectedTodo) {
      setTitle(selectedTodo.todo);
      setDueDate(selectedTodo.dueDate);
      setPriority(selectedTodo.priority);
      setCategory(selectedTodo.category);
      setStatus(selectedTodo.status);
      setButtonText('Update Task')
    } else{
      resetForm()
      setButtonText('Add Task')
    }
  }, [selectedTodo]);

  const handleSumit = (e) => {
    e.preventDefault();
    const todoData={
      todo: title,
      dueDate,
      priority,
      category,
      status,
      id: selectedTodo?.id || ""
    }

    if (selectedTodo) {
      updateTodo(todoData);
    } else {
      // console.log(todoData)
      addTodo(todoData);
    }

    resetForm();
  }
  return (
  <form className='input-form' onSubmit={handleSumit}>
    <input
        className="todo-input-title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Add a new todo"
      />
    <input
        type='date'
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        placeholder="due Date"
      />
    <select
        value={priority}
        onChange={(e) => setPriority(e.target.value)}
     >
        <option value="" hidden>Select priority</option>
        <option value="LOW">Low</option>
        <option value="MEDIUM">Medium</option>
        <option value="HIGH">High</option>
     </select>
      <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="" hidden>Select category</option>
          <option value="WORK">Work</option>
          <option value="HOME">Home</option>
          <option value="LEARNING">Learning</option>
      </select>
    <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
      >
        <option value="" hidden>Select status</option>
        <option value="TO DO">To Do</option>
        <option value="IN PROGRESS">In Progress</option>
        <option value="DONE">Done</option>
     </select>
    <button type='submit'>{buttonText}</button>
  </form>
  )
}

export default InputForm
