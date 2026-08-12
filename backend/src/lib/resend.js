import { Resend } from "resend"
import "dotenv/config"

const apiKey = process.env.RESEND_API_KEY
export const resendClient = new Resend(apiKey)

export const sender = {
    email: process.env.EMAIL_FROM || "onboarding@resend.dev",
    name: process.env.EMAIL_FROM_NAME || "Chatify"
}
