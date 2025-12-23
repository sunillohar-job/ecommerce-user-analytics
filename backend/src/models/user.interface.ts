export interface User {
  userId: string;
  createdAt: string;
  lastActiveAt: string;
  fname: string;
  lname: string;
  age: number;
  country: string;
  language: string;
  metadata?: Record<string, any>;
}
