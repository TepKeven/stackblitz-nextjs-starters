'use client';

import React, { useEffect, useState } from 'react';
import $ from 'jquery';
import axios from 'axios';
import generateID from '@/helpers/random';

export default function Home() {

  const [allTodos, setAllTodos] = useState<any[]>([]);
  const [todos, setTodos] = useState<any[]>([]);
  const [todoName, setTodoName] = useState<string>('');
  const [todoID, setTodoID] = useState<string>('');
  const [previousItem, setPreviousItem] = useState<HTMLLIElement | null>(null);
  const [baseAPI, setBaseAPI] = useState('/api');

  useEffect(() => {
    getTodos();
  }, [baseAPI]);

  // Get todo items
  const getTodos = async () => {

    $("#main").addClass("disabled-main")

    const result = await axios.get(`${baseAPI}/todo`);
    setTodos(result.data);
    setAllTodos(result.data)

    $("#main").removeClass("disabled-main")
  };

  // Create a new todo item
  const postTodo = async () => {

    $("#main").addClass("disabled-main")

    const result = await axios.post(`${baseAPI}/todo`, {
      id: generateID(20),
      todo: todoName,
      isCompleted: false,
      createdAt: new Date(),
    });

    $("#main").removeClass("disabled-main")

    alert(result.data);
    getTodos();
  };

  // prepare todo item for an edit
  const getEditTodo = (todo_id: string) => {
    
    var todo = allTodos.find((todo) => todo.id == todo_id);

    setTodoID(todo_id);
    setTodoName(todo.todo);
  };

  // update or edit todo item
  const setEditTodo = async () => {

    $("#main").addClass("disabled-main")

    var todo = allTodos.find((todo) => todo.id == todoID);

    const result = await axios.put(`${baseAPI}/todo/${todoID}`, {
      id: todoID,
      todo: todoName,
      isCompleted: todo.isCompleted,
      createdAt: todo.createdAt,
    });

    $("#main").removeClass("disabled-main")

    alert(result.data);
    setTodoID('');
    getTodos();
  };

  // update or edit todo status - isCompleted
  const editTodoStatus = async (todo_id: string) => {

    $("#main").addClass("disabled-main")

    var todo = allTodos.find((todo) => todo.id == todo_id);

    const result = await axios.put(`${baseAPI}/todo/${todo_id}`, {
      id: todo_id,
      todo: todo.todo,
      isCompleted: !todo.isCompleted,
      createdAt: todo.createdAt,
    });

    $("#main").removeClass("disabled-main")

    alert(result.data);
    getTodos();
  };

  // delete todo item
  const deleteTodo = async (todo_id: string) => {

    $("#main").addClass("disabled-main")
    
    const result = await axios.delete(`${baseAPI}/todo/${todo_id}`);

    $("#main").removeClass("disabled-main")

    alert(result.data);
    getTodos();
  };

  // check if todo already exists
  const isDuplicateItem = () => {
    
    const todo = allTodos.find(
      (todo: any) =>
        todo.todo.trim().toUpperCase() === todoName.trim().toUpperCase()
    );

    return todo !== undefined;
  };

  // filter todo items by input value
  const filterTodos = async (input_value: string) => {
    
    const filter_todos = allTodos.filter((todo: any) => {
      return todo.todo
        .trim()
        .toUpperCase()
        .startsWith(input_value.trim().toUpperCase());
    });

    setTodos(filter_todos);
  };

  // switch between local json file and firestore cloud database
  const switchDB = () => {
    setBaseAPI(baseAPI === '/api' ? '/api/firebase' : '/api');

    setTodoID('');
    setTodoName('');
    setPreviousItem(null);
  };

  // detect keypress on 'enter' key
  const onKeyPress = (event: React.KeyboardEvent) => {

    const inputElement = event.target as HTMLInputElement;
    const inputValue = inputElement.value;

    // When the 'Enter' Key is Pressed
    if (event.key === 'Enter') {
      if (inputValue.length > 0) {
        if (!isDuplicateItem()) {
          
          // If Todo ID exists for an edit then edit it else create new todo
          if (todoID.length > 0) {
            setEditTodo();
          } else {
            postTodo();
          }

          setTodoName('');
        } else {
          alert('Item already exists');
        }
      } else {
        alert('The item is empty');
      }
    }
  };

  // detect changes on todo input
  const onTodoInputChange = (event: React.FormEvent) => {
    
    const inputElement = event.target as HTMLInputElement;
    const inputValue = inputElement.value;

    setTodoName(inputValue);

    // Filter item only when there is no edit or edit mode is off
    if (todoID.length <= 0) {
      filterTodos(inputValue);
    }
  };

  // display action button - edit delete & completion status
  const showActionButton = (event: React.MouseEvent) => {
    
    const itemElement = event.target as HTMLLIElement;

    $(itemElement).next().removeClass('d-none');

    if (previousItem != null && previousItem != itemElement) {
      $(previousItem).next().addClass('d-none');
    }

    setPreviousItem(itemElement);
  };

  return (
    <main className="p-24" id="main">
      <div className="my-5">
        <label>
          The Website is Currently Synchronizing with 
          <strong>{baseAPI === '/api'
            ? ' Local JSON File'
            : ' Firestore Cloud Database'}
          </strong>
        </label>
        <br/>
        <label className="mt-4">
          Editor Mode is <strong>{todoID.length > 0 ? 'On' : 'Off'}</strong>
        </label>
        <br />
        <label className="my-4">Add, Edit & Filter Todo</label>
        <input
          className="todo-input border"
          type="text"
          onKeyUp={(e) => onKeyPress(e)}
          onChange={(e) => onTodoInputChange(e)}
          value={todoName}
        />
      </div>

      <ul className="todo-list mt-5">
        {todos.length > 0 ? (
          todos.map((todo) => (
            <div
              key={todo.id}
              className="d-flex align-items-center todo-item-group"
            >
              <li
                className={`todo-item ${
                  todo.isCompleted ? 'text-decoration-line-through' : ''
                }`}
                onMouseOver={(e) => showActionButton(e)}
              >
                {todo.todo}
              </li>
              <div className="button-group mx-3 d-none" id="button-group">
                <button
                  className="btn btn-warning"
                  onClick={() => getEditTodo(todo.id)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-danger mx-3"
                  disabled={todo.id == todoID ? true : false}
                  onClick={() => deleteTodo(todo.id)}
                >
                  Remove
                </button>
                <button
                  className="btn btn-success"
                  onClick={() => editTodoStatus(todo.id)}
                >
                  {todo.isCompleted ? 'Mark as Incomplete' : 'Mark as Complete'}
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="d-flex align-items-center justify-content-center">
            <h3>No result. Create a new one instead!</h3>
          </div>
        )}
      </ul>
      <div className="d-flex justify-content-start mt-5">
        <button
          className={`btn ${
            baseAPI === '/api' ? 'btn-warning' : 'btn-success'
          }`}
          onClick={switchDB}
        >
          {baseAPI === '/api'
            ? 'Synchronize with Firebase Firestore'
            : 'Synchronize with Local JSON File'}
        </button>
      </div>
    </main>
  );
}
