import express from 'express'
const app = express()
import bodyParser from 'body-parser'
import cors from 'cors'

// Bcrypt config
import bcrypt from 'bcrypt'

const saltRounds = 10;
const myPlaintextPassword = 's0/\/\P4$$w0rD';
const someOtherPlaintextPassword = 'not_bacon';

/// MongoDB Connection
import mongoose from 'mongoose';
import dotenv from 'dotenv'
import User from './schemas/User.js'
//const User = require('./schemas/User') 
dotenv.config()

const { USER, PASSWORD, DB_NAME, DB_HOST } = process.env
const url = `mongodb+srv://${USER}:${PASSWORD}@${DB_HOST}/${DB_NAME}?retryWrites=true&w=majority`

mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

const printErrors = (err) => {
    let strMessage = "Error:\n"

    for(const errMessage in err.errors)
        strMessage += " - " + err.errors[errMessage].message + "\n"
    console.log(strMessage)
}

db.once('open', async function() {
    console.log('connected to db')

    const user = await User.find({ name : "Markel" }).exec()
    const newuser = new User({
            name : "Markel",
            password : "1234",
            email    : "markel4@gmail.com",
            entries: 0
        })

    newuser.save((err, doc) => {
        if(err)
            printErrors(err)
        else
            console.log(doc)

    })
});
// MongoDB connection end
//

// Middleware
app.use(bodyParser.json())
app.use(cors())

// Routes
const database = {
    users : [
        {
            id       : 123,
            email    : "john@email.com",
            name     : 'John',
            password : '$2b$10$8wX8Kjg2TdTVlTYODCG9Ou6uxQsI2sO6ZRakqKwMwR/DgIpwVVvC6',
            entries  : 0,
            joined   : new Date()
        },
        {
            id       : 124,
            name     : 'Sally',
            email    : "sally@email.com",
            password : 'bananas',
            entries  : 3,
            joined   : new Date()
        },
        
    ]
}

app.get('/profile/:id', (req, res) => {
    const { id } = req.params
    const user = database.users.filter(user => user.id == id)[0]
    res.json(user ?? "nothing")

})

app.get('/', (req, res) => {
    res.json(database.users)
})

app.post('/register', async (req, res) => {
    const { email, password, name} = req.body

    console.log(password)

    //const hash = await bcrypt.hash(password, saltRounds)

    database.users.push({
            id       : 125,
            name     : name,
            email    : email,
            password : password,
            entries  : 0,
            joined   : new Date()
        })
    res.json('created new user')
    
})

app.put('/image', (req, res) => {
    const { id } = req.body
    const user = database.users.filter(user => user.id == id)[0]
    console.log(user)
    if(user) {
        console.log(user)
        user.entries++
        res.json(user)
    }
    else 
        res.json(null)

})

app.post('/signin', (req, res) => {
    const { email: sendedEmail, password : sendedPassword} = req.body
    const user = database.users.find(user => user.email == sendedEmail)

    if(!user) 
        res.json(null)
    else
        res.json(user)
})

app.listen(3000, () => {
    console.log('App is running on port 3000')
})
