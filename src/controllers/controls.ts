import { Request, Response } from 'express';
import { sendSubscriptionEmail, sendLaunchEmail } from '../services/mailer';
import { userPayload } from '../types/interfaces';
import User from '../model/user';
import { isValidEmail } from '../services/check';

export const subscribe = async (req: Request, res: Response) => {
    const { name, email } = req.body as userPayload;
    
    // Validate email format
    if (!isValidEmail(email)) {
        return res.status(400).json({ error: `Invalid email format: ${email}` });
    }

    if (!name || !email) {
        return res.status(400).json({ error: 'Name and email are required.' });
    }

    try {
        // Check if email already exists
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            // If user already exists, find their position
            const userPosition = await User.countDocuments({ createdAt: { $lt: existingUser.createdAt } }) + 1;
            return res.status(200).json({ message: `Email already subscribed. You are currently number ${userPosition} on the waitlist.` });
        }

        // Create new subscription
        const subscription = new User({ name, email });
        await subscription.save();

        // After new subscription, get the updated total count for their position
        const newPosition = await User.countDocuments();

        // Send welcome email
        try {
            await sendSubscriptionEmail(name, email);
        } catch (emailError) {
            console.error('Error sending welcome email:', emailError);
        }

        res.status(201).json({ message: `Subscribed successfully! You are now number ${newPosition} on the waitlist.` });
    } catch (err) {
        console.error('Error during subscription:', err);
        res.status(500).json({ error: 'Subscription failed' });
    }
};

export const sendMail = async (req: Request, res: Response) => {
    try {
        // Fetch all subscribers from the database
        const subscribers = await User.find();

        if (subscribers.length === 0) {
            return res.status(404).json({ message: 'No subscribers found' });
        }

        const results = {
            successful: 0,
            failed: 0,
            failedEmails: [] as string[],
            succesEmails: [] as string[]
        };

        // Send emails sequentially to avoid overwhelming the SMTP server
        for (const subscriber of subscribers) {
            try {
                if (!subscriber.name) continue;
                const success = await sendLaunchEmail(subscriber.name, subscriber.email);
                if (success) {
                    results.successful++;
                    results.succesEmails.push(subscriber.email);
                    return
                }
            } catch (error) {
                console.error(`Failed to send email to ${subscriber.email}:`, error);
                results.failed++;
                results.failedEmails.push(subscriber.email);
            }
            // Add a small delay between emails
            await new Promise(resolve => setTimeout(resolve, 1000));
        }

        res.status(200).json({
            message: 'Email sending completed',
            results: {
                total: subscribers.length,
                successful: results.successful,
                failed: results.failed,
                failedEmails: results.failedEmails
            }
        });
    } catch (err) {
        console.error('Error sending emails:', err);
        res.status(500).json({ message: 'Failed to send emails' });
    }
};

export const getAllSubscribed = async (req: Request, res: Response) => {
    try {
        const existingUsers = await User.find({})
        if (!existingUsers) {
            return res.status(400).json({ error: 'No subscribed user found' });
        }
        res.status(200).json({message: `${existingUsers.length} users subscribed`, data: existingUsers})
    } catch (err) {
        console.error('Error in getting all subscribed users:', err);
        res.status(500).json({ error: 'failed in getting all subscribed users' });
    }
}

export const removeSubscribed = async (req: Request, res: Response) => {
    try {
        const { email } = req.body as userPayload;
        
        // Validate email format
        if (!isValidEmail(email)) {
            return res.status(400).json({ error: `Invalid email format: ${email}` });
        }

        if (!email) {
            return res.status(400).json({ error: 'Email is required.' });
        }

        const user = await User.findOneAndDelete({ email });
        if (!user) {
            return res.status(404).json({ error: 'No subscribed user found with this email' });
        }
        res.status(200).json({ message: `${email} has been removed from the waitlist` });
    } catch (err) {
        if (err instanceof SyntaxError) {
            return res.status(400).json({ error: 'Invalid JSON in request body' });
        }
        console.error('Error in removing subscribed user:', err);
        res.status(500).json({ error: 'Failed to remove subscribed user' });
    }
}