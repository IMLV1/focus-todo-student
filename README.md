# focus. — Student Edition

Frontend ปรับแต่งจาก https://github.com/korawit/todo-front สำหรับงาน Full Stack Integration

## เริ่มต้น
ใช้ Node.js 22.12 ขึ้นไป

```sh
npm ci
npm run dev
```

## เชื่อมต่อ Backend
สร้างไฟล์ .env จาก .env.example และตั้ง VITE_API_URL เป็น URL ของ Backend จาก https://github.com/korawit/todo-back แล้ว build ใหม่

```sh
npm run build
npm start
```

Railway: Build Command = npm run build; Start Command = npm start
ตั้ง VITE_API_URL ใน Variables ของบริการ Frontend ก่อน build
Backend ต้องมี MONGO_URL ที่ reference จากบริการ MongoDB และ JWT_SECRET ที่สุ่มอย่างปลอดภัย
ห้ามใส่ JWT_SECRET หรือรหัสผ่านฐานข้อมูลไว้ในตัวแปร VITE_* เพราะจะส่งไปยังเบราว์เซอร์

## สิ่งที่แก้ไข
- ออกแบบหน้า Login และ Dashboard ใหม่เป็นธีมสีเขียว focus.
- ภาษาไทย พร้อม responsive layout
- สรุปจำนวนงานและแถบความคืบหน้า
- เพิ่ม แก้ไข ลบ ทำเครื่องหมายเสร็จ ค้นหา และกรองสถานะ
- การเรียก API รอผลสำเร็จก่อนแสดงว่าบันทึกแล้ว พร้อมข้อความผิดพลาด
- มีโหมดตัวอย่างแยกจากบัญชีจริง เก็บข้อมูลตัวอย่างใน localStorage
- เก็บ session token ใน sessionStorage

## ภาพประกอบ
ภาพ todo-custom-demo.jpg เป็น screenshot จาก Frontend ที่ทำงานจริงในโหมดตัวอย่างบนเครื่อง
ภาพนี้ไม่ใช่หลักฐานว่า Backend, MongoDB หรือ Railway deploy สำเร็จ
ต้องแคป Railway Diagram จากบัญชี Railway หลัง deploy สำเร็จเท่านั้น

## การตรวจสอบ
Build ผ่าน และทดสอบเพิ่ม แก้ไข ทำเครื่องหมายเสร็จ ค้นหา ลบ ในโหมดตัวอย่างผ่านเบราว์เซอร์
ทดสอบ Backend /health, สมัครบัญชีทดสอบ, เข้าสู่ระบบ, เพิ่มงานผ่าน Frontend และ reload เพื่อตรวจว่าข้อมูลยังอยู่ใน MongoDB ผ่านแล้ว

## ระบบที่ deploy แล้ว
Frontend: https://focus-todo-student-production.up.railway.app/
Backend: https://todo-back-production-02b0.up.railway.app/health
GitHub (Private): https://github.com/IMLV1/focus-todo-student
Railway: https://railway.com/project/e707753c-5ebd-4e56-ab85-081a4b51ed86

ภาพ railway-diagram.jpg และ todo-live.jpg แคปจากระบบจริง ข้อมูลในหน้า Todo เป็นบัญชีทดสอบที่สร้างเพื่อทดสอบและถ่ายภาพ

