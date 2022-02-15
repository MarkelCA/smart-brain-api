const express = require('express')
const app = express()
const bodyParser = require('body-parser')

app.use(bodyParser.json())
const database = {
    users : [
        {
            id       : 123,
            email    : "john@email.com",
            name     : 'John',
            password : 'cookies',
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

app.get('/', (req, res) => {
    res.json(database.users)
})

app.post('/register', (req, res) => {
    const { email, password, name} = req.body
    database.users.push({
            id       : 125,
            name     : name,
            email    : email,
            password : password,
            entries  : 3,
            joined   : new Date()
        })
    res.json('created new user')
    console.log(database.users)
    
})

app.post('/signin', (req, res) => {
    const { email, password } = database.users[0]
    const { email: sendedEmail, password : sendedPassword} = req.body
    let msg = (email == sendedEmail && password == sendedPassword) ? "success" : "failed" 
    res.json(msg)

})

app.listen(3000, () => {
    console.log('App is running on port 3000')
})
