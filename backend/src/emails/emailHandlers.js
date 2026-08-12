import { resendClient, sender } from "../lib/resend.js";

import { createWelcomeEmailTemplate } from "./emailTemplates.js";


export const sendWelcomeEmail = async (email, name, clientURL) => {
    if (!process.env.RESEND_API_KEY || !process.env.EMAIL_FROM) {
        throw new Error("Resend is not configured. Check RESEND_API_KEY and EMAIL_FROM in the backend .env file.")
    }

    const { data, error } = await resendClient.emails.send({
        from: `${sender.name} <${sender.email}>`,
        to: email,
        subject: "Welcome to Chatify",
        html: createWelcomeEmailTemplate(name, clientURL)
    })

    if (error) {
        console.log("Error sending welcome Email: ", error)
        throw new Error("Failed to send welcome Email")
    }

    console.log("Welcome Email Sent Successfully", data)
}