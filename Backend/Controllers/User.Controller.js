const UserModel = require('../Models/User.Model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const SECRET_KEY = 'nashaaudqutahshmszan';


const Signup = async (req, res, next) => {

    const { name, email, password, mobile } = req.body;

    let existingUser;

    try {

        existingUser = await UserModel.findOne({ email: email });

    } catch (error) {
        console.log(error);
    }
    if (existingUser) {
        return res.status(400).json({ message: 'User Already Exists!' });
    }

    const HashedPassword = bcrypt.hashSync(password);

    const User = new UserModel({
        name,
        email,
        password: HashedPassword,
        mobile
    })
    if (req.file) {
        User.image = req.file.path
    }
    try {
        await User.save();
    } catch (error) {
        console.log(error);
    }

    res.status(201).json({ User })
}

const Login = async (req, res, next) => {
    const { email, password } = req.body;

    let existingUser;

    try {

        existingUser = await UserModel.findOne({ email: email });

    } catch (error) {
        return new Error(error);
    }
    if (!existingUser) {
        res.status(400).json({ message: 'User Not Found!' })
    }

    const isPasswordCorrect = bcrypt.compareSync(password, existingUser.password);

    if (!isPasswordCorrect) {
        return res.status(400).json({ message: 'Invalid Email or Password!' });
    }

    const token = jwt.sign({ id: existingUser._id }, SECRET_KEY, {
        expiresIn: '35s'
    });

    console.log("Generated Token\n", token);

    if(req.cookies[`${existingUser._id}`]) {
        req.cookies[`${existingUser._id}`] = "";
    }

    res.cookie(String(existingUser._id), token, {

        path: '/',
        expires: new Date(Date.now() + 1000 * 30),
        httpOnly: true,
        sameSite: 'lax'
    })

    return res.status(200).json({ message: 'Login Successfully!', User: existingUser, token });
};

const VerifyToken = async (req, res, next) => {

    const cookies = req.headers.cookie;
    const token = cookies.split("=")[1];
    console.log(token);

    if (!token) {
        res.status(404).json({ message: 'No Token Found!' })
    }
    jwt.verify(String(token), SECRET_KEY, (err, user) => {
        if (err) {
            return res.status(400).json({ message: 'Invalid Token' });
        }

        console.log(user.id);
        req.id = user.id;
    })

    next();
};


const getUser = async (req, res, next) => {
    const userId = req.id;
    let user;

    try {

        user = await UserModel.findById(userId, '-password');

    } catch (error) {
        return new Error(error)
    }
    if (!user) {
        return res.status(404).json({ message: 'User Not Found!' });
    }
    return res.status(200).json({ user })
};

const RefreshToken = async (req, res, next) => {

    const cookies = req.headers.cookie;
    const prevToken = cookies.split("=")[1];

    if (!prevToken) {
        return res.status(400).json({ message: 'Couldn`t Found Token! ' })
    }
    jwt.verify(String(prevToken), SECRET_KEY, (err, user) => {
        if (err) {
            console.log(err);
            return res.status(403).json({ message: 'Authentication Failed!' })
        }
        res.clearCookie(`${user.id}`);
        req.cookies[`${user.id}`] = "";

        const token = jwt.sign({ id: user.id }, SECRET_KEY, {
            expiresIn: '35s'
        })

        console.log("Regenerated Token\n", token);

        res.cookie(String(user.id), token, {

            path: '/',
            expires: new Date(Date.now() + 1000 * 30),
            httpOnly: true,
            sameSite: 'lax'
        })

        req.id = user.id;

        next();
    })
}

module.exports = {
    Signup,
    Login,
    VerifyToken,
    getUser,
    RefreshToken
}