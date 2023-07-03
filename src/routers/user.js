const express = require('express');
const User = require("../models/user");
const auth = require("../middleware/auth");

const router = express.Router();

router.post('/user', async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        const token = await user.generateAuthToken();
        res.status(201).send({user, token: `${token}`});
    } catch (e) {
        console.log(e);
        res.status(400).send(e);
    }
});

router.get('/users', auth, async (req, res) => {
    try {
        const users = await User.find({});
        res.send(users);
    } catch (e) {
        res.status(400).send(e);
    }
});

router.get('/users/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).send(user);
        }

        res.send(user);

    } catch (e) {
        res.status(400).send(e);
    }
});

router.patch('/users/:id', async (req, res) => {
    try {
        // const user = await User.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true});
        const updates = Object.keys(req.body);
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).send("Not found");
        }

        updates.forEach((updateKey) => user[updateKey] = req.body[updateKey]);
        await user.save();

        res.send(user);

    } catch (e) {
        res.status(400).send(e);
    }
})

router.delete('/users/:id', async (req, res) => {
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

router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token = await user.generateAuthToken();
        res.send({user: user.getPublicProfile(), token});
    } catch (e) {
        res.status(400).send(e);
    }
});

router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = [];
        await req.user.save();
        res.send("you are logged out from all devices");
    } catch (e) {
        res.status(400).send(e);
    }
});

router.post('/user/logu');

module.exports = router;