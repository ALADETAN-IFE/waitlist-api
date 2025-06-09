import axios from 'axios';
import dotenv from 'dotenv';
import { EmailError } from '../types/interfaces';

dotenv.config();


const sendEmail = async (
    to: string,
    subject: string,
    htmlContent: string,
    textContent: string
): Promise<boolean> => {
    try {
        if (!process.env.BREVO_API_KEY || !process.env.BREVO_SENDER_EMAIL) {
            console.error('Brevo API key or sender email is not configured.');
            return false;
        }

        const response = await axios({
            method: 'POST',
            url: 'https://api.brevo.com/v3/smtp/email',
            headers: {
                'accept': 'application/json',
                'content-type': 'application/json',
                'api-key': process.env.BREVO_API_KEY
            },
            data: {
                sender: {
                    name: 'Muve Launch Team ',
                    email: process.env.BREVO_SENDER_EMAIL
                },
                to: [{
                    email: to
                }],
                subject: subject,
                htmlContent: htmlContent,
                textContent: textContent
            }
        });

        console.log('Email sent successfully:', response.data);
        return true;
        } catch (error) {
        const emailError = error as EmailError;
        console.error('Error sending email:', emailError.response?.data || emailError.message);
        return false;
    }
};

const sendSubscriptionEmail = async (name: string, email: string): Promise<boolean> => {
    const subject = "🎉 Welcome to Our Waitlist!";
    const textContent = `Hi ${name},\n\nThank you for joining our waitlist. We're excited to have you on board!\n\nWe'll keep you updated with the latest news and developments. You'll be among the first to know when we launch.\n\nBest regards,\nThe Launch Team`;
    const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Welcome to Our Waitlist</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #2c3e50; margin-bottom: 20px;">Welcome to Our Waitlist!</h1>
            </div>
            <div style="background-color: #f9f9f9; padding: 20px; border-radius: 5px;">
                <p>Hi ${name},</p>
                <p>Thank you for joining our waitlist. We're excited to have you on board!</p>
                <p>We'll keep you updated with the latest news and developments. You'll be among the first to know when we launch.</p>
                <p style="margin-top: 30px;">Best regards,<br><strong>The Launch Team</strong></p>
            </div>
            <div style="text-align: center; margin-top: 30px; font-size: 12px; color: #666;">
                <p>This email was sent to ${email}</p>
                <p>If you didn't sign up for this waitlist, please ignore this email.</p>
            </div>
        </body>
        </html>
    `;

    return sendEmail(email, subject, htmlContent, textContent);
};

const sendLaunchEmail = async (name: string, email: string): Promise<boolean> => {
    const subject = "🚀 We're Live!";
    const textContent = `Hi ${name},\n\nGreat news! We've officially launched!\n\nAs a waitlist member, you get exclusive early access. Click here to get started: ${process.env.LAUNCH_URL}\n\nThank you for your patience and support. We're excited to have you on board!\n\nBest regards,\nThe Launch Team`;
    const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>We're Live!</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #2c3e50; margin-bottom: 20px;">We're Live! 🎉</h1>
            </div>
            <div style="background-color: #f9f9f9; padding: 20px; border-radius: 5px;">
                <p>Hi ${name},</p>
                <p>Great news! We've officially launched!</p>
                <p>As a waitlist member, you get exclusive early access. Click the button below to get started:</p>
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${process.env.LAUNCH_URL}" style="background-color: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">Get Started Now</a>
                </div>
                <p>Thank you for your patience and support. We're excited to have you on board!</p>
                <p style="margin-top: 30px;">Best regards,<br><strong>The Launch Team</strong></p>
            </div>
            <div style="text-align: center; margin-top: 30px; font-size: 12px; color: #666;">
                <p>This email was sent to ${email}</p>
                <p>If you didn't sign up for this waitlist, please ignore this email.</p>
            </div>
        </body>
        </html>
    `;

    return sendEmail(email, subject, htmlContent, textContent);
};

export { sendSubscriptionEmail, sendLaunchEmail };