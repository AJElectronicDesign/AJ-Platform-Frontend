import type {
  ContactMessage,
  ContactMessageSender,
  SendContactMessageResult,
} from '@/features/landing/domain/entities/contact-message'

export async function sendContactMessage(
  sender: ContactMessageSender,
  message: ContactMessage,
): Promise<SendContactMessageResult> {
  const normalized: ContactMessage = {
    name: message.name.trim(),
    email: message.email.trim(),
    phone: message.phone.trim(),
    message: message.message.trim(),
  }

  if (!normalized.name || !normalized.email || !normalized.message) {
    return {
      success: false,
      message: 'Please complete name, email and message before sending.',
    }
  }

  return sender.send(normalized)
}
