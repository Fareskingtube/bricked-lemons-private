import nodemailer from "nodemailer"

const email = process.env.NODE_MAILER_EMAIL
const password = process.env.NODE_MAILER_PASSWORD

// Exit if email/password are empty
if (!email || !password) {
    console.error(
        "[mailer] Missing NODE_MAILER_EMAIL or NODE_MAILER_PASSWORD environment variable(s)."
    )
    process.exit(1)
}

// Creating nodemailer transport
export const transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: email,
        pass: password
    }
})

// Checking if credentials are correct
transport.verify((err) => {
    if (err) {
        console.error("[mailer] Failed to authenticate with SMTP server:", err.message)
        process.exit(1)
    }
})