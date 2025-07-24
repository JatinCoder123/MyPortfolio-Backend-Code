import express from "express";
import { addNewApplication,deleteApplication,getAllApplication } from "../controllers/softwareApplication.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.post("/add",isAuthenticated,addNewApplication)
router.get("/getall",getAllApplication)
router.delete("/delete/:id",isAuthenticated,deleteApplication)

export default router;
