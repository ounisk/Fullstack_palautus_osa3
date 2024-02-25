require('dotenv').config()
const express = require('express')
const morgan =require('morgan')
const cors = require('cors')
const app = express()
//const mongoose = require('mongoose')
const Person = require('./models/person')

app.use(cors())
app.use(express.json())
app.use(express.static('dist'))

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })  
  } else if (error.name === 'ValidationError') {
      return response.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(requestLogger)


morgan.token('body', function getData (request){ //(request, response) => {
   return JSON.stringify(request.body)
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body '))




app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
  })
  
  app.get('/api/persons', (request, response) => {    // tämä jo muutettu!
    //response.json(persons)
    Person.find({}).then(persons => {
      response.json(persons)
    })
  })

  app.get('/info', (request, response) => {
    const date = (new Date()).toString()
    console.log(date)

    Person.find({}).then(persons => {
      response.send(
        `<p> Phonebook has info for ${persons.length} persons </p>
        <p>${date}</p>`)
  })
  })

  app.get('/api/persons/:id', (request, response, next) => {
    //const id = Number(request.params.id)
    //const person = persons.find(person => person.id === id)
    //if (person) {
    //    response.json(person)  
    //} else {
    //    response.status(404).end() 
    //}
    Person.findById(request.params.id)
      .then(person => {
        if (person) {
          response.json(person)
        } else {
          response.status(404).end()
        }
      })
      .catch(error => next(error))
        //{console.log(error)
        //response.status(400).send({error:"malformatted id"})
      //  })
  })
  
  app.delete('/api/persons/:id', (request, response, next) => {
    //const id = Number(request.params.id)
    //persons = persons.filter(person => person.id !== id)
    Person.findByIdAndDelete(request.params.id)
      .then(result => {
        response.status(204).end()
      })
      .catch(error =>next(error))
  })


  const generateId = () => {
    //const maxId = persons.length > 0
    //? Math.max(...persons.map(p => p.id))
    //: 0
    //return maxId + 1
    const min = 9
    const max = 1000000

    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    const persId = Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled)
    console.log('persId', persId)
    return persId
  }
  
  app.post('/api/persons', (request, response, next) => {     // TEHTY 3.14, 3.19 next 
    const body = request.body
    console.log('nimi, numero, id', body.name, body.number)
    if (!body.name) {
      return response.status(400).json({ 
        error: 'name missing' 
      })
    }
    
    if (!body.number) {
      return response.status(400).json({ 
        error: 'number missing' 
      })
    }
    
    //if (persons.find(person => person.name === body.name)){
    //  return response.status(400).json({ 
    //    error: 'name must be unique' 
    //  })
    //}

    const person = new Person ({
      name: body.name,
      number: body.number,
      //id: generateId(),
    })
  
  
    //persons = persons.concat(person)
    //response.json(person)
    person.save().then(savedPerson => {
      response.json(savedPerson)
    })
    .catch((error) => next(error))
  })

  app.put('/api/persons/:id', (request, response, next) => {    // 3.17 & 3.19
    //const body = request.body
    const { name, number} = request.body
  
    //const person = { //kommentoitu pois 3.20 palautuksen yhteydessä
    //  name: body.name,
    //  number: body.number,
    //}
  
    //Person.findByIdAndUpdate(request.params.id, person, { new: true })
    Person.findByIdAndUpdate(request.params.id,
       {name, number}, { new: true, runValidators:true, context:"query"})

      .then(updatedPerson => {
        response.json(updatedPerson)
        console.log("tiedot on muutettu")
      })
      .catch(error => next(error))
  })

  const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }
  
  // olemattomien osoitteiden käsittely
  app.use(unknownEndpoint)


  
  // tämä tulee kaikkien muiden middlewarejen ja routejen rekisteröinnin jälkeen!
  app.use(errorHandler)



  const PORT = process.env.PORT
  //const PORT = process.env.PORT || 3001
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })