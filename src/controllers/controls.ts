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
            return res.status(400).json({ error: 'Email already subscribed' });
        }

        // Create new subscription
        const subscription = new User({ name, email });
        await subscription.save();

        // Send welcome email
        try {
            await sendSubscriptionEmail(name, email);
        } catch (emailError) {
            console.error('Error sending welcome email:', emailError);
            // Continue even if email fails - user is still subscribed
        }

        res.status(201).json({ message: 'Subscribed successfully' });
    } catch (err) {
        console.error('Error during subscription:', err);
        res.status(500).json({ error: 'Subscription failed' });
    }
};

// export const sendMail = async (req: Request, res: Response) => {
//     try {
//         // Fetch all subscribers from the database
//         const subscribers = await User.find();

//         if (subscribers.length === 0) {
//             return res.status(404).json({ message: 'No subscribers found' });
//         }

//         // Send an email to each subscriber
//         for (const subscriber of subscribers) {
//             await sendLaunchEmail(subscriber.name, subscriber.email);
//         }

//         res.status(200).json({ message: 'Emails sent successfully to all subscribers' });
//     } catch (err) {
//         console.error('Error sending emails:', err);
//         res.status(500).json({ message: 'Failed to send emails' });
//     }
// };

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

