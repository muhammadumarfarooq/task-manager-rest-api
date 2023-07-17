const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Task = require('./task');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        unique: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Please enter a valid email address');
            }
        }
    },
    password: {
        type: String,
        required: true,
        minLength: 7,
        trim: true,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('Please enter a valid password');
            }
        }
    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if (value < 0) {
                throw new Error('Please enter a valid age');
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true,
        }
    }]
});

userSchema.pre('save', async function (next) {
    const user = this;

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }

    next();

});

userSchema.pre('deleteOne', { document: true },async function (next) {
    const user = this;
    await Task.deleteMany({owner: user._id});

    next();
})

userSchema.methods.generateAuthToken = async function () {
    const user = this;

    const token = jwt.sign({_id: user._id.toString()}, 'thisismysecretkey');

    user.tokens = user.tokens.concat({token});
    await user.save();

    return token;
}

userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({email});

    if (!user) {
        throw new Error('Unable to login');
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        throw new Error('Unable to login');
    }

    return user;
};

userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
});

userSchema.methods.toJSON = function() {
    const user = this;

    const userObj = user.toObject();

    delete userObj.tokens;
    delete userObj.password;

    return userObj;
}

const User = mongoose.model('User', userSchema);

module.exports = User;