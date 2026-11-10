import express from 'express'
import { body } from 'express-validator'
import { createContactMessage } from '../controllers/contactController.js'
import validateRequest from '../middleware/validationMiddleware.js'

const router = express.Router()

router.post(
  '/',
  [
    body('name').trim().isLength({ min: 2, max: 120 }).withMessage('Name is required'),
    body('email').isEmail().withMessage('Enter a valid email address').normalizeEmail(),
    body('topic').isIn(['General question', 'Volunteering', 'Partnership', 'Community initiative', 'Story consent']).withMessage('Select a valid topic'),
    body('message').trim().isLength({ min: 1, max: 5000 }).withMessage('Message is required'),
  ],
  validateRequest,
  createContactMessage
)

export default router
