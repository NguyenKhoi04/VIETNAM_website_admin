// src/config/apiConfig.ts
// Đọc BASE_URL từ biến môi trường Vite (.env → VITE_API_URL)
// Fallback về localhost:5000 nếu chưa cấu hình .env
const BASE_URL: string = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const API_ENDPOINTS = {
  GET_STATUS:       `${BASE_URL}/api/status`,
  LOGIN:            `${BASE_URL}/api/login`,
  REGISTER:         `${BASE_URL}/api/register`,
  GET_ROLES:        `${BASE_URL}/api/roles`,
  GET_USER:         `${BASE_URL}/api/user`,
  GET_USER_INFO:    `${BASE_URL}/api/user-info`,
  GET_USERS:        `${BASE_URL}/api/users`,       // danh sách toàn bộ người dùng
  GET_CLASSES:      `${BASE_URL}/api/classes`,
  GET_PROGRAM_NAME: `${BASE_URL}/api/program-name`,
  GET_SKILLS:       `${BASE_URL}/api/skills`,
} as const;

export type ApiEndpointKey = keyof typeof API_ENDPOINTS;

export default BASE_URL;
