# Waitlist API Documentation

This API provides endpoints for managing a waitlist system, including subscribing users and sending launch emails.

## Base URL

```
https://waitlist-api-m3t6.onrender.com/api
```

## Authentication

Currently, this API does not require authentication.

## Endpoints

### 1. Subscribe to Waitlist

Add a new user to the waitlist.

**Endpoint:** `POST /subscribe`

**Request Body:**
```json
{
    "name": "John Doe",
    "email": "john@example.com"
}
```

**Response:**
- Success (201):
```json
{
    "message": "Subscribed successfully"
}
```

- Error (400):
```json
{
    "error": "Invalid email format: invalid@email"
}
```
or
```json
{
    "error": "Name and email are required."
}
```
or
```json
{
    "error": "Email already subscribed"
}
```

- Error (500):
```json
{
    "error": "Subscription failed"
}
```

### 2. Send Launch Emails

Send launch announcement emails to all subscribers.

**Endpoint:** `POST /send_mail`

**Request Body:** None required

**Response:**
- Success (200):
```json
{
    "message": "Email sending completed",
    "results": {
        "total": 100,
        "successful": 95,
        "failed": 5,
        "failedEmails": ["failed1@example.com", "failed2@example.com"]
        "successEmails": ["success1@example.com", "success2@example.com"]
    }
}
```

- Error (404):
```json
{
    "message": "No subscribers found"
}
```

- Error (500):
```json
{
    "message": "Failed to send emails"
}
```

## Error Codes

- `400`: Bad Request - Invalid input data
- `404`: Not Found - Resource not found
- `500`: Internal Server Error - Server-side error

## Rate Limiting

The API implements a 1-second delay between sending emails to prevent overwhelming the SMTP server.

## Email Delivery

The API uses Gmail SMTP for sending emails. Make sure the following environment variables are properly configured:

```
GMAIL_USER=your-email@gmail.com
GMAIL_PASS=your-app-password
```

## Frontend Integration Example

Here's an example of how to integrate with the API using JavaScript/TypeScript:

```typescript
// Subscribe to waitlist
async function subscribeToWaitlist(name: string, email: string) {
    try {
        const response = await fetch('https://your-api-domain.com/api/subscribe', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Subscription failed');
        }
        
        return data;
    } catch (error) {
        console.error('Subscription error:', error);
        throw error;
    }
}

// Send launch emails
async function sendLaunchEmails() {
    try {
        const response = await fetch('https://your-api-domain.com/api/send_mail', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Failed to send emails');
        }
        
        return data;
    } catch (error) {
        console.error('Email sending error:', error);
        throw error;
    }
}
```

## Common Issues and Solutions

1. **Email Already Subscribed**
   - Check if the email is already in the database
   - Consider implementing an unsubscribe feature

2. **Invalid Email Format**
   - Ensure the email follows standard format (e.g., user@domain.com)
   - Implement client-side validation before making the API call

3. **SMTP Connection Issues**
   - Verify Gmail credentials are correct
   - Check if using an App Password for Gmail
   - Ensure network connectivity to Gmail's SMTP servers

4. **Rate Limiting**
   - The API implements a 1-second delay between emails
   - Consider implementing batch processing for large subscriber lists

## Best Practices

1. Always handle API errors gracefully in your frontend application
2. Implement proper validation before making API calls
3. Store API responses in your application state management system
4. Implement retry logic for failed email sends
5. Monitor email delivery success rates 