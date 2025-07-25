import express from "express";
import { addNewSkill,updateSkill,deleteSkill,getAllSkills} from "../controllers/skill.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.post("/add",isAuthenticated,addNewSkill)
router.get("/getall",getAllSkills)
router.delete("/delete/:id",isAuthenticated,deleteSkill)
router.put("/update/:id",isAuthenticated,updateSkill)

export default router;
