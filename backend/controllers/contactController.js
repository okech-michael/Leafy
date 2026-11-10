import { randomUUID } from 'node:crypto'

const contactMessages = []

export async function createContactMessage(req, res) {
  const contactMessage = {
    id: randomUUID(),
    ...req.body,
    status: 'new',
    createdAt: new Date().toISOString(),
  }
  contactMessages.push(contactMessage)
  res.status(201).json({
    success: true,
    message: 'Your message was received',
    contactMessage: {
      id: contactMessage.id,
      name: contactMessage.name,
      email: contactMessage.email,
      topic: contactMessage.topic,
      status: contactMessage.status,
      createdAt: contactMessage.createdAt,
    },
  })
}
