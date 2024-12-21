import { Request } from 'express';

declare module 'express' {
  interface UserPayload {
    id: number;
    username: string;
  }

  interface Request {
    user?: UserPayload;
  }
}
