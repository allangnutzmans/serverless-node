"use strict";
import { MongoClient, ObjectId } from 'mongodb';

function extractBody(event) {
  if (!event?.body) {
    return {
      statusCode: 422,
      body: JSON.stringify({ error: 'Missing request body' })
    }
  }

  try {
    const parsed = JSON.parse(event.body)
    if (typeof parsed !== 'object' || parsed === null) {
      return {
        statusCode: 422,
        body: JSON.stringify({ error: 'Request body must be a valid JSON object' })
      }
    }
    return parsed
  } catch (error) {
    return {
      statusCode: 422,
      body: JSON.stringify({ error: 'Invalid JSON in request body' })
    }
  }
}

async function connectToDatabase() {
  const client = new MongoClient(process.env.MONGODB_CONNECTION_STRING);
  const connection = await client.connect();
  return connection.db(process.env.MONGODB_DB_NAME);
}


export const sendResponse = async (event) => {
  const bodyResult = extractBody(event);

  // If extractBody returned an error response, return it
  if (bodyResult.statusCode) {
    return bodyResult;
  }

  const { name, answers } = bodyResult;
  const correctQuestions = [3, 1, 0, 2];
  const totalCorrectAnswers = answers.reduce((acc, answer, index) => {
    if (answer === correctQuestions[index]) {
      acc++
    }
    return acc
  }, 0)

  const result = {
    name,
    answers,
    totalCorrectAnswers,
    totalAnswers: answers.length
  }
  const db = await connectToDatabase();
  const collection = db.collection('results');
  const { insertedId } = await collection.insertOne(result);

  //console.log(previousResults)
  return {
    statusCode: 201,
    body: JSON.stringify({
      resultId: insertedId,
      __hypermedia: {
        href: `/results.html`,
        query: { id: insertedId }
      }
    }),
    headers: {
      'Content-Type': 'application/json'
    }
  }
}

export const getResult = async (event) => {
  const db = await connectToDatabase();
  const collection = db.collection('results');
  
  const result = await collection.findOne({
    _id: new ObjectId(event.pathParameters.id)
  }) ;
  if (!result) {
    return {
      statusCode:404,
      body: JSON.stringify({ error: 'Result not found' }),
      headers: {
        'Content-Type': 'application/json'
      }
    }
  }
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(result)
  }
}