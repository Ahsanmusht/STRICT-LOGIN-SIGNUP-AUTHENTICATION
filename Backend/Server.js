const express = require('express');
const app = express();
require('./DB/Connection');
const PORT = process.env.PORT || 5000;
const UserRouter = require('./routes/User.Routes');
const cookieParser = require('cookie-parser');
const cors = require('cors');

app.use(cors({
    credentials: true,
    origin: "http://localhost:3000"
}));
app.use(cookieParser());
app.use(express.json());
app.use('/api', UserRouter);

app.listen(PORT, () => {
    console.log('Server Is Listening on', PORT);
})



