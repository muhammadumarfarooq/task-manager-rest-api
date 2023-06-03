const mongoose = require('mongoose');

const connectionURL = 'mongodb+srv://admin:X2BvfK08z2ULpKY3@cluster0.eyp6y.mongodb.net/?retryWrites=true&w=majority';
mongoose.connect(connectionURL, {useNewUrlParser: true});