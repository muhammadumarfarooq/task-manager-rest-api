const jwt = require('jsonwebtoken');
const User = require('../models/user');

const auth = (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');

        if (!token) {
            throw new Error();
        }

        const decoded = jwt.verify(token, 'thisismysecretkey');
        const user = User.findOne({_id: decoded._id, 'tokens.token': token});

        if (!user) {
            throw new Error();
        }

        next();
    } catch (e) {
        console.log(e);
        res.status(401).send({message: 'Unauthorized'});
    }
}

module.exports = auth;