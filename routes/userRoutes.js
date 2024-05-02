const express = require('express');
const router = express.Router();
const { getUser, getUserById, createUser,logInUser,updateUser,deleteUser} = require('../controller/userController');

router.get('/users',getUser);
router.get('/users/:id',getUserById);
router.post('/users',createUser);
router.post('/users/login',logInUser);
router.patch('/users/:id',updateUser);
router.delete('/users/:id',deleteUser);



module.exports= router;