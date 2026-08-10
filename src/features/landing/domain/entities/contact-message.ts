export interface ContactMessage {
  name: string
  email: string
  phone: string
  message: string
}

export interface SendContactMessageResult {
  success: boolean
  message: string
}

export interface ContactMessageSender {
  send(message: ContactMessage): Promise<SendContactMessageResult>
}
