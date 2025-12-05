# 🚀 Admin Invite System - Setup & Usage Guide

## ✅ What Was Fixed

The 500 Internal Server Error was caused by missing email configuration. The system has been updated to work in **Development Mode** when email is not configured.

---

## 🔧 How It Works Now

### **Development Mode (No Email Configuration)**
- ✅ Invite is created and saved to database
- ✅ Token and invite URL are returned in the API response
- ✅ Console logs show the invite URL and token
- ✅ No email is sent (perfect for testing)

### **Production Mode (Email Configured)**
- ✅ Invite is created and saved to database
- ✅ Professional email is sent to the recipient
- ✅ Token is NOT included in response (security)
- ✅ Full email delivery confirmation

---

## 📋 Current Behavior

### **Request:**
```bash
POST http://localhost:5000/api/auth/send-invite
Content-Type: application/json

{
  "email": "admin@example.com"
}
```

### **Response (Development Mode - Email Not Configured):**
```json
{
  "success": true,
  "message": "Invite created successfully (Email not configured - Development Mode)",
  "data": {
    "email": "admin@example.com",
    "expiresAt": "2025-12-05T15:46:22.000Z",
    "token": "a1b2c3d4e5f6789...",
    "inviteUrl": "http://localhost:8080/accept-invite?token=a1b2c3d4e5f6789..."
  }
}
```

### **Console Output (Development Mode):**
```
Attempting to send invite email to: admin@example.com
⚠️  Email not configured. Running in development mode.
📧 Invite URL: http://localhost:8080/accept-invite?token=a1b2c3d4e5f6789...
🔑 Token: a1b2c3d4e5f6789...
```

---

## 🎯 Testing the Endpoint

### **Option 1: Using cURL**
```bash
curl -X POST http://localhost:5000/api/auth/send-invite \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"test@example.com\"}"
```

### **Option 2: Using Postman**
1. Method: `POST`
2. URL: `http://localhost:5000/api/auth/send-invite`
3. Headers: `Content-Type: application/json`
4. Body (raw JSON):
   ```json
   {
     "email": "test@example.com"
   }
   ```

### **Option 3: Using JavaScript/Axios**
```javascript
const response = await axios.post('http://localhost:5000/api/auth/send-invite', {
  email: 'test@example.com'
});

console.log('Invite URL:', response.data.data.inviteUrl);
console.log('Token:', response.data.data.token);
```

---

## 📧 Setting Up Email (Optional)

If you want to send actual emails in production:

### **Step 1: Copy .env.example**
```bash
cp .env.example .env
```

### **Step 2: Configure Email Settings**

Edit `.env` and add your email credentials:

```env
# For Gmail
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_specific_password
EMAIL_FROM=noreply@intlakaa.com
```

### **Step 3: Gmail App Password Setup**
1. Go to Google Account Settings
2. Enable 2-Factor Authentication
3. Generate an App Password
4. Use that password in `EMAIL_PASSWORD`

### **Step 4: Restart Server**
```bash
npm run dev
```

---

## 🔍 Troubleshooting

### **Error: "An active invite already exists for this email"**
**Solution:** The email already has a pending invite. Wait 1 hour or delete from database:
```javascript
// In MongoDB
db.adminInvites.deleteOne({ email: "admin@example.com" })
```

### **Error: "Please provide a valid email"**
**Solution:** Check email format. Must be valid email address.

### **Error: "Failed to send invitation email"**
**Solution:** 
1. Check `.env` file has correct email credentials
2. For Gmail, use App Password, not regular password
3. Check EMAIL_HOST and EMAIL_PORT are correct

---

## 📊 Database Structure

Invites are stored in `adminInvites` collection:

```javascript
{
  _id: ObjectId("..."),
  email: "admin@example.com",
  token: "64-character-hex-string",
  expiresAt: ISODate("2025-12-05T15:46:22.000Z"),
  accepted: false,
  createdAt: ISODate("2025-12-05T14:46:22.000Z")
}
```

**Auto-Cleanup:** Expired invites are automatically deleted by MongoDB TTL index.

---

## 🔐 Security Features

✅ **Secure Tokens:** 256-bit random tokens using crypto.randomBytes  
✅ **Expiration:** Invites expire after 1 hour  
✅ **Duplicate Prevention:** Can't create multiple active invites for same email  
✅ **Auto-Cleanup:** Expired invites are automatically deleted  
✅ **Token Privacy:** In production mode, token is NOT returned in API response  

---

## 🎨 Email Template Preview

When email is configured, recipients receive a beautiful HTML email with:
- 🎉 Welcome header with Intlakaa branding
- 🔵 Indigo color scheme (#4F46E5)
- 🔘 Clickable "Accept Invitation" button
- 📋 Fallback URL display
- ⏰ Clear expiration warning (1 hour)
- 📱 Responsive design

---

## 🚦 Next Steps

1. ✅ **Test the endpoint** - It works in development mode now!
2. 📧 **Optional:** Set up email for production
3. 🔗 **Create accept-invite endpoint** - To handle token verification
4. 🎨 **Create accept-invite page** - Frontend UI for setting password

---

## 💡 Development Tips

- **Development Mode:** Perfect for testing without email setup
- **Token in Response:** Use the returned `inviteUrl` to test the flow
- **Console Logs:** Check server console for invite URLs
- **Database:** Use MongoDB Compass to view/manage invites
- **Expiration:** Invites expire in 1 hour (configurable in code)

---

**The system is now fully functional in development mode! 🎉**

No email configuration needed for testing. Just restart your server and try the endpoint!
