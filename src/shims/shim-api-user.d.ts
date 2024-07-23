// src/shims/shim-api-user.d.ts

declare module "@browser-module/api/user" {
  export function isGuest(): boolean;
  export function isLogined(): boolean;
  export function isAdmin(): boolean;
  export function getUserLogin(): string;
  export function login(name: string, password: string): Promise<boolean>;
  export function logout(): Promise<void>;
  export function getUserPermissions(): string[];
  export function getExpiredInSeconds(): number;
}
