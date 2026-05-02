export type Role = 'admin' | 'user';

export interface User {
  username: string;
  role: Role;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
}
