import express from "express";
import {
  addNewCertificate,
  deleteCertificate,
  getAllCertificate,
} from "../controllers/certificate.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.post("/add", isAuthenticated, addNewCertificate);
router.get("/getall", getAllCertificate);
router.delete("/delete/:id", isAuthenticated, deleteCertificate);

export default router;
