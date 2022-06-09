import mongoose from 'mongoose';

const User = mongoose.model('usuarios', {
    username: String,
    password: String
});

export default User;