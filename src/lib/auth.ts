import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key';

export interface AuthUser {
    userId?: number;
    email: string;
    role: 'admin' | 'client';
}

export function signToken(payload: AuthUser) {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' });
}

export function verifyToken(token: string): AuthUser | null {
    try {
        return jwt.verify(token, JWT_SECRET) as AuthUser;
    } catch (error) {
        return null;
    }
}

export function getAuthToken() {
    const cookieStore = cookies();
    return cookieStore.get('auth_token')?.value;
}

export function getUser() {
    const token = getAuthToken();
    if (!token) return null;
    return verifyToken(token);
}

export function isAuthenticated() {
    return !!getUser();
}
