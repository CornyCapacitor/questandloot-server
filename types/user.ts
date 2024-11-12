import { Document, Model } from 'mongoose';

export type User = Document & {
  username: string,
  password: string,
}

export type UserDocument = Document & User

export type UserModel = Model<UserDocument> & {
  signup(username: string, password: string): Promise<UserDocument>
  login(username: string, password: string): Promise<UserDocument>
}