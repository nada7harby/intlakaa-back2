import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import Admin from '../models/Admin.js';
import AdminInvite from '../models/AdminInvite.js';
import sendEmail from '../utils/sendEmail.js';

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// @desc    Login admin
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password',
      });
    }

    // Check if admin exists
    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Check if password is set
    if (!admin.password) {
      return res.status(401).json({
        success: false,
        message: 'Please accept your invite and set a password first',
      });
    }

    // Check password
    const isMatch = await admin.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Generate token
    const token = generateToken(admin._id);

    res.status(200).json({
      success: true,
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current logged in admin
// @route   GET /api/auth/me
// @access  Private
export const getCurrentAdmin = async (req, res, next) => {
  try {
    const admin = await Admin.findById(req.admin.id).select('-password -inviteToken');

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found',
      });
    }

    res.status(200).json({
      success: true,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Send admin invite
// @route   POST /api/auth/send-invite
// @access  Public (or can be protected based on requirements)
export const sendInvite = async (req, res, next) => {
  try {
    const { email } = req.body;

    // Validate email
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required',
      });
    }

    // Check if email is valid
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email',
      });
    }

    // Check if invite already exists and is not expired
    const existingInvite = await AdminInvite.findOne({
      email: email.toLowerCase(),
      expiresAt: { $gt: Date.now() },
      accepted: false,
    });

    // If invite exists, delete it and create a new one (resend functionality)
    if (existingInvite) {
      console.log('📧 Existing invite found, deleting and creating new one...');
      await AdminInvite.findByIdAndDelete(existingInvite._id);
    }

    // Generate secure random token
    const token = crypto.randomBytes(32).toString('hex');

    // Set expiration date (1 hour from now)
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // Save invite in MongoDB
    const invite = await AdminInvite.create({
      email: email.toLowerCase(),
      token,
      expiresAt,
      accepted: false,
    });

    // Create invite URL
    const inviteUrl = `http://localhost:8080/accept-invite?token=${token}`;

    // Email HTML - Modern Creative Design
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            line-height: 1.6; 
            color: #1f2937;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 40px 20px;
          }
          .email-wrapper {
            max-width: 600px;
            margin: 0 auto;
            background: white;
            border-radius: 20px;
            overflow: hidden;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
          }
          .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 50px 30px;
            text-align: center;
            position: relative;
          }
          .header::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: url('data:image/svg+xml,<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="40" fill="rgba(255,255,255,0.1)"/></svg>');
            opacity: 0.1;
          }
          .logo {
            font-size: 48px;
            margin-bottom: 10px;
          }
          .header h1 {
            color: white;
            font-size: 32px;
            font-weight: 700;
            margin: 0;
            position: relative;
            z-index: 1;
          }
          .header p {
            color: rgba(255,255,255,0.9);
            font-size: 16px;
            margin-top: 10px;
            position: relative;
            z-index: 1;
          }
          .content {
            padding: 50px 40px;
            background: white;
          }
          .greeting {
            font-size: 24px;
            color: #1f2937;
            margin-bottom: 20px;
            font-weight: 600;
          }
          .message {
            font-size: 16px;
            color: #4b5563;
            margin-bottom: 15px;
            line-height: 1.8;
          }
          .highlight {
            color: #667eea;
            font-weight: 600;
          }
          .cta-section {
            text-align: center;
            margin: 40px 0;
          }
          .button {
            display: inline-block;
            padding: 18px 50px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white !important;
            text-decoration: none;
            border-radius: 50px;
            font-size: 18px;
            font-weight: 600;
            box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4);
            transition: transform 0.3s ease;
          }
          .button:hover {
            transform: translateY(-2px);
            box-shadow: 0 15px 40px rgba(102, 126, 234, 0.5);
            color: white !important;
          }
          .divider {
            text-align: center;
            margin: 30px 0;
            color: #9ca3af;
            font-size: 14px;
          }
          .link-box {
            background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
            padding: 20px;
            border-radius: 12px;
            border-left: 4px solid #667eea;
            word-break: break-all;
            font-family: 'Courier New', monospace;
            font-size: 13px;
            color: #374151;
            margin: 20px 0;
          }
          .info-box {
            background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
            border-left: 4px solid #f59e0b;
            padding: 20px;
            border-radius: 12px;
            margin: 30px 0;
          }
          .info-box-title {
            font-size: 16px;
            font-weight: 700;
            color: #92400e;
            margin-bottom: 8px;
            display: flex;
            align-items: center;
            gap: 8px;
          }
          .info-box-text {
            font-size: 14px;
            color: #78350f;
            line-height: 1.6;
          }
          .footer {
            background: #f9fafb;
            padding: 30px;
            text-align: center;
            border-top: 1px solid #e5e7eb;
          }
          .footer-text {
            font-size: 13px;
            color: #6b7280;
            margin-bottom: 10px;
          }
          .footer-link {
            color: #667eea;
            text-decoration: none;
            font-weight: 500;
          }
          .social-links {
            margin-top: 20px;
          }
          .social-links a {
            display: inline-block;
            margin: 0 10px;
            color: #9ca3af;
            text-decoration: none;
            font-size: 20px;
          }
        </style>
      </head>
      <body>
        <div class="email-wrapper">
          <!-- Header -->
          <div class="header">
            <div class="logo">🚀</div>
            <h1>Welcome to Intlakaa!</h1>
            <p>You've been invited to join our team</p>
          </div>

          <!-- Content -->
          <div class="content">
            <div class="greeting">Hello there! 👋</div>
            
            <p class="message">
              Great news! You've been invited to join <span class="highlight">Intlakaa</span> as an administrator.
            </p>
            
            <p class="message">
              We're excited to have you on board. Click the button below to accept your invitation and set up your account:
            </p>

            <!-- CTA Button -->
            <div class="cta-section">
              <a href="${inviteUrl}" class="button" style="color: white !important; text-decoration: none;">
                ✨ Accept Invitation
              </a>
            </div>

            <!-- Divider -->
            <div class="divider">
              ━━━━━━━━ OR ━━━━━━━━
            </div>

            <!-- Link Box -->
            <p class="message">Copy and paste this link into your browser:</p>
            <div class="link-box">
              ${inviteUrl}
            </div>

            <!-- Important Info -->
            <div class="info-box">
              <div class="info-box-title">
                ⏰ Important Information
              </div>
              <div class="info-box-text">
                This invitation will expire in <strong>1 hour</strong>. Please accept it as soon as possible to secure your access.
              </div>
            </div>

            <p class="message" style="margin-top: 30px; font-size: 14px; color: #9ca3af;">
              If you didn't expect this invitation, you can safely ignore this email. No account will be created.
            </p>
          </div>

          <!-- Footer -->
          <div class="footer">
            <p class="footer-text">
              © ${new Date().getFullYear()} <strong>Intlakaa</strong>. All rights reserved.
            </p>
            <p class="footer-text">
              Need help? <a href="mailto:support@intlakaa.com" class="footer-link">Contact Support</a>
            </p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Send email
    console.log('Attempting to send invite email to:', invite.email);
    
    // Check if email is configured (all required fields)
    const isEmailConfigured = process.env.EMAIL_HOST && 
                               process.env.EMAIL_USER && 
                               process.env.EMAIL_PASSWORD;
    
    if (isEmailConfigured) {
      try {
        await sendEmail({
          email: invite.email,
          subject: 'Admin Invitation - Intlakaa',
          html,
        });
        console.log('Email sent successfully to:', invite.email);
      } catch (emailError) {
        console.error('Email sending failed:', emailError.message);
        // Delete the invite if email fails
        await AdminInvite.findByIdAndDelete(invite._id);
        
        return res.status(500).json({
          success: false,
          message: 'Failed to send invitation email. Please check email configuration.',
          error: emailError.message,
          hint: 'Make sure EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASSWORD, and EMAIL_FROM are set in .env',
        });
      }
    } else {
      console.warn('⚠️  Email not configured. Running in development mode.');
      console.log('📧 Invite URL:', inviteUrl);
      console.log('🔑 Token:', token);
    }

    res.status(200).json({
      success: true,
      message: isEmailConfigured 
        ? 'Invite sent successfully' 
        : 'Invite created successfully (Email not configured - Development Mode)',
      data: {
        email: invite.email,
        expiresAt: invite.expiresAt,
        // Include token in development mode for testing
        ...(isEmailConfigured ? {} : { token, inviteUrl }),
      },
    });
  } catch (error) {
    // Handle duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'An invite with this email or token already exists',
      });
    }

    // Handle other errors
    res.status(500).json({
      success: false,
      message: 'Server error while sending invite',
      error: error.message,
    });
  }
};

