const express = require('express');
require('./db/mongoose');

const userRouter = require('./routers/user');
const taskRouter = require('./routers/task');

const app = express();
const port = process.env.PORT || 3000;

app.use((req, res, next) => {
    res.status(503).send("Site is currently down, Please check back soon!");
});
app.use(express.json());
app.use(userRouter);
app.use(taskRouter);


app.listen(port, () => {
    console.log('App is connected to port', port);
});


//Tasks


// add unique property to schema. (for uniqueness we need to wipe our db).
// define our own method findByCredentials like findById.
// Generate JWT token.


