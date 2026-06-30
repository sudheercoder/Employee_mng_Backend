Employee Management System - Backend

Ye ek simple Node.js + Express + MongoDB (Mongoose) based backend project hai. Isme Admin aur Employee dono ke liye login system hai, aur Admin employees aur departments ko manage kar sakta hai.

---


# Installation & Setup
* Clone the Repository

```bash
git clone https://github.com/your-username/employee-management-system.git
```

# Navigate to Backend

cd backend

# Install Dependencies

```bash
npm install
```

# Create `.env`

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
SECRET_KEY=your_secret_key
```

# Run Backend

nodemon index.js  OR node index.js


Project me kya kya hai

model/ -> Database ke schema (User, Employee, Department)
controllers/ -> Saari logic yahan likhi hai (kaam karne wala code)
routes/ -> API ke endpoints (URLs)
middleware/ -> Auth check karne wale functions

---

1. Models (Database Schema)

userModel.js
Ye users collection ka schema hai. Login ke liye use hota hai.

Field Type Note
name String optional
email String required, unique
password String required (hashed form me store hota hai)
role String admin ya employee, default employee

employeemodel.js
Ye employee collection ka schema hai. Employee ki details store karta hai.

Field Type Note
name String
email String required
departments String required
designation String required
status String Active ya Inactive, default Inactive
defaultPassword String naya employee banane par jo default password milta hai

departmentModel.js
Ye departments collection ka schema hai.

Field Type Note
name String required, unique

---

2. Middleware (Auth checking)

auth.js
Ye check karta hai ki request ke saath valid token aaya hai ya nahi.

- Header me token naam se JWT token bhejna hota hai.
- Agar token nahi mila to error "Token Not Found"
- Agar token galat ya expired hai to error "Invalid Token"
- Agar sahi hai to token ke andar ka data req.user me daal deta hai aur aage jaane deta hai.

adminAuth.js
Ye check karta hai ki login kiya hua user admin hai ya nahi.

- Pehle auth.js chalna chahiye, tabhi req.user milega.
- Agar role admin nahi hai to error "Access denied. Admins only."

Note: Dono middleware ek saath use hote hain jab kisi route ko sirf admin access kar sake. Pehle authMiddleware phir adminMiddleware.

---

3. Controllers (Logic)

userController.js
User ka register, login aur profile dekhne ka kaam.

- userRegister -> Naya user register karta hai (default role employee set hota hai). Password ko bcrypt se hash karke save karta hai.
- userLogin -> Email-password check karke login karta hai. Agar user employee hai aur uska status Inactive hai to login allow nahi hota. Login sahi hone par JWT token milta hai (1 hour valid).
- getProfile -> Login kiye hue user ki apni profile dikhata hai (password ke bina).

employeeController.js
Employee ka CRUD (Create, Read, Update, Delete) aur dashboard stats.

- createEmployee -> Naya employee banata hai. Saath hi ek login account (User) bhi bana deta hai with default password Employee@123.
- getAllEmployees -> Saare employees ki list deta hai. Search, pagination aur sorting ka support hai (query params: search, page, limit, sortBy, sortOrder).
- getEmployeeById -> ID se ek employee ki detail nikalta hai.
- updateEmployee -> Employee ki detail update karta hai.
- deleteEmployee -> Employee ko delete karta hai.
- getDashboardStats -> Total employees, total departments aur recent 5 employees ka data deta hai (Admin dashboard ke liye).

departmentController.js
Department ka CRUD.

- createDepartment -> Naya department banata hai (duplicate naam allow nahi).
- getAllDepartments -> Saare departments ki list deta hai (naam ke hisab se sorted).
- updateDepartment -> Department ka naam update karta hai.
- deleteDepartment -> Department delete karta hai.

---

4. Routes (API Endpoints)

userRoute.js (base: /api/user jaisa kuch hoga)
Method Endpoint Auth Required Kaam
POST /register Nahi Naya user register
POST /login Nahi Login karna
GET /get Haan (token) Apni profile dekhna

employeeRoute.js (base: /api/employee jaisa kuch hoga)
Sab routes Admin only hain (token + admin role dono chahiye).

Method Endpoint Kaam
GET /dashboard Dashboard stats dekhna
POST /create Naya employee banana
GET /get Saare employees ki list
GET /get/:id Ek employee ki detail
PUT /update/:id Employee update karna
DELETE /delete/:id Employee delete karna

departmentRoute.js (base: /api/department jaisa kuch hoga)
Method Endpoint Auth Required Kaam
GET /get Sirf login (token) Saare departments dekhna (dropdown ke liye)
POST /create Admin only Naya department banana
PUT /update/:id Admin only Department update karna
DELETE /delete/:id Admin only Department delete karna

---

5. Flow ka chota sa idea

1. User pehle /register se account banata hai ya Admin /employee/create se employee banata hai (jisme user account bhi auto-create hota hai).
1. User /login karta hai aur token milta hai.
1. Aage ki har protected request me header me token bhejna hota hai.
1. Admin wale routes ke liye role admin hona zaroori hai, warna access deny ho jayega.

---

6. Environment Variable

SECRET_KEY naam ka environment variable chahiye hoga JWT token banane aur verify karne ke liye (.env file me daalna).
  
---

Bas itna hi hai is project me. Simple login + employee + department management system hai with admin access control.
