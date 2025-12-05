# Admin Invite API - Testing Guide

## Endpoint
**POST** `http://localhost:5000/api/auth/send-invite`

## Request Body
```json
{
  "email": "admin@example.com"
}
```

## Success Response (200)
```json
{
  "success": true,
  "message": "Invite sent successfully",
  "data": {
    "email": "admin@example.com",
    "expiresAt": "2025-12-05T13:41:24.000Z"
  }
}
```

## Error Responses

### Missing Email (400)
```json
{
  "success": false,
  "message": "Email is required"
}
```

### Invalid Email (400)
```json
{
  "success": false,
  "message": "Please provide a valid email"
}
```

### Duplicate Active Invite (400)
```json
{
  "success": false,
  "message": "An active invite already exists for this email"
}
```

### Email Send Failure (500)
```json
{
  "success": false,
  "message": "Failed to send invitation email. Please try again.",
  "error": "Email error details"
}
```

### Server Error (500)
```json
{
  "success": false,
  "message": "Server error while sending invite",
  "error": "Error details"
}
```

## Testing with cURL

```bash
curl -X POST http://localhost:5000/api/auth/send-invite \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com"}'
```

## Testing with Postman

1. Method: POST
2. URL: `http://localhost:5000/api/auth/send-invite`
3. Headers: 
   - Content-Type: application/json
4. Body (raw JSON):
   ```json
   {
     "email": "admin@example.com"
   }
   ```

## Invite Email Content

The recipient will receive an email with:
- A clickable button linking to: `http://localhost:8080/accept-invite?token=<TOKEN>`
- The full URL displayed in case the button doesn't work
- Expiration notice (1 hour)
- Professional styling with Intlakaa branding

## Database Collection

The invite is stored in the `adminInvites` collection with:
- **email**: Recipient's email (lowercase)
- **token**: 64-character hex string (secure random)
- **expiresAt**: Date object (1 hour from creation)
- **accepted**: Boolean (default: false)
- **createdAt**: Date object (auto-generated)

## Auto-Cleanup

MongoDB TTL index automatically deletes expired invites based on the `expiresAt` field.
