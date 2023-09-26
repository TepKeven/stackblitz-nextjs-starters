import { NextRequest, NextResponse } from "next/server";
import axios from 'axios';
import getFields from "@/helpers/decode";


export async function GET(req: NextRequest){

  var todos: any = []

  try {

    const result = await axios.get('https://firestore.googleapis.com/v1/projects/vtech-interview/databases/(default)/documents/todos')
    
    if('documents' in result.data){
      result.data.documents.forEach((todo: any) => {
        todos.push({
          id: todo['name'].split('/').pop(),
          ...getFields(todo)
        })
      }) 
    }

    return new Response(JSON.stringify(todos), {status: 200})
  } catch (e) {
    return new Response(JSON.stringify(e), {status: 501})
  }
}


export async function POST(req: NextRequest) {

  const {todo, isCompleted, createdAt} = await req.json()

  try{

    const result = await axios.post('https://firestore.googleapis.com/v1/projects/vtech-interview/databases/(default)/documents/todos', {
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
  
    const new_todo = {
      id: result.data['name'].split('/').pop(),
      ...getFields(result.data)
    }
  
    return new Response(JSON.stringify('Success'), {status: 200})
  }
  catch(e){
    return new Response(JSON.stringify(e), {status: 501})
  }

}