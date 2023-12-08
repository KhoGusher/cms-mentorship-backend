// const sgMail = require('@sendgrid/mail');
const nodemailer = require("nodemailer");
const pug = require("pug");

class Email {
  to: string;
  firstName: string;
  url: string;
  from: string;

  constructor(user: { email: string; full_name: string }, url: string) {
    this.to = user.email;
    this.firstName = user.full_name.split(" ")[0];
    this.url = url;
    this.from = `Kondwani Nantchito <${process.env.EMAIL_FROM}>`;
  }

  newTransport() {
    if (process.env.NODE_ENV === "production") {
      // Sendgrid
      return nodemailer.createTransport({
        service: "SendGrid",
        auth: {
          // apiKey: process.env.SENDGRID_API_KEY
          user: process.env.SENDGRID_USERNAME,
          pass: process.env.SENDGRID_PASSWORD,
        },
      });
    }

    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  // Send the actual email
  async send(template: string, subject: string) {
    // 1) Render HTML based on a pug template
    const html = pug.renderFile(`${__dirname}/../views/${template}.pug`, {
      firstName: this.firstName,
      url: this.url,
      subject,
    });

    // 2) Define email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: "Hi kho",
      // text: convert(html, {wordwrap: false})
    };

    // 3) Create a transport and send email
    await this.newTransport().sendMail(mailOptions);
  }

  // confirm email
  async confirmEmail() {
    await this.send(
      "confirmEmail",
      "Welcome to Gusherlabs, Please verify your account)"
    );
  }

  async sendWelcome() {
    await this.send("welcome", "Welcome to Gusherlabs!");
  }

  // sports council welcome affiliate
  async affiliateCredentials() {
    await this.send("affiliateCredentails", "From Gusherlabs");
  }

  async sendPasswordReset() {
    await this.send("passwordReset", "Your password reset token");
  }
}

export { Email };
