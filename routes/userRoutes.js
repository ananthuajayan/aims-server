const express = require('express');
const jwtmiddleware = require('../middlewares/jwtmiddleware');
const router = express.Router();
const { getUser, getUserById, createUser,logInUser,updateUser,deleteUser,MailVerification} = require('../controller/userController');
const {forgotPassword} = require('../controller/forgotPasswordController');
const {verifyToken} = require('../controller/varify_token_controller');
const {changePassword}=require('../controller/change_pass_controller');
const {logout}= require('../controller/logout_controller');
const {getAllClients,deleteClient,updateClient,addClient} = require('../controller/client_controller')

router.get('/users',getUser);

router.get('/users/:id',getUserById);

router.post('/users/create',createUser);

router.post('/users/login',logInUser);

router.post('/users/forgot-password',forgotPassword)

router.patch('/users/:id',jwtmiddleware,updateUser);

router.delete('/users/:id',jwtmiddleware,deleteUser);

router.get('/mail-verification/:id',MailVerification);

router.post("/verify",verifyToken) ;

router.post('/users/change_password',changePassword);

router.post('/logout', logout);

// Client route

router.get('/clients',getAllClients);

router.delete('/clients/delete/:id',jwtmiddleware, deleteClient);

router.patch('/clients/update/:id',jwtmiddleware, updateClient);

router.post('/client/add',addClient);


module.exports= router;