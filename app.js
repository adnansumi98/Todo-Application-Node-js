const express = require('express')
const path = require('path')
const {open} = require('sqlite')
const sqlite3 = require('sqlite3')
const {format, isValid} = require('date-fns')
const cors = require("cors")

const dbPath = path.join(__dirname, 'todoApplication.db')

let db = null

const app = express()
app.use(express.json())
app.use(cors())

const initializeDbandServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    })
    app.listen(3000, () => {
      console.log('server is running at http://localhost:3000')
    })
  } catch (error) {
    console.log(`${error.message}`)
    process.exit(1)
  }
}

initializeDbandServer()

const isValidDate = date => {
  const checkdate = new Date(date)
  return isValid(checkdate)
}

const isvalidStatus = status => {
  const validStatuses = ['TO DO', 'IN PROGRESS', 'DONE']
  return validStatuses.includes(status)
}

const isvalidPriority = priority => {
  const validPriority = ['HIGH', 'MEDIUM', 'LOW']
  return validPriority.includes(priority)
}

const isvalidCategory = category => {
  const validCategory = ['WORK', 'HOME', 'LEARNING']
  return validCategory.includes(category)
}

app.get('/todos/', async (request, response) => {
  const {status, priority, search_q = '', category} = request.query
  let getTodos = `
  select id,todo, priority, status, category, due_date as dueDate from todo
  where todo like "%${search_q}%"
  `
  let responseMessage
  let statusCode = 200

  if (status !== undefined) {
    if (isvalidStatus(status)) {
      getTodos += ` and status = "${status}"`
    } else {
      statusCode = 400
      responseMessage = 'Invalid Todo Status'
    }
  }
  if (priority !== undefined) {
    if (isvalidPriority(priority)) {
      getTodos += ` and priority = "${priority}"`
    } else {
      statusCode = 400
      responseMessage = 'Invalid Todo Priority'
    }
  }
  if (category !== undefined) {
    if (isvalidCategory(category)) {
      getTodos += ` and category = "${category}"`
    } else {
      statusCode = 400
      responseMessage = 'Invalid Todo Category'
    }
  }

  const getTodosList = await db.all(getTodos)
  response.status(statusCode)
  if (responseMessage === undefined) {
    response.send(getTodosList)
  } else {
    response.send(responseMessage)
  }
})

app.get('/todos/:todoId/', async (request, response) => {
  const {todoId} = request.params
  const getTodoId = await db.get(`
  select id,todo, priority, status, category, due_date as dueDate from todo
  where id = ${todoId}`)

  response.send(getTodoId)
})

app.get('/agenda/', async (request, response) => {
  const {date} = request.query
  if (isValid(new Date(date))) {
    const query = `
  select id,todo, priority, status, category, due_date as dueDate from todo
  where due_date = "${format(new Date(date), 'yyyy-MM-dd')}"`
    console.log(query)
    const getAgenda = await db.all(query)
    response.send(getAgenda)
  } else {
    response.status(400)
    response.send('Invalid Due Date')
  }
})

app.post('/todos/', async (request, response) => {
  const {id, todo, priority, status, category, dueDate} = request.body
  let statusCode = 200
  let responseMessage

  if (!isValidDate(new Date(dueDate))) {
    statusCode = 400
    responseMessage = 'Invalid Due Date'
  } else if (!isvalidCategory(category)) {
    statusCode = 400
    responseMessage = 'Invalid Todo Category'
  } else if (!isvalidPriority(priority)) {
    statusCode = 400
    responseMessage = 'Invalid Todo Priority'
  } else if (!isvalidStatus(status)) {
    statusCode = 400
    responseMessage = 'Invalid Todo Status'
  } else {
    const maxIdQuery = `SELECT MAX(id) as maxId FROM todo`
    const result = await db.get(maxIdQuery)
    const newId = (result?.maxId || 0) + 1
    await db.run(`
            insert into todo (id, todo, priority, status, category, due_date)
            values (${newId}, "${todo}", "${priority}" ,"${status}" , "${category}" ,"${format(
              new Date(dueDate),
              'yyyy-MM-dd',
            )}" )`)
    responseMessage = 'Todo Successfully Added'
  }
  response.status(statusCode)
  response.send(responseMessage)
})

app.put('/todos/:todoId/', async (request, response) => {
  const {todoId} = request.params
  const {status, priority, todo, category, dueDate} = request.body

  let updateTodo = `update todo Set `
  let valuesToUpdate = []
  let fieldsToUpdate = []
  let responseMessage
  let statusCode = 200

  if (status !== undefined) {
    if (isvalidStatus(status)) {
      fieldsToUpdate.push('status = ?')
      valuesToUpdate.push(status)
      responseMessage = 'Status Updated'
    } else {
      statusCode = 400
      responseMessage = 'Invalid Todo Status'
    }
  }
  if (priority !== undefined) {
    if (isvalidPriority(priority)) {
      fieldsToUpdate.push('priority = ?')
      valuesToUpdate.push(priority)
      responseMessage = 'Priority Updated'
    } else {
      statusCode = 400
      responseMessage = 'Invalid Todo Priority'
    }
  }
  if (category !== undefined) {
    if (isvalidCategory(category)) {
      fieldsToUpdate.push('category = ?')
      valuesToUpdate.push(category)
      responseMessage = 'Category Updated'
    } else {
      statusCode = 400
      responseMessage = 'Invalid Todo Category'
    }
  }
  if (dueDate !== undefined) {
    if (isValidDate(new Date(dueDate))) {
      fieldsToUpdate.push('due_date = ?')
      valuesToUpdate.push(dueDate)
      responseMessage = 'Due Date Updated'
    } else {
      statusCode = 400
      responseMessage = 'Invalid Due Date'
    }
  }
  if (todo !== undefined) {
    fieldsToUpdate.push('todo = ?')
    valuesToUpdate.push(todo)
    responseMessage = 'Todo Updated'
  }

  updateTodo += fieldsToUpdate.join(', ')
  updateTodo += ` WHERE id = ?`
  valuesToUpdate.push(todoId)

  try {
    await db.run(updateTodo, valuesToUpdate)
  } catch (error) {
    console.log(error.message)
  }

  response.status(statusCode)
  response.send(responseMessage)
})

app.delete('/todos/:todoId/', async (request, response) => {
  const {todoId} = request.params
  await db.run(` delete from todo where id = ${todoId}`)

  response.send('Todo Deleted')
})

module.exports = app
