import mongoose from 'mongoose';
import dotenv from 'dotenv'
import User from './schemas/User.js'
dotenv.config()

const { USER, PASSWORD, DB_NAME, DB_HOST } = process.env
const url = `mongodb+srv://${USER}:${PASSWORD}@${DB_HOST}/${DB_NAME}?retryWrites=true&w=majority`

mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true});

export const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

export const printErrors = (err) => {
    let strMessage = "Error:\n"

    for(const errMessage in err.errors)
        strMessage += " - " + err.errors[errMessage].message + "\n"
    console.log(strMessage)
}

export const findUser = async (condition) => {
     return await User.find(condition).exec()
}
export const newUser = async(user) => {
    const newuser = new User(user)
    let ret = null
    await newuser.save((err, doc) => {
        if(err)
            printErrors(err)
        else {
            console.log('doc')
            console.log(doc)
            ret = doc
            console.log(ret)
        }

    })

    return ret
}

