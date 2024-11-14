import bcrypt from 'bcrypt'

export const hashPassword = async (password: string) => {
  const saltRounds = 15
  const salt = await bcrypt.genSalt(saltRounds)
  const hashedPassword = await bcrypt.hash(password, salt)

  return hashedPassword
}