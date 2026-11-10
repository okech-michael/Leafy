import express from 'express'
import { body } from 'express-validator'
import { signup, signin } from '../controllers/authController.js'
import { loginRateLimit } from '../middleware/loginRateLimit.js'
import validateRequest from '../middleware/validationMiddleware.js'

const router = express.Router()
const email = body('email').isEmail().withMessage('Enter a valid email address').normalizeEmail()
const password = body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters')

router.post(
  '/signup',
  [
    body('name').trim().isLength({ min: 2, max: 120 }).withMessage('Name must be between 2 and 120 characters'),
    email,
    body('phone').trim().matches(/^\+?[0-9\s()-]{7,20}$/).withMessage('Enter a valid phone number'),
    password,
    body('confirmPassword').custom((value, { req }) => value === req.body.password).withMessage('Passwords do not match'),
  ],
  validateRequest,
  signup
)

router.post('/signin', loginRateLimit, [email, body('password').notEmpty().withMessage('Password is required')], validateRequest, signin)

export default router
