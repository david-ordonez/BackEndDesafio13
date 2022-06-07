const mongoose = require('mongoose');

module.exports = mongoose.model('usuarios', {
    username: String,
    password: String
});