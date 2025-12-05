# ✅ تم إضافة Update Admin Endpoint

## 🎯 الميزة الجديدة:
الآن يمكن للـ Owner تحديث بيانات الـ Admins بما في ذلك:
- الاسم (name)
- البريد الإلكتروني (email)  
- الصلاحية (role)

---

## 📋 API Endpoint:

### **PUT /api/admins/:id**

**Headers:**
```
Authorization: Bearer <owner_jwt_token>
```

**Request Body:**
```json
{
  "name": "New Name",
  "email": "newemail@example.com",
  "role": "admin"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Admin updated successfully",
  "admin": {
    "id": "507f1f77bcf86cd799439011",
    "name": "New Name",
    "email": "newemail@example.com",
    "role": "admin"
  }
}
```

---

## 🔒 الحماية الأمنية:

1. ✅ **Owner Only** - فقط الـ Owner يمكنه تحديث الـ Admins
2. ✅ **Cannot Change Owner Role** - لا يمكن تغيير صلاحية الـ Owner
3. ✅ **Cannot Set Role to Owner** - لا يمكن ترقية admin إلى owner
4. ✅ **Protected Route** - يتطلب JWT token صالح

---

## ⚠️ رسائل الخطأ:

### **404 - Admin Not Found**
```json
{
  "success": false,
  "message": "Admin not found"
}
```

### **403 - Cannot Change Owner Role**
```json
{
  "success": false,
  "message": "Cannot change owner role"
}
```

### **401 - Not Authorized**
```json
{
  "success": false,
  "message": "Not authorized to access this route"
}
```

### **403 - Owner Only**
```json
{
  "success": false,
  "message": "Access denied. Owner role required."
}
```

---

## 🚀 الخطوات التالية:

### **1. أعد تشغيل السيرفر:**
```bash
# Ctrl + C
npm run dev
```

### **2. جرب تحديث صلاحيات Admin:**
من صفحة إدارة الـ Admins، اختر admin وغيّر صلاحيته.

### **3. النتيجة المتوقعة:**
✅ تحديث ناجح  
✅ تظهر الصلاحية الجديدة في القائمة  
✅ لا توجد أخطاء

---

## 📝 ملاحظات:

- **الحقول اختيارية**: يمكنك تحديث حقل واحد أو أكثر
- **Owner محمي**: لا يمكن تغيير صلاحية الـ Owner
- **Email Validation**: سيتم التحقق من صحة البريد الإلكتروني
- **Unique Email**: البريد الإلكتروني يجب أن يكون فريد

---

## ✨ الآن:

1. ✅ أعد تشغيل السيرفر
2. ✅ جرب تحديث صلاحيات admin
3. ✅ يجب أن يعمل بنجاح! 🎉

**جرب الآن!** 🚀
