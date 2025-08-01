import { jwtDecode } from "jwt-decode";

interface JwtPayload {
  exp: number;
}

export function isTokenExpired(token: string | null): boolean {
  if (!token) return true;

  try {
    const decoded = jwtDecode<JwtPayload>(token);
    const currentTime = Date.now() / 1000; // seconds
    return decoded.exp < currentTime;
  } catch {
    return true;
  }
}
