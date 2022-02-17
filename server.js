const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')

// Bcrypt config
const bcrypt = require('bcrypt');

const saltRounds = 10;
const myPlaintextPassword = 's0/\/\P4$$w0rD';
const someOtherPlaintextPassword = 'not_bacon';

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

    const hash = await bcrypt.hash(password, saltRounds)

    database.users.push({
            id       : 125,
            name     : name,
            email    : email,
            password : hash,
            entries  : 0,
            joined   : new Date()
        })
    res.json('created new user')
    
})

app.put('/image', (req, res) => {
    const { id } = req.body
    const user = database.users.filter(user => user.id == id)[0]
    console.log('image')
    if(user) {
        user.entries++
        res.json(user)
    }
    else 
        res.json(null)

})

app.post('/signin', (req, res) => {
    const { email: sendedEmail, password : sendedPassword} = req.body
    const user = database.users.find(user => user.email == sendedEmail)

    if(!user) {
        res.json(false)
        return
    }

    bcrypt.compare(sendedPassword, user.password, (err,result) => {
        const ret = result ? user : false
        res.json(ret)
    })

})

app.listen(3000, () => {
    console.log('App is running on port 3000')
})
