import express from 'express'
const app = express()
import bodyParser from 'body-parser'
import cors from 'cors'

// Bcrypt config
import bcrypt from 'bcrypt'
import { db, findUser, insertUser, updateUser, getRank } from './connection.js'

const saltRounds = 10;
const myPlaintextPassword = 's0/\/\P4$$w0rD';
const someOtherPlaintextPassword = 'not_bacon';

db.once('open', async function() {
    console.log('Connected to database')
});


// Middleware
app.use(bodyParser.json())
app.use(cors())

// Routes
app.post('/register', async (req, res) => {
    const { email, password, name} = req.body

    const hash = await bcrypt.hash(password, saltRounds)

    const user = {
        name     : name,
        email    : email,
        password : hash,
        entries  : 0,
        joined   : new Date()
    } 

    const existingUser = await findUser({email : email})
    if(existingUser) {
        res.json(false)
        return
    }

    await insertUser(user).then((user) => {
        res.json(user)
    }).catch(console.log)
    
})

app.put('/image', async (req, res) => {
    const { email } = req.body
    await updateUser({ email : email}, {$inc: {'entries': 1}})
    const user = await findUser({email : email})
    res.json( user ? user : null )
})

app.get('/getRank/:number' , async(req, res) => {
    const { number } = req.params
    const rank = await getRank(number)
    res.json(rank > 0 ? rank : null)
})

app.post('/signin', async (req, res) => {
    const { email: sendedEmail, password : sendedPassword} = req.body
    const user = await findUser({email : sendedEmail})
    if(!user) 
        res.json(null)
    else {
        //const rank = await getRank(user.entries)
        // We use spread operator to add the rank attribute to the rest of the Mongo Object
        //const sendedUser = {rank : rank, ...user['_doc']}
        res.json(user)
    }
})

app.listen(3000, () => {
    console.log('App is running on port 3000')
})
