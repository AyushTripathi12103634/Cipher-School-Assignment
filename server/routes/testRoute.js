import { Router } from "express";
import { requireSignIn } from '../middleware/authmiddleware.js';
import { createtestcontroller, gettestcontroller, submittestcontroller, getalltestcontroller, createquestioncontroller } from "../controllers/testcontroller.js";

const router = Router();
router.post("/createtest",createtestcontroller);
router.post("/submittest",requireSignIn,submittestcontroller);
router.get("/gettest/:id",requireSignIn,gettestcontroller);
router.get("/gettests",getalltestcontroller);
router.post("/createquestion",createquestioncontroller);

export default router;