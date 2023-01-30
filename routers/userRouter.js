const { Router } = require('express');
const express=require('express');
const { home, signup, getsignup, postsignup } = require('../controller/Uercontroller');
const router=Router()

router.get('/',home)
// router.get('/home',gethome);
router.get('/signup',getsignup);
router.post('/signup',postsignup);

module.exports=router;