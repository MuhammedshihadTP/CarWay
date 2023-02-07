const { Router } = require('express');
const express=require('express');
const { adminhome, postsignup, getsignup } = require('../controller/admincontroller');
const addmincontroller=require('../controller/admincontroller');

const router=Router();
router.get('/',adminhome);
router.get('/adminsignup',getsignup);
router.post('/adminsignup', postsignup)



module.exports=router