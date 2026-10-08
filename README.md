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
Backend ต้องมี MONGO_URL ที่ reference จากบริการ MongoDB และ JWT_TOKEN ที่สุ่มอย่างปลอดภัย
ห้ามใส่ JWT_TOKEN หรือรหัสผ่านฐานข้อมูลไว้ในตัวแปร VITE_* เพราะจะส่งไปยังเบราว์เซอร์

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
ยังไม่ได้ตรวจสอบการเชื่อมต่อ Backend จริง ณ เวลาจัดทำไฟล์นี้
