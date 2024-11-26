import {
  defineConfig
} from 'vite'
import react from '@vitejs/plugin-react'
import dotenv from "dotenv"

dotenv.config()

// https://vite.dev/config/
export default defineConfig({
    define: {
        "process.env": process.env,
    },
    proxy: {
        "/api": {
            // eslint-disable-next-line no-undef
            target: process.env.VITE_API_BASE_URL, // Use the environment variable
            changeOrigin: true,
        },
    },
    plugins: [react()],
})