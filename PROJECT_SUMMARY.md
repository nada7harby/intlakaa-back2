# ✅ Backend Project Generated Successfully!

## 📁 Project Structure

```
backend/
├── config/
│   └── db.js                          # MongoDB connection configuration
├── controllers/
│   ├── adminController.js             # Admin & authentication logic
│   └── requestController.js           # Request management logic
├── middleware/
│   └── auth.js                        # JWT authentication middleware
├── models/
│   ├── Admin.js                       # Admin schema with password hashing
│   └── Request.js                     # Request schema
├── routes/
│   ├── adminRoutes.js                 # Admin & auth routes
│   └── requestRoutes.js               # Request routes
├── utils/
│   └── sendEmail.js                   # Nodemailer email utility
├── .env                               # Environment variables (CONFIGURE THIS!)
├── .gitignore                         # Git ignore file
├── app.js                             # Express app setup
├── createOwner.js                     # Helper script to create owner
├── package.json                       # Dependencies
├── server.js                          # Server entry point
├── README.md                          # Full documentation
├── SETUP.md                           # Setup instructions
└── Intlakaa-API.postman_collection.json  # Postman collection
```

## 🚀 Quick Start

### 1. Configure Environment (.env)
```bash
# Edit .env and update:
- MongoDB password (replace <PASSWORD>)
- JWT_SECRET (use a secure random string)
- Email credentials (Gmail App Password recommended)
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Create Owner Account
```bash
node createOwner.js
# Follow the prompts to create your owner account
```

### 4. Start Server
```bash
# Development mode
npm run dev

# Production mode
npm start
```

## 📡 API Endpoints

### Authentication
- `POST /api/admins/login` - Login with email & password

### Admin Invite System (Supabase-like)
- `POST /api/admins/invite` - Send invite email (Owner only)
- `GET /api/admins/verify-invite?token=...` - Verify invite token
- `POST /api/admins/accept-invite` - Accept invite & set password
- `GET /api/admins` - Get all admins (Owner only)
- `DELETE /api/admins/:id` - Delete admin (Owner only)

### Requests
- `POST /api/requests` - Create request (Public)
- `GET /api/requests` - Get all requests (Admin)
- `GET /api/requests/:id` - Get single request (Admin)
- `DELETE /api/requests/:id` - Delete request (Admin)

## 🔐 Admin Invite Workflow

1. **Owner sends invite** → `POST /api/admins/invite`
   - System generates random token
   - Saves token with 1-hour expiration
   - Sends email with link: `https://www.intlakaa.com/admin/accept-invite#token=<TOKEN>`

2. **Admin receives email** → Clicks invite link

3. **Frontend verifies token** → `GET /api/admins/verify-invite?token=...`
   - Returns admin name & email if valid
   - Returns error if expired/invalid

4. **Admin sets password** → `POST /api/admins/accept-invite`
   - Input: token + password
   - Password is hashed with bcrypt
   - Token is cleared
   - Returns JWT for immediate login

## 🛠️ Features Implemented

✅ **Node.js + Express.js** - Modern ES modules
✅ **MongoDB + Mongoose** - Database with schemas
✅ **JWT Authentication** - Secure token-based auth
✅ **bcrypt** - Password hashing (10 salt rounds)
✅ **Nodemailer** - Email service for invites
✅ **Role-based Access** - Owner vs Admin permissions
✅ **Clean Architecture** - MVC pattern
✅ **Error Handling** - Comprehensive error middleware
✅ **Input Validation** - Schema validation
✅ **CORS Enabled** - Cross-origin support

## 📧 Email Configuration

For **Gmail**:
1. Enable 2-factor authentication
2. Generate App Password: https://myaccount.google.com/apppasswords
3. Use App Password in `EMAIL_PASSWORD` in .env

For **Other SMTP**:
- Update `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_USER`, `EMAIL_PASSWORD`

## 🧪 Testing

### Option 1: Postman
Import `Intlakaa-API.postman_collection.json` into Postman

### Option 2: cURL
```bash
# Health check
curl http://localhost:5000/api/health

# Login
curl -X POST http://localhost:5000/api/admins/login \
  -H "Content-Type: application/json" \
  -d '{"email":"owner@intlakaa.com","password":"yourpassword"}'

# Create request (public)
curl -X POST http://localhost:5000/api/requests \
  -H "Content-Type: application/json" \
  -d '{"name":"Ahmed","phone":"+201234567890","store_url":"https://example.com","monthly_salary":5000}'
```

## 📝 Database Collections

### admins
- name, email, password (hashed), role, inviteToken, inviteExpires, createdAt

### requests
- name, phone, store_url, monthly_salary, createdAt

## 🔒 Security Features

- Password hashing with bcrypt (10 rounds)
- JWT token authentication
- Protected routes with middleware
- Role-based access control (Owner/Admin)
- Invite token expiration (1 hour)
- Input validation on all endpoints
- Mongoose schema validation
- Error handling without exposing internals

## 📚 Documentation Files

- **README.md** - Complete API documentation
- **SETUP.md** - Detailed setup instructions
- **This file** - Quick reference guide

## 🎯 Next Steps

1. ✅ Configure `.env` file
2. ✅ Run `npm install` (if not done)
3. ✅ Run `node createOwner.js` to create owner account
4. ✅ Start server with `npm run dev`
5. ✅ Test with Postman or cURL
6. ✅ Integrate with your frontend

## 💡 Tips

- Use `npm run dev` for development (auto-restart with nodemon)
- Check MongoDB Atlas IP whitelist if connection fails
- JWT tokens expire in 7 days (configurable in .env)
- Invite tokens expire in 1 hour
- Owner role cannot be deleted
- All admin routes require JWT except login/invite verification

## 🐛 Troubleshooting

**MongoDB connection fails:**
- Check IP whitelist in MongoDB Atlas
- Verify password doesn't have special chars needing encoding
- Ensure database name is correct

**Email not sending:**
- Use Gmail App Password, not regular password
- Check SMTP port (587 for TLS)
- Verify firewall isn't blocking

**JWT errors:**
- Ensure JWT_SECRET is set in .env
- Check token format: `Authorization: Bearer <token>`
- Verify token hasn't expired

---

## 🎉 You're All Set!

Your backend is ready to use. Start the server and begin testing!

For questions or issues, refer to README.md and SETUP.md for detailed documentation.
