# Setup Instructions

## 1. Install Dependencies
Already done! Dependencies are being installed.

## 2. Configure Environment Variables

Edit the `.env` file and update:

1. **MongoDB Password**: Replace `<PASSWORD>` in the MONGODB_URI
2. **JWT Secret**: Change `JWT_SECRET` to a secure random string
3. **Email Settings**: Configure your SMTP email credentials

### For Gmail:
- Enable 2-factor authentication on your Google account
- Generate an App Password: https://myaccount.google.com/apppasswords
- Use the App Password in `EMAIL_PASSWORD`

## 3. Create Initial Owner Account

You'll need to manually create the first owner account in MongoDB:

```javascript
// Connect to MongoDB and run this in MongoDB Compass or Shell:
db.admins.insertOne({
  name: "Owner Name",
  email: "owner@intlakaa.com",
  password: "$2b$10$YourHashedPasswordHere", // Use bcrypt to hash
  role: "owner",
  createdAt: new Date()
})
```

Or use this Node.js script (create `createOwner.js`):

```javascript
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const createOwner = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  
  const hashedPassword = await bcrypt.hash('YourPassword123', 10);
  
  const db = mongoose.connection.db;
  await db.collection('admins').insertOne({
    name: 'Owner Name',
    email: 'owner@intlakaa.com',
    password: hashedPassword,
    role: 'owner',
    createdAt: new Date()
  });
  
  console.log('Owner created successfully!');
  process.exit(0);
};

createOwner();
```

Run: `node createOwner.js`

## 4. Start the Server

```bash
# Development mode (with auto-restart)
npm run dev

# Production mode
npm start
```

## 5. Test the API

### Health Check
```bash
curl http://localhost:5000/api/health
```

### Login
```bash
curl -X POST http://localhost:5000/api/admins/login \
  -H "Content-Type: application/json" \
  -d '{"email":"owner@intlakaa.com","password":"YourPassword123"}'
```

### Create Request (Public)
```bash
curl -X POST http://localhost:5000/api/requests \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Ahmed Ali",
    "phone": "+201234567890",
    "store_url": "https://example.com",
    "monthly_salary": 5000
  }'
```

### Invite Admin (Owner Only)
```bash
curl -X POST http://localhost:5000/api/admins/invite \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "New Admin",
    "email": "admin@example.com",
    "role": "admin"
  }'
```

## 6. Frontend Integration

Use these endpoints in your frontend:

- **Login**: `POST /api/admins/login`
- **Create Request**: `POST /api/requests`
- **Get Requests**: `GET /api/requests` (with JWT)
- **Delete Request**: `DELETE /api/requests/:id` (with JWT)
- **Invite Admin**: `POST /api/admins/invite` (owner only)
- **Verify Invite**: `GET /api/admins/verify-invite?token=...`
- **Accept Invite**: `POST /api/admins/accept-invite`

## Troubleshooting

### MongoDB Connection Issues
- Ensure your IP is whitelisted in MongoDB Atlas
- Check the password doesn't contain special characters that need encoding
- Verify the database name is correct

### Email Not Sending
- Check SMTP credentials
- For Gmail, ensure App Password is used (not regular password)
- Check firewall/antivirus isn't blocking port 587

### JWT Errors
- Ensure JWT_SECRET is set in .env
- Check token format: `Authorization: Bearer <token>`
- Verify token hasn't expired (default: 7 days)
