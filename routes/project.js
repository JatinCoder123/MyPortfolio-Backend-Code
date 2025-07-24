import express from "express";
import { addNewProject,updateProject,deleteProject,getAllProjects,getProject} from "../controllers/project.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.post("/add",isAuthenticated,addNewProject)
router.get("/getall",getAllProjects)
router.get("/get/:id",getProject)
router.delete("/delete/:id",isAuthenticated,deleteProject)
router.put("/update/:id",isAuthenticated,updateProject)

export default router;
