const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://fullstack:${password}@cluster0.5lrs0ck.mongodb.net/noteApp?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url)


//const noteSchema = new mongoose.Schema({
//  content: String,
//  important: Boolean,
//})

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

//const Note = mongoose.model('Note', noteSchema)
const Person = mongoose.model('Person', personSchema)

//const note = new Note({
//  content: 'HTML is easy',
//  important: true,
//})

if (process.argv.length ===5) {
  const person = new Person({
    name: String(process.argv[3]),
    number: String(process.argv[4]),
  })

  person.save().then(result => {
    console.log(`added ${result.name} number ${result.number} to the phonebook`)
    mongoose.connection.close()
  })
}

if (process.argv.length === 3) {
  console.log('phonebook')
  Person.find({}).then(persons => {
    persons.forEach(person => {
      console.log(`${person.name} ${person.number}`)
    })
    mongoose.connection.close()
  })
}


//note.save().then(result => {
//  console.log('note saved!')
//  mongoose.connection.close()
//})