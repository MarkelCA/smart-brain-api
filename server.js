import express from 'express'
const app = express()
import bodyParser from 'body-parser'
import cors from 'cors'

import Clarifai from 'clarifai';

const clarifaiApp = new Clarifai.App({
    apiKey: "49a9260111a945d48126bac0a1d2cd3c",
});
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

const sanitizeAll = (obj) => {
    return Object.keys(obj).map((x) => escape(obj[x]))
}
// Routes
app.post('/register', async (req, res) => {
    const body = sanitizeAll(req.body)
    const [ email, password, name ] = body

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
    const body = sanitizeAll(req.body)
    const [ email, input ] = body
    await updateUser({ email : email}, {$inc: {'entries': 1}})

    clarifaiApp.models
      .predict(Clarifai.FACE_DETECT_MODEL, unescape(input))
        .then(calculateRegions)
        .then(async (regions) => {
            const user = await findUser({email : email})
            res.json({regions, user :  user ? user : null })
        })
        .catch((e) => {
            res.json(null)
        })

})

app.get('/getRank/:number' , async(req, res) => {
    const params = sanitizeAll(req.params)
    const [ number ] = params
    const rank = await getRank(number)
    res.json(rank > 0 ? rank : null)
})

app.post('/signin', async (req, res) => {
    const body = sanitizeAll(req.body)
    const [ email, password ] = body
    const user = await findUser({email : email})
    if(!user) {
        res.json(null)
        return
    }
    bcrypt.compare(password, user.password, function(err, result) {
        res.json ( result ? user : null)
    });
})


const calculateRegions = ({outputs: out}) => {
    const regions = out[0].data.regions
    return regions
}

app.listen(3000, () => {
    console.log('App is running on port 3000')
})
