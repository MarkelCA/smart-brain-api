import mongoose from 'mongoose';
import dotenv from 'dotenv'
import User from './schemas/User.js'
dotenv.config()

const { FULL_DB_URL, DB_USER, PASSWORD, DB_NAME, DB_HOST } = process.env
const url = FULL_DB_URL ? FULL_DB_URL : `mongodb+srv://${DB_USER}:${PASSWORD}@${DB_HOST}/${DB_NAME}?retryWrites=true&w=majority`

mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true});

export const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

export const getErrors = (err) => {
    let strMessage = "Error:\n"

    for(const errMessage in err.errors)
        strMessage += " - " + err.errors[errMessage].message + "\n"

    return(strMessage)
}

export const findUser = async (condition) => {
     return await User.findOne(condition).exec()
}
export const insertUser = async(user) => {
    const newuser = new User(user)

    const insertedUser = await new Promise((resolve, reject) => {
        newuser.save((err, res) => {
            if(err) reject( getErrors(err) )
            else resolve(res)
        })
    }) 

    return insertedUser

}

export const updateUser = async(user, updateQuery) => {
    await new Promise((resolve, reject) => {
        const a =  User.updateOne(user, updateQuery )
        resolve(a)
    })
    
}
export const getRank = async(userEntries) => {
    const entries = await User.find({}, {entries:1}).sort({entries : -1})
    const entryNumbers = []
    for(const entry in entries)
        entryNumbers.push(entries[entry].entries)

    return entryNumbers.indexOf(parseInt(userEntries)) + 1
}
