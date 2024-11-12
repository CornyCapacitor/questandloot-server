import bcrypt from 'bcrypt';
import mongoose from "mongoose";
import validator from 'validator';
import { User, UserDocument, UserModel } from '../types/user';
mongoose.set('strictQuery', true)

const Schema = mongoose.Schema

const userSchema = new Schema<User>({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    minLength: [3, 'Username must be at least 3 characters long'],
    maxLength: [30, 'Username cannot exceed 30 characters']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minLength: [6, 'Password must be at least 6 characters long']
  }
}, { timestamps: true })

// Static signup method
userSchema.statics.signup = async function (username, password) {
  if (!username || !password) {
    throw Error('All fields are required')
  }

  if (!validator.isStrongPassword(password)) {
    throw Error('Password not strong enough')
  }

  const duplicate = await this.findOne({ username: username })

  if (duplicate) {
    throw Error('Username is already taken')
  }

  const saltRounds = 15
  const salt = await bcrypt.genSalt(saltRounds)
  const hashedPassword = await bcrypt.hash(password, salt)

  const user = await this.create({ username: username, password: hashedPassword })

  return user
}

// Static login method
userSchema.statics.login = async function (username, password) {
  if (!username || !password) {
    throw Error('All fields are required')
  }

  const user = await this.findOne({ username: username })

  if (!user) {
    throw Error('User not found')
  }

  const match = await bcrypt.compare(password, user.password)

  if (!match) {
    throw Error('Incorrect password')
  }

  return user
}

const userModel = mongoose.model<UserDocument, UserModel>('User', userSchema)

export default userModel