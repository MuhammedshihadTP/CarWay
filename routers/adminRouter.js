const { Router } = require('express');
const express=require('express');
const { adminhome, postadminlogin, getadminsignup, postadminsignup, getadminlogin, addvehcles, getaddvehcles } = require('../controller/admincontroller');
const addmincontroller=require('../controller/admincontroller');
const { postlogin } = require('../controller/Uercontroller');

const router=Router();
router.get('/',adminhome);
router.get('/signup',getadminsignup);
router.post('/signup', postadminsignup);
router.get('/login',getadminlogin);
router.post('/login',postadminlogin);
router.get('/vehclis',getaddvehcles);



module.exports=router