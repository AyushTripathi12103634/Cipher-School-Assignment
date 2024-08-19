import express from 'express';
import {registerController,loginController,islogincontroller} from "../controllers/authcontroller.js";
const router=express.Router();
router.post("/register",registerController);
router.post("/login",loginController);
router.get("/islogin",islogincontroller);
export default router;