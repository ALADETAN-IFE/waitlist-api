import express from "express";
import { subscribe, sendMail, removeSubscribed, getAllSubscribed } from "../controllers/controls";
import { authenticateApiKey } from '../middleware/auth';

const router = express.Router();

router.post('/subscribe', subscribe as express.RequestHandler);
router.post('/send_mail', sendMail as express.RequestHandler);
router.post('/remove_user', authenticateApiKey as express.RequestHandler, removeSubscribed as express.RequestHandler);
router.get('/get_all', authenticateApiKey as express.RequestHandler, getAllSubscribed as express.RequestHandler);

export default router;
