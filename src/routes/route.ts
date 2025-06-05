import express from "express";
import { subscribe, sendMail } from "../controllers/controls";

const router = express.Router();

router.post('/subscribe', subscribe as express.RequestHandler);
router.post('/send_mail', sendMail as express.RequestHandler);

export default router;
