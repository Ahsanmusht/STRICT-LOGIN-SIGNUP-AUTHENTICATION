const express = require('express');
const Router = express.Router();
const UserController = require('../Controllers/User.Controller');
const upload = require('../MiddleWare/Img.Upload');

Router.post('/signup',upload.single('image'), UserController.Signup);
Router.post('/login', UserController.Login);
Router.get('/user', UserController.VerifyToken, UserController.getUser);
Router.get('/refresh',UserController.RefreshToken, UserController.VerifyToken,
UserController.getUser);

module.exports = Router