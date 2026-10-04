// src/config/apiConfig.ts

const BASE_URL: string = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const API_ENDPOINTS = {
  GET_STATUS: `${BASE_URL}/api/status`,
  LOGIN: `${BASE_URL}/api/login`,
  REGISTER: `${BASE_URL}/api/register`,
  GET_ROLES: `${BASE_URL}/api/roles`,
  GET_USER: `${BASE_URL}/api/user`,
  GET_USER_INFO: `${BASE_URL}/api/user-info`,
  GET_USERS: `${BASE_URL}/api/users`,
  GET_CLASSES: `${BASE_URL}/api/classes`,
  GET_PROGRAM_NAME: `${BASE_URL}/api/program-name`,
  GET_SKILLS: `${BASE_URL}/api/skills`,

  // ── Bài đọc & các bảng phụ ──
  GET_BAI_DOC: `${BASE_URL}/api/bai-doc`,
  GET_DOAN_VAN: `${BASE_URL}/api/doan-van`,
  GET_AM_THANH_BAI_DOC: `${BASE_URL}/api/am-thanh-bai-doc`,
  GET_TU_KHO: `${BASE_URL}/api/tu-kho`,
  GET_CAU_HOI_BAI_DOC: `${BASE_URL}/api/cau-hoi-bai-doc`,
} as const;

export type ApiEndpointKey = keyof typeof API_ENDPOINTS;

export default BASE_URL;
