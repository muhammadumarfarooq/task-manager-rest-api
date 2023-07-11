const express = require('express');
const auth = require('../middleware/auth');
const Task = require("../models/task");
const router = express.Router();

router.post('/task', auth, async (req, res) => {
    try {
        const task = new Task({...req.body, owner: req.user._id});
        await task.save();
        res.send(task);
    } catch (e) {
        res.status(400).send(e);
    }
});

router.get('/tasks', async (req, res) => {
    try {
        const users = await Task.find({});
        res.send(users);
    } catch (e) {
        res.status(400).send(e);
    }
});

router.get('/tasks/:id', async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        await task.populate('owner');

        if (!task) {
            return res.status(404).send();
        }

        res.send(task);
    } catch (e) {
        res.status(400).send(e);
    }
});

router.patch('/tasks/:id', auth, async (req, res) => {
    try {
        const task = await Task.findOne({_id: req.params.id, owner: req.user.id});

        if (!task) {
            return res.status(404).send('Not found!');
        }

        const updates = Object.keys(req.body);
        updates.forEach(updateKey => task[updateKey] = req.body[updateKey]);
        await task.save();

        res.send(task);

    } catch (e) {
        res.status(400).send(e);
    }
})

router.delete('/tasks/:id', async (req, res) => {
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


module.exports = router;