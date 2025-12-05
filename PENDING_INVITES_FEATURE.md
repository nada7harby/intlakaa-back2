# ✅ تم تحديث جدول المستخدمين ليشمل Pending Invites!

## 🎯 التحديث:

الآن `GET /api/admins` يرجع:
- ✅ **Active Admins** - المستخدمين المقبولين
- ✅ **Pending Invites** - الدعوات المرسلة لكن لم تُقبل بعد

---

## 📋 Response Structure:

```json
{
  "success": true,
  "count": 5,
  "stats": {
    "active": 3,
    "pending": 2
  },
  "admins": [
    {
      "id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "owner",
      "status": "active",
      "createdAt": "2025-12-05T10:00:00.000Z"
    },
    {
      "id": "507f1f77bcf86cd799439012",
      "name": null,
      "email": "pending@example.com",
      "role": "admin",
      "status": "pending",
      "createdAt": "2025-12-05T12:00:00.000Z",
      "expiresAt": "2025-12-05T13:00:00.000Z"
    }
  ]
}
```

---

## 🔍 الفرق بين Active و Pending:

### **Active Admin:**
```json
{
  "id": "...",
  "name": "John Doe",        ← اسم موجود
  "email": "john@...",
  "role": "owner",
  "status": "active",        ← حالة: نشط
  "createdAt": "..."
}
```

### **Pending Invite:**
```json
{
  "id": "...",
  "name": null,              ← لا يوجد اسم بعد
  "email": "pending@...",
  "role": "admin",
  "status": "pending",       ← حالة: معلق
  "createdAt": "...",
  "expiresAt": "..."         ← تاريخ انتهاء الصلاحية
}
```

---

## 🎨 في الـ Frontend:

يمكنك الآن عرض الاتنين في نفس الجدول:

```tsx
{admins.map((user) => (
  <tr key={user.id}>
    <td>{user.name || '(Pending)'}</td>
    <td>{user.email}</td>
    <td>{user.role}</td>
    <td>
      {user.status === 'active' ? (
        <Badge color="green">Active</Badge>
      ) : (
        <Badge color="yellow">Pending Invite</Badge>
      )}
    </td>
    <td>
      {user.status === 'pending' && (
        <Button onClick={() => resendInvite(user.email)}>
          Resend
        </Button>
      )}
      <Button onClick={() => deleteUser(user.id)}>
        Delete
      </Button>
    </td>
  </tr>
))}
```

---

## 📊 Stats:

الآن الـ response يحتوي على إحصائيات:

```json
"stats": {
  "active": 3,    // عدد المستخدمين النشطين
  "pending": 2    // عدد الدعوات المعلقة
}
```

يمكنك عرضها في الـ UI:
```
Total Users: 5
Active: 3 | Pending: 2
```

---

## 🚀 الخطوات:

### **1. أعد تشغيل السيرفر:**
```bash
npm run dev
```

### **2. جرب الـ endpoint:**
```bash
GET /api/admins
```

### **3. النتيجة:**
ستحصل على قائمة تحتوي على:
- ✅ جميع الـ admins النشطين
- ✅ جميع الدعوات المعلقة (pending)

---

## 💡 ملاحظات:

### **Pending Invites:**
- ✅ تظهر فقط الدعوات **غير المنتهية**
- ✅ تظهر فقط الدعوات **غير المقبولة**
- ✅ `name` يكون `null` لأنه لم يُسجل بعد
- ✅ `expiresAt` يوضح متى تنتهي الدعوة

### **Active Admins:**
- ✅ المستخدمين الذين قبلوا الدعوة
- ✅ لديهم `name` و `role`
- ✅ `status` يكون `active`

---

## 🎯 الفوائد:

1. ✅ **رؤية شاملة** - ترى الجميع في مكان واحد
2. ✅ **إدارة أفضل** - تعرف من لم يقبل الدعوة
3. ✅ **إعادة إرسال** - يمكنك إعادة إرسال الدعوة
4. ✅ **حذف** - يمكنك حذف الدعوات المعلقة

---

**الآن جدول المستخدمين يعرض الجميع!** 🎉
