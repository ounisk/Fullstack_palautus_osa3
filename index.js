const express = require('express')
const morgan =require('morgan')
const app = express()

app.use(express.json())
app.use(morgan('tiny'))

let persons =[
    { 
        id:1,
        name: 'Arto Hellas',
        number: '040-123456'
    },
    { 
        id:2,
        name: 'Ada Lovelace',
        number: '39-44-5323523' 
    },
    { 
        id:3,
        name: 'Dan Abramov',
        number: '12-43-234345'
    },
    {
        id:4,
        name: 'Mary Poppendieck', 
        number: '39-23-6423122' }
]

app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
  })
  
  app.get('/api/persons', (request, response) => {
    response.json(persons)
  })

  app.get('/info', (request, response) => {
    const date = (new Date()).toString()
    console.log(date)
    response.send(
        `<p> Phonebook has info for ${persons.length} persons </p>
        <p>${date}</p>`)
  })


  app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    //const person = persons.find(person => {
    //  console.log(person.id, typeof person.id, id, typeof id, person.id === id)
    //  return person.id === id
    //})
    //console.log(person)
    //response.json(person)

    const person = persons.find(person => person.id === id)
  
    if (person) {
        response.json(person)  
    } else {
        response.status(404).end() 
    }
  })
  
  app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
  
    response.status(204).end()
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
  
  app.post('/api/persons', (request, response) => {
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

    if (persons.find(person => person.name === body.name)){
      return response.status(400).json({ 
        error: 'name must be unique' 
      })
    }
    

    const person = {
      name: body.name,
      number: body.number,
      id: generateId(),
    }
  
    persons = persons.concat(person)
  
    response.json(person)
  })



  const PORT = 3001
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })