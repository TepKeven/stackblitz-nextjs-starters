import axios from 'axios';
import getFields from "@/helpers/decode";
import { NextApiRequest } from "next";
import { NextRequest } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const filePath = path.join(process.cwd(), 'todo.json');

export async function PUT(req: NextRequest, {params}: any){

  const todo_id = params.id;
  const {todo, isCompleted, createdAt} = await req.json();

  const todo_item = {
    id: todo_id,
    todo: todo,
    isCompleted: isCompleted,
    createdAt: createdAt
  }

  const jsonTodos = await fs.readFile(filePath, { encoding: 'utf8' });
  var todos: any[] = [];

  if(Array.isArray(JSON.parse(jsonTodos))){

    todos = JSON.parse(jsonTodos);
  }

  // If ID is found then edit the item. If not then create a new item
  const updatedIndex: number = todos.findIndex(todo => todo.id == todo_id) == -1 ? todos.length : todos.findIndex(todo => todo.id == todo_id);

  todos[updatedIndex] = todo_item;

  await fs.writeFile(filePath, JSON.stringify(todos));

  return new Response(JSON.stringify('Success'), {status: 200})
  
}

export async function DELETE(req: NextRequest, {params}: any){

  const todo_id = params.id;

  const jsonTodos = await fs.readFile(filePath, { encoding: 'utf8' });
  var todos: any[] = [];

  if(Array.isArray(JSON.parse(jsonTodos))){

    todos = JSON.parse(jsonTodos);
  }

  const remainTodos = todos.filter(todo => {
    return todo.id != todo_id
  })

  await fs.writeFile(filePath, JSON.stringify(remainTodos));

  return new Response(JSON.stringify('Success'), {status: 200})
}