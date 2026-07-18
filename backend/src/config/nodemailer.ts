import nodemailer from "nodemailer"

const email = process.env.NODE_MAILER_EMAIL
const password = process.env.NODE_MAILER_PASSWORD

export const transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: email,
        pass: password
    }
})