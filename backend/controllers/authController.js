import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { randomUUID } from 'node:crypto'

const users = []

function createToken(userId) {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' })
}

function publicUser(user) {
  return { id: user.id, name: user.name, email: user.email, phone: user.phone }
}

export async function signup(req, res) {
  const { name, email, phone, password } = req.body
  const normalizedEmail = email.toLowerCase()
  const existingUser = users.find((user) => user.email === normalizedEmail)
  if (existingUser) {
    return res.status(409).json({ success: false, message: 'An account with that email already exists' })
  }

  const hashedPassword = await bcrypt.hash(password, 12)
  const user = { id: randomUUID(), name, email: normalizedEmail, phone, password: hashedPassword }
  users.push(user)

  res.status(201).json({
    success: true,
    message: 'Account created successfully',
    token: createToken(user.id),
    user: publicUser(user),
  })
}

export async function signin(req, res) {
  const { email, password } = req.body
  const user = users.find((item) => item.email === email.toLowerCase())
  const passwordMatches = user && await bcrypt.compare(password, user.password)

  if (!passwordMatches) {
    return res.status(401).json({ success: false, message: 'Invalid email or password' })
  }

  res.json({ success: true, message: 'Signed in successfully', token: createToken(user.id), user: publicUser(user) })
}
