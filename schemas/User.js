import mongoose from 'mongoose';
const { Schema } = mongoose;

//const UserController = new Controller().getUserController()


const UserSchema = new Schema({
    name : { type : String, required : true },
    password : { type : String, required : true, },
    entries  : { type: Number },
    email    : { 
        type : String, 
        required : true,
        validate: {
            validator: async function(email) {
                return !(await User.countDocuments({ email : email }))
            },
            message : "This email is already in use."
        }
    },

});


const User = mongoose.model('User', UserSchema)
export default User
