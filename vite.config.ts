import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "For-Sai", // <--- ใส่ชื่อ Repo ที่ตั้งใน GitHub ตรงนี้ (อย่าลืม / ปิดหัวท้าย)
})