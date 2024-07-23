// /srcstores/userStore.ts
import { defineStore } from 'pinia';

interface UserState {
  payload: string;
}

interface UserPayload {
  login: string;
  permissions: string[];
  exp: number;
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    payload: '',
  }),
  actions: {
    async login(name: string, password: string): Promise<boolean> {
      const isValid = await testLogin(name, password);
      if (isValid) {
        const token = generatePayload(name); // Generate JWT
        this.payload = token;
        return true;
      }
      return false;
    },
    async logout(): Promise<void> {
      this.payload = '';
    },
    isGuest(): boolean {
      return !this.payload || this.isExpired();
    },
    isLogined(): boolean {
      return !!this.payload && !this.isExpired();
    },
    getLogin(): string {
      if (this.isExpired()) return '';
      const decoded = decodeJWT(this.payload);
      return decoded ? decoded.login : '';
    },
    isAdmin(): boolean {
      if (this.isExpired()) return false;
      const decoded = decodeJWT(this.payload);
      return decoded ? decoded.permissions.includes('admin') : false;
    },
    getPermissions(): string[] {
      if (this.isExpired()) return [];
      const decoded = decodeJWT(this.payload);
      return decoded ? decoded.permissions : [];
    },
    isExpired(): boolean {
      const decoded = decodeJWT(this.payload);
      return decoded ? decoded.exp <= Date.now() : true;
    },
    getExpiredTime(): number {
      const decoded = decodeJWT(this.payload);
      return decoded ? decoded.exp : 0;
    },
    getExpiredInSeconds(): number {
      if (this.isExpired()) return 0;

      const expirationTime = this.getExpiredTime();
      const currentTime = Date.now();
      const timeRemaining = Math.floor((expirationTime - currentTime)/1000);
      return timeRemaining > 0 ? timeRemaining : 0;
    }
  },
  persist: true
});

// Mock login function for demonstration purposes
async function testLogin(name: string, password: string): Promise<boolean> {
  if (name === '' || name !== password) {
    return false; // wrong user name or password
  }

  const userPermissions = [
    'account', 
    'rumors', 
    'app4', 'app5', 'app6', 'app7', 'app8', 'app9', 
    // 'app10', 
    'app11', 'app12', 'app13', 'app14', 'app15', 'app16', 'app17', 'app18'
  ];

  if (name === 'admin') {
    userPermissions.push('admin');
  }

  console.log('Logged in as user with login', name, 'userPermissions', userPermissions);

  return true;
}

// Mock
function generatePayload(name: string): string {
  const payload: UserPayload = {
    login: name,
    permissions: [
        'account', 'rumors', 'app4', 'app5', 'app6', 'app7', 'app8', 'app9', 
        ...(name === 'admin' ? ['admin'] : [])
    ],
    exp: Date.now() + 10*60000
  };
  return btoa(JSON.stringify(payload)); 
}

// Mock
function decodeJWT(token: string): UserPayload | null {
    try {
      if (!token) {
        return null;
      }
      const data = atob(token);
      return JSON.parse(data) as UserPayload;
    } catch (e) {
      console.error('Failed to decode payload', e);
      return null;
    }
}