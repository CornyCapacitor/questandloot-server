import { Request } from "express";
import { Types } from "mongoose";

export type RequestUser = Request & {
  user: {
    _id: Types.ObjectId
  }
}

export type RequestUserWithData = RequestUser & {
  oldPassword: string,
  newPassword: string
}