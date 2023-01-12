import React, { useState } from "react";
import Form from "./components/Form";
import FilterButton from "./components/FilterButton";
import Todo from "./components/Todo";
import { nanoid } from "nanoid";

/* 
  The two functions below, FILTER_MAP and FILTER_NAMES, 
    are declared outside or else they would be recalculated every time 
    the App() component re-renders
*/ 
const FILTER_MAP = {
  All: () => true, // shows all tasks to be true
  Active: (task) => !task.completed, // shows tasks whose 'completed' prop is false
  Completed: (task) => task.completed // shows tasks whose 'completed' prop is true
};

const FILTER_NAMES = Object.keys(FILTER_MAP);

function App(props) {
  const [tasks, setTasks] = useState(props.tasks);
  const [filter, setFilter] = useState('All');


  function addTask(name) {
    const newTask = { id: `todo-${nanoid()}`, name, completed: false };
    setTasks([...tasks, newTask]);
  }
  /* 
    delete a todo from the apps state and visually
      create a new array to pass to setTasks holding what is left
  */
  function deleteTask(id) {
    const remainingTasks = tasks.filter((task) => id !== task.id);
    setTasks(remainingTasks);
  }

  /*
    takes an id to find target object
    has newName property for updating objects
      uses .map. to return a new array with some changes, 
      rather that deleting something from the array
  */
  function editTask(id, newName) {
    const editedTaskList = tasks.map((task) => {
      if (id === task.id) {
        return { ...task, name: newName };
      }
      return task;
    });
    setTasks(editedTaskList);
  }

  /* 
    if the task id has the same id as the edited task
      use an object spread to make a new object
      whose `completed` prop has been inverted
  */
  function toggleTaskCompleted(id) {
    const updatedTasks = tasks.map((task) => {
      if (id === task.id) {
        return { ...task, completed: !task.completed };
      }
      return task;
    });
    setTasks(updatedTasks);
  }

  const taskList = tasks
    .filter(FILTER_MAP[filter])
    .map((task) => (
    <Todo
      id={task.id}
      name={task.name}
      completed={task.completed}
      key={task.id}
      toggleTaskCompleted={toggleTaskCompleted}
      deleteTask={deleteTask}
      editTask={editTask}
    />
  ));
  const filterList = FILTER_NAMES.map((name) => (
    <FilterButton 
      key={name} 
      name={name}
      isPressed={name === filter}
      setFilter={setFilter}
      />
  ));
  const taskNoun = taskList.length !== 1 ? "tasks" : "task";
  const headingText = `${taskList.length} tasks remaining`;

  return (
    <div className="todoapp stack-large">
      <h1>Tanner's Todo List</h1>
      <Form addTask={addTask} />
      <div className="filters btn-group stack-exception">
        {filterList}
      </div>
      <h2 id="list-heading">{headingText}</h2>
      <ul
        role="list"
        className="todo-list stack-large stack-exception"
        aria-labelledby="list-heading"
      >
        {taskList}
      </ul>
    </div>
  );
}

export default App;
