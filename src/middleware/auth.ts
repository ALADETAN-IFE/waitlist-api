import { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';

dotenv.config();

export const authenticateApiKey = (req: Request, res: Response, next: NextFunction) => {
    const apiKey = req.headers['api-key']; // or req.headers.authorization

    if (!apiKey) {
        return res.status(401).json({ error: 'Unauthorized: No API Key provided' });
    }

    if (apiKey === process.env.API_KEY as string) {
        next();
    } else {
        return res.status(403).json({ error: 'Forbidden: Invalid API Key' });
    }
}; 