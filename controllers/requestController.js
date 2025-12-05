import Request from '../models/Request.js';
import sendEmail from '../utils/sendEmail.js';

// @desc    Create new request
// @route   POST /api/requests
// @access  Public
export const createRequest = async (req, res, next) => {
  try {
    console.log('📝 Received request data:', req.body);
    console.log('📋 Field details:', {
      name: { value: req.body.name, type: typeof req.body.name },
      phone: { value: req.body.phone, type: typeof req.body.phone },
      store_url: { value: req.body.store_url, type: typeof req.body.store_url },
      monthly_sales: { value: req.body.monthly_sales, type: typeof req.body.monthly_sales },
      monthly_salary: { value: req.body.monthly_salary, type: typeof req.body.monthly_salary },
    });
    
    const { name, phone, store_url } = req.body;
    // Accept both monthly_sales (from frontend) and monthly_salary (legacy)
    const monthly_salary = req.body.monthly_sales || req.body.monthly_salary;

    // Validate input
    if (!name || !phone || !store_url || !monthly_salary) {
      console.log('❌ Missing fields:', { 
        name: !name ? 'MISSING' : 'OK', 
        phone: !phone ? 'MISSING' : 'OK', 
        store_url: !store_url ? 'MISSING' : 'OK', 
        monthly_salary: !monthly_salary ? 'MISSING' : 'OK' 
      });
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields',
        missing: {
          name: !name,
          phone: !phone,
          store_url: !store_url,
          monthly_salary: !monthly_salary,
        },
      });
    }

    // Create request - monthly_salary is now a string, no conversion needed
    const request = await Request.create({
      name,
      phone,
      store_url,
      monthly_salary, // Keep as string
    });

    console.log('✅ Request created successfully:', request._id);

    // Send email notification to admin - Modern Creative Design
    const emailHTML = `
      <!DOCTYPE html>
      <html dir="rtl" lang="ar">
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
            direction: rtl;
          }
          .email-wrapper {
            max-width: 650px;
            margin: 0 auto;
            background: white;
            border-radius: 20px;
            overflow: hidden;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
          }
          .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 40px 30px;
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
            font-size: 56px;
            margin-bottom: 15px;
            animation: bounce 2s infinite;
          }
          @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
          }
          .header h1 {
            color: white;
            font-size: 28px;
            font-weight: 700;
            margin: 0;
            position: relative;
            z-index: 1;
          }
          .header p {
            color: rgba(255,255,255,0.9);
            font-size: 15px;
            margin-top: 8px;
            position: relative;
            z-index: 1;
          }
          .content {
            padding: 40px 35px;
            background: white;
          }
          .greeting {
            font-size: 22px;
            color: #1f2937;
            margin-bottom: 25px;
            font-weight: 600;
            text-align: center;
          }
          .intro-text {
            font-size: 16px;
            color: #4b5563;
            text-align: center;
            margin-bottom: 30px;
            line-height: 1.8;
          }
          .highlight {
            color: #667eea;
            font-weight: 700;
          }
          .info-card {
            background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
            border-radius: 15px;
            padding: 25px;
            margin: 20px 0;
            border-right: 5px solid #667eea;
            box-shadow: 0 4px 15px rgba(0,0,0,0.05);
          }
          .info-row {
            margin: 18px 0;
            padding: 15px;
            background: white;
            border-radius: 10px;
            transition: transform 0.2s ease;
            border: 1px solid #e5e7eb;
          }
          .info-row:hover {
            transform: translateX(-5px);
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.15);
          }
          .label {
            font-weight: 700;
            color: #667eea;
            font-size: 15px;
            margin-bottom: 8px;
            text-align: right;
          }
          .value {
            color: #1f2937;
            font-size: 16px;
            font-weight: 500;
            text-align: right;
            word-break: break-word;
          }
          .cta-box {
            background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
            border-right: 4px solid #f59e0b;
            padding: 20px;
            border-radius: 12px;
            margin: 30px 0;
            text-align: center;
          }
          .cta-box-title {
            font-size: 17px;
            font-weight: 700;
            color: #92400e;
            margin-bottom: 10px;
          }
          .cta-button {
            display: inline-block;
            padding: 14px 35px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white !important;
            text-decoration: none;
            border-radius: 50px;
            font-size: 16px;
            font-weight: 600;
            box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
            margin-top: 10px;
          }
          .stats-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
            margin: 25px 0;
          }
          .stat-box {
            background: linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%);
            padding: 20px;
            border-radius: 12px;
            text-align: center;
            border: 2px solid #c4b5fd;
          }
          .stat-value {
            font-size: 24px;
            font-weight: 700;
            color: #5b21b6;
            margin-bottom: 5px;
          }
          .stat-label {
            font-size: 13px;
            color: #6b21a8;
            font-weight: 600;
          }
          .footer {
            background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%);
            padding: 30px;
            text-align: center;
            border-top: 2px solid #e5e7eb;
          }
          .footer-text {
            font-size: 13px;
            color: #6b7280;
            margin-bottom: 8px;
          }
          .footer-brand {
            font-weight: 700;
            color: #667eea;
          }
          .divider {
            height: 2px;
            background: linear-gradient(90deg, transparent, #667eea, transparent);
            margin: 25px 0;
          }
        </style>
      </head>
      <body>
        <div class="email-wrapper">
          <!-- Header -->
          <div class="header">

            <h1>طلب جديد من Intlakaa!</h1>
            <p>تم استلام طلب استشارة جديد</p>
          </div>

          <!-- Content -->
          <div class="content">
            <div class="greeting">مرحباً</div>
            
            <p class="intro-text">
              تم استلام طلب جديد من العميل <span class="highlight">${name}</span>
              <br>
              يرجى مراجعة التفاصيل أدناه والتواصل مع العميل في أقرب وقت ممكن.
            </p>

            <div class="divider"></div>

            <!-- Client Information Card -->
            <div class="info-card">
              <div class="info-row">
                <div class="label">اسم العميل</div>
                <div class="value">${name}</div>
              </div>
              
              <div class="info-row">
                <div class="label">رقم الهاتف</div>
                <div class="value">${phone}</div>
              </div>
              
              <div class="info-row">
                <div class="label">رابط المتجر</div>
                <div class="value">${store_url}</div>
              </div>
              
              <div class="info-row">
                <div class="label">المبيعات الشهرية</div>
                <div class="value">${monthly_salary}</div>
              </div>
              
              <div class="info-row">
                <div class="label">تاريخ ووقت الطلب</div>
                <div class="value">${new Date().toLocaleString('ar-EG', { 
                  dateStyle: 'full', 
                  timeStyle: 'short' 
                })}</div>
              </div>
            </div>

            <p style="text-align: center; color: #9ca3af; font-size: 14px; margin-top: 25px;">
              يمكنك مراجعة جميع الطلبات من لوحة التحكم
            </p>
          </div>

          <!-- Footer -->
          <div class="footer">
            <p class="footer-text">
              © ${new Date().getFullYear()} <span class="footer-brand">Intlakaa</span> - جميع الحقوق محفوظة
            </p>
            <p class="footer-text">
              نظام إدارة الطلبات الذكي
            </p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Send email (don't wait for it, send in background)
    sendEmail({
      email: 'zoka.live2000@gmail.com',
      subject: `طلب جديد من ${name} - Intlakaa`,
      html: emailHTML,
    }).catch(err => {
      console.error('❌ Failed to send notification email:', err.message);
      // Don't fail the request if email fails
    });

    res.status(201).json({
      success: true,
      message: 'Request created successfully',
      request,
    });
  } catch (error) {
    console.error('❌ Error creating request:', error);
    next(error);
  }
};


// @desc    Get all requests
// @route   GET /api/requests
// @access  Private (Admin)
export const getRequests = async (req, res, next) => {
  try {
    const requests = await Request.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: requests.length,
      requests,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single request
// @route   GET /api/requests/:id
// @access  Private (Admin)
export const getRequest = async (req, res, next) => {
  try {
    const request = await Request.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found',
      });
    }

    res.status(200).json({
      success: true,
      request,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete request
// @route   DELETE /api/requests/:id
// @access  Private (Admin)
export const deleteRequest = async (req, res, next) => {
  try {
    const request = await Request.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found',
      });
    }

    await request.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Request deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