// @desc    Invite new admin
// @route   POST /api/admins/invite
// @access  Private (Owner only)
export const inviteAdmin = async (req, res, next) => {
  try {
    const { name, email, role } = req.body;

    // Validate input
    if (!name || !email) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name and email',
      });
    }

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email });

    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: 'Admin with this email already exists',
      });
    }

    // Generate invite token
    const inviteToken = crypto.randomBytes(32).toString('hex');
    const inviteExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // Create admin
    const admin = await Admin.create({
      name,
      email,
      role: role || 'admin',
      inviteToken,
      inviteExpires,
    });

    // Create invite URL
    const inviteUrl = `${process.env.FRONTEND_URL}/admin/accept-invite#token=${inviteToken}`;

    // Email HTML
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #4F46E5; color: white; padding: 20px; text-align: center; }
          .content { background-color: #f9f9f9; padding: 30px; }
          .button { display: inline-block; padding: 12px 30px; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to Intlakaa</h1>
          </div>
          <div class="content">
            <h2>Hello ${name},</h2>
            <p>You have been invited to join Intlakaa as an admin.</p>
            <p>Please click the button below to accept your invitation and set your password:</p>
            <a href="${inviteUrl}" class="button">Accept Invitation</a>
            <p>Or copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #4F46E5;">${inviteUrl}</p>
            <p><strong>Note:</strong> This invitation will expire in 1 hour.</p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Intlakaa. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Send email
    await sendEmail({
      email: admin.email,
      subject: 'Admin Invitation - Intlakaa',
      html,
    });

    res.status(201).json({
      success: true,
      message: 'Invitation sent successfully',
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify invite token
// @route   GET /api/auth/verify-invite
// @access  Public
export const verifyInvite = async (req, res, next) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Token is required',
      });
    }

    // Find invite with valid token using AdminInvite model
    const invite = await AdminInvite.findOne({
      token: token,
      expiresAt: { $gt: Date.now() },
      accepted: false,
    });

    if (!invite) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired invitation token',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Token is valid',
      data: {
        email: invite.email,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Accept invite and set password
// @route   POST /api/auth/accept-invite
// @access  Public
export const acceptInvite = async (req, res, next) => {
  try {
    const { token, password, name } = req.body;

    // Validate input
    if (!token || !password) {
      return res.status(400).json({
        success: false,
        message: 'Token and password are required',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters',
      });
    }

    // Find invite with valid token using AdminInvite model
    const invite = await AdminInvite.findOne({
      token: token,
      expiresAt: { $gt: Date.now() },
      accepted: false,
    });

    if (!invite) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired invitation token',
      });
    }

    // Check if admin already exists with this email
    let admin = await Admin.findOne({ email: invite.email });

    if (admin) {
      // Admin exists, just update password
      admin.password = password;
      if (name) admin.name = name;
      await admin.save();
    } else {
      // Create new admin
      admin = await Admin.create({
        name: name || invite.email.split('@')[0],
        email: invite.email,
        password: password,
        role: 'admin',
      });
    }

    // Mark invite as accepted
    invite.accepted = true;
    await invite.save();

    // Generate JWT token
    const jwtToken = generateToken(admin._id);

    res.status(200).json({
      success: true,
      message: 'Password set successfully',
      token: jwtToken,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    next(error);
  }
};


// @desc    Get all admins (including pending invites)
// @route   GET /api/admins
// @access  Private (Owner only)
export const getAdmins = async (req, res, next) => {
  try {
    // Get accepted admins
    const admins = await Admin.find().select('-password -inviteToken');

    // Get pending invites (not expired and not accepted)
    const pendingInvites = await AdminInvite.find({
      accepted: false,
      expiresAt: { $gt: Date.now() },
    });

    // Format admins with status
    const formattedAdmins = admins.map(admin => ({
      _id: admin._id,  // For backward compatibility
      id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
      status: 'active',
      accepted: true,  // Active admins have accepted the invite
      createdAt: admin.createdAt,
    }));

    // Format pending invites with status
    const formattedInvites = pendingInvites.map(invite => ({
      _id: invite._id,  // For backward compatibility
      id: invite._id,
      name: null, // No name yet
      email: invite.email,
      role: 'admin', // Default role for invites
      status: 'pending',
      accepted: false,  // Pending invites not accepted yet
      createdAt: invite.createdAt,
      expiresAt: invite.expiresAt,
    }));

    // Combine both arrays
    const allUsers = [...formattedAdmins, ...formattedInvites];

    res.status(200).json({
      success: true,
      count: allUsers.length,
      admins: allUsers, // Keep the same key name for frontend compatibility
      stats: {
        active: formattedAdmins.length,
        pending: formattedInvites.length,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete admin or pending invite
// @route   DELETE /api/admins/:id
// @access  Private (Owner only)
export const deleteAdmin = async (req, res, next) => {
  try {
    console.log('🗑️ Delete request for ID:', req.params.id);
    
    // Try to find in Admin collection first
    const admin = await Admin.findById(req.params.id);

    if (admin) {
      // Prevent deleting owner
      if (admin.role === 'owner') {
        return res.status(403).json({
          success: false,
          message: 'Cannot delete owner account',
        });
      }

      await admin.deleteOne();
      console.log('✅ Admin deleted:', admin.email);

      return res.status(200).json({
        success: true,
        message: 'Admin deleted successfully',
      });
    }

    // If not found in Admin, try AdminInvite collection
    const invite = await AdminInvite.findById(req.params.id);

    if (invite) {
      await invite.deleteOne();
      console.log('✅ Pending invite deleted:', invite.email);

      return res.status(200).json({
        success: true,
        message: 'Pending invite deleted successfully',
      });
    }

    // Not found in either collection
    return res.status(404).json({
      success: false,
      message: 'Admin or invite not found',
    });
  } catch (error) {
    console.error('❌ Error deleting:', error);
    next(error);
  }
};

// @desc    Update admin
// @route   PUT /api/admins/:id
// @access  Private (Owner only)
export const updateAdmin = async (req, res, next) => {
  try {
    console.log('🔄 Update admin request received');
    console.log('📋 Admin ID:', req.params.id);
    console.log('📝 Update data:', req.body);
    
    const { name, email, role } = req.body;
    
    const admin = await Admin.findById(req.params.id);

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found',
      });
    }

    // Update fields if provided
    console.log('📊 Current admin data:', { name: admin.name, email: admin.email, role: admin.role });
    
    if (name) {
      console.log('✏️ Updating name:', name);
      admin.name = name;
    }
    if (email) {
      console.log('✏️ Updating email:', email);
      admin.email = email;
    }
    if (role) {
      console.log('✏️ Updating role from', admin.role, 'to', role);
      admin.role = role;
    }

    console.log('💾 Saving admin with data:', { name: admin.name, email: admin.email, role: admin.role });
    await admin.save();
    console.log('✅ Admin saved successfully');

    res.status(200).json({
      success: true,
      message: 'Admin updated successfully',
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error('❌ Error updating admin:', error);
    next(error);
  }
};
