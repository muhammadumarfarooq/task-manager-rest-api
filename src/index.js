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

app.get('/users', async (req, res) => {
    try {
        const users = await User.find({});
        res.send(users);
    } catch (e) {
        console.log(e);
        res.status(400).send(e);
    }
});

app.patch('/users/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true});

        if (!user) {
            return res.status(404).send("Not found");
        }

        res.send(user);

    } catch (e) {
        res.status(400).send(e);
    }
})

app.delete('/users/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);

        if (!user) {
            return res.status(404).send();
        }

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

app.get('/tasks', async (req, res) => {
    try {
        const users = await Task.find({});
        res.send(users);
    } catch (e) {
        res.status(400).send(e);
    }
});

app.patch('/tasks/:id', async (req, res) => {
    try {
        const task = await Task.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true});

        if (!task) {
            return res.status(404).send('Not found!');
        }

        res.send(task);

    } catch (e) {
        res.status(400).send(e);
    }
})

app.delete('/tasks/:id', async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);

        if (!task) {
            return res.status(404).send();
        }

        res.send(task);

    } catch (e) {
        res.status(400).send(e);
    }
});


app.listen(port, () => {
    console.log('App is connected to port', port);
});