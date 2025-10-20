import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number.parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_PORT === "465",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
})

export async function sendEmail(to: string, subject: string, html: string) {
  try {
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM || "noreply@artverse.com",
      to,
      subject,
      html,
    })
    console.log("Email sent:", info.messageId)
    return info
  } catch (error) {
    console.error("Error sending email:", error)
    throw error
  }
}

export function getOrderConfirmationEmail(buyerName: string, orderItems: any[], total: number) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #2B7A8F 0%, #F5D5B8 100%); color: white; padding: 20px; border-radius: 8px; }
          .content { padding: 20px; background: #f9f9f9; margin: 20px 0; border-radius: 8px; }
          .item { padding: 10px; border-bottom: 1px solid #eee; }
          .total { font-size: 18px; font-weight: bold; color: #2B7A8F; margin-top: 20px; }
          .footer { text-align: center; color: #666; font-size: 12px; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Order Confirmation</h1>
            <p>Thank you for your purchase, ${buyerName}!</p>
          </div>
          
          <div class="content">
            <h2>Order Details</h2>
            ${orderItems.map((item) => `<div class="item"><strong>${item.title}</strong> - $${item.price}</div>`).join("")}
            <div class="total">Total: $${total.toFixed(2)}</div>
          </div>
          
          <div class="footer">
            <p>Your order has been confirmed and will be processed shortly.</p>
            <p>Visit your dashboard to track your orders.</p>
          </div>
        </div>
      </body>
    </html>
  `
}

export function getSaleNotificationEmail(sellerName: string, artTitle: string, amount: number) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #2B7A8F 0%, #F5D5B8 100%); color: white; padding: 20px; border-radius: 8px; }
          .content { padding: 20px; background: #f9f9f9; margin: 20px 0; border-radius: 8px; }
          .amount { font-size: 24px; font-weight: bold; color: #2B7A8F; margin: 20px 0; }
          .footer { text-align: center; color: #666; font-size: 12px; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>New Sale!</h1>
            <p>Congratulations, ${sellerName}!</p>
          </div>
          
          <div class="content">
            <p>Your artwork <strong>"${artTitle}"</strong> has been sold!</p>
            <div class="amount">+$${amount.toFixed(2)}</div>
            <p>The funds will be transferred to your account within 2-3 business days.</p>
          </div>
          
          <div class="footer">
            <p>Check your seller dashboard for more details.</p>
          </div>
        </div>
      </body>
    </html>
  `
}

export function getWelcomeEmail(userName: string) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #2B7A8F 0%, #F5D5B8 100%); color: white; padding: 20px; border-radius: 8px; }
          .content { padding: 20px; background: #f9f9f9; margin: 20px 0; border-radius: 8px; }
          .footer { text-align: center; color: #666; font-size: 12px; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to ArtVerse!</h1>
            <p>Hi ${userName},</p>
          </div>
          
          <div class="content">
            <p>We're excited to have you join our community of artists and art enthusiasts.</p>
            <p>Start exploring amazing digital art or upload your own creations to share with the world.</p>
            <p>Happy creating!</p>
          </div>
          
          <div class="footer">
            <p>Questions? Contact us at support@artverse.com</p>
          </div>
        </div>
      </body>
    </html>
  `
}
