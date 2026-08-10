import emailjs from '@emailjs/browser'
import type {
  ContactMessage,
  ContactMessageSender,
  SendContactMessageResult,
} from '@/features/landing/domain/entities/contact-message'
import { brand } from '@/shared/constants/brand'

function getEmailJsConfig() {
  const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID
  const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
  const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY

  if (!serviceId || !templateId || !publicKey) {
    throw new Error(
      'EmailJS is not configured. Set VITE_EMAILJS_SERVICE_ID, VITE_EMAILJS_TEMPLATE_ID and VITE_EMAILJS_PUBLIC_KEY.',
    )
  }

  return { serviceId, templateId, publicKey }
}

export class EmailJsContactSender implements ContactMessageSender {
  async send(message: ContactMessage): Promise<SendContactMessageResult> {
    try {
      const { serviceId, templateId, publicKey } = getEmailJsConfig()

      await emailjs.send(
        serviceId,
        templateId,
        {
          to_email: brand.contact.email,
          to_name: brand.name,
          from_name: message.name,
          from_email: message.email,
          reply_to: message.email,
          phone: message.phone || 'Not provided',
          message: message.message,
          subject: `New quotation request from ${message.name}`,
        },
        {
          publicKey,
        },
      )

      return {
        success: true,
        message: 'Thanks! Your message was sent successfully.',
      }
    } catch (error) {
      console.error('EmailJS contact send failed:', error)

      return {
        success: false,
        message:
          'We could not send your message right now. Please try again or email us directly.',
      }
    }
  }
}

export const emailJsContactSender = new EmailJsContactSender()
