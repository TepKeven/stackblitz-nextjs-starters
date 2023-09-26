import { NextRequest, NextResponse } from "next/server";
import fs from 'fs/promises';
import path from 'path';
import generateID from "@/helpers/random";


const filePath = path.join(process.cwd(), 'todo.json');

export async function GET(req: NextRequest){

  const jsonTodos = await fs.readFile(filePath, { encoding: 'utf8' });
  var todos: any[] = []

  if(Array.isArray(JSON.parse(jsonTodos))){

    todos = JSON.parse(jsonTodos);
  }

  return new Response(JSON.stringify(todos), {status: 200});

}


export async function POST(req: NextRequest) {

  const {id, todo, isCompleted, createdAt} = await req.json();
  const jsonTodos = await fs.readFile(filePath, { encoding: 'utf8' });

  var todos: any[] = [];

  if(Array.isArray(JSON.parse(jsonTodos))){

    todos = JSON.parse(jsonTodos);
  }

  const todo_item = {
    id: id,
    todo: todo,
    isCompleted: isCompleted,
    createdAt: createdAt
  }

  todos.push(todo_item)

  await fs.writeFile(filePath, JSON.stringify(todos));
  
  return new Response(JSON.stringify('Success'), {status: 200})

}
