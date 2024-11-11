import { Document } from 'mongoose';

export type User = Document & {
  username: string,
  password: string,
}