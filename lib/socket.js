// lib/socket.js (simplified)
import { io } from "socket.io-client";

const URL = process.env.NODE_ENV === 'production' 
  ? window.location.origin 
  : 'http://localhost:3000';

export const socket = typeof window !== "undefined" ? io(URL, {
  path: '/api/socket.io',
  autoConnect: false,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
}) : {
  on: () => {},
  emit: () => {},
  connect: () => {},
  disconnect: () => {},
  off: () => {}
};