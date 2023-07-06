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

router.patch('/users/me', auth, async (req, res) => {
    try {
        const updates = Object.keys(req.body);
        updates.forEach((updateKey) => req.user[updateKey] = req.body[updateKey]);
        await req.user.save();

        res.send(req.user);
    } catch (e) {
        res.status(400).send(e);
    }
})

router.delete('/users/me', auth, async (req, res) => {
    try {
        await req.user.deleteOne();
        res.send(req.user);
    } catch (e) {
        console.log(e);
        res.status(400).send(e);
    }
});

router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token = await user.generateAuthToken();
        res.send({user, token});
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

router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter(tokenObj => tokenObj.token !== req.token);
        await req.user.save();
        res.send("Logout successful");
    } catch (e) {
        res.status(400).send(e);
    }
});

module.exports = router;