import axios from 'axios';
import getFields from "@/helpers/decode";
import { NextApiRequest } from "next";
import { NextRequest } from 'next/server';

export async function PUT(req: NextRequest, {params}: any){

  const todo_id = params.id;

  const {todo, isCompleted, createdAt} = await req.json();

  try {

    const result = await axios.patch('https://firestore.googleapis.com/v1/projects/vtech-interview/databases/(default)/documents/todos/' + todo_id, {
      fields: {
        todo: {
          stringValue: todo
        }, 
        isCompleted: {
          booleanValue: isCompleted
        },
        createdAt: {
          timestampValue: createdAt
        }
      }
    })

    const edited_todo = {
      id: result.data['name'].split('/').pop(),
      ...getFields(result.data)
    }
  
    return new Response(JSON.stringify('Success'), {status: 200})

  } catch (e) {
    return new Response(JSON.stringify(e), {status: 501})
  }
}

export async function DELETE(req: NextRequest, {params}: any){

  const todo_id = params.id;

  try {

    const result = await axios.delete('https://firestore.googleapis.com/v1/projects/vtech-interview/databases/(default)/documents/todos/' + todo_id)

    const message = Object.keys(result.data).length <= 0 ? 'Success' : 'Failed'
  
    return new Response(JSON.stringify(message), {status: 200})

  } catch (e) {
    return new Response(JSON.stringify(e), {status: 501})
  }
}