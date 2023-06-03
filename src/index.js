const express = require('express');
require('./db/mongoose');

const User = require('./models/user');
const Task = require('./models/task');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.post('/user', async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        res.send(user);
    } catch (e) {
        console.log(e);
        res.status(400).send(e);
    }
});

app.post('/task', async (req, res) => {
    try {
        const task = new Task(req.body);
        await task.save();
        res.send(task);
    } catch (e) {
        res.status(400).send(e);
    }
});

app.listen(port, () => {
    console.log('App is connected to port', port);
});