import formData from 'form-data';
import Mailgun from 'mailgun.js';
import dotenv from 'dotenv';


dotenv.config();

const mailgun = new Mailgun(formData);
const mg = mailgun.client({ username: 'api', key: process.env.MAILGUN_API_KEY });

const emailFooter = `
  <div class="signature" style="display: flex; align-items: center; justify-content: center; margin-top: 40px;">
    <img src="https://i.imgur.com/xp6EH5R.png" alt="Derrick" width="71" height="100" style="margin-right: 10px;">
    <div class="signature-info" style="text-align: left;">
      <p style="margin: 0; font-family: Helvetica, Arial, sans-serif; color: black;">Derrick Hua<br>Founder of Achieve Arcade</p>
      <p style="margin: 0; font-family: Helvetica, Arial, sans-serif; color: black;">
        <a href="mailto:derrick@achievearcade.com" style="color: black; text-decoration: none;"><img src="https://i.imgur.com/QhNW8Qq.png" alt="Email" style="width: 15px; vertical-align: middle;"> derrick@achievearcade.com</a><br>
        <a href="https://x.com/derrickhua_" style="color: black; text-decoration: none;"><img src="https://i.imgur.com/tBDeu9f.png" alt="Twitter" style="width: 15px; vertical-align: middle;"> @derrickhua_</a><br>
        <a href="https://www.producthunt.com/@dev_derrick" style="color: black; text-decoration: none;"><img src="https://i.imgur.com/lIqSZL2.png" alt="Product Hunt" style="width: 15px; vertical-align: middle;"> dev_derrick</a>
      </p>
    </div>
  </div>
`;

const emailStyles = `
  <style>
    body {
      font-family: Helvetica, Arial, sans-serif;
      background-color: #f8f9fa;
      color: black;
    }
    .header {
      text-align: center;
      font-size: 24px;
      font-weight: bold;
      color: black;
    }
    .heart {
      color: red;
    }
    .content {
      text-align: left;
      color: black;
    }
    .footer {
      
      text-align: center;
      color: #6c757d;
    }
    .signature {
      display: flex;
      align-items: center;
      margin-top: 20px;
    }
    .signature img {
      margin-right: 10px;
    }
    .signature-info {
      text-align: left;
      color: black;
    }
    a {
      color: black;
      text-decoration: none;
    }
    a:hover {
      color: orange !important;
    }
  </style>
`;

export const sendEmail = (to, subject, text, html) => {
    return mg.messages.create('mg.achievearcade.com', {
      from: "Achieve Arcade <derrick@achievearcade.com>",
      to: to,  // Pass the correct email address here
      subject: subject,
      text: text,
      html: `<html><head>${emailStyles}</head><body>${html}</body></html>`
    })
    .then(msg => console.log(msg)) // logs response data
    .catch(err => console.log(err)); // logs any error
  };
  

export const sendWelcomeEmailProLifetime = (to, username) => {
    const subject = "Welcome to Achieve Arcade - Pro Lifetime Access!";
    const text = `Dear Player,\n\nThank you for registering at Achieve Arcade! As one of our first 50 players, you have Pro Lifetime access. I am extremely grateful to have you here! Don't hesitate to reach out if you have any issues or feature requests.\n\nBest regards,\nDerrick`;
    const html = `
      <div style="">
        <p>Dear Player,</p>
        <p>Thank you for registering at Achieve Arcade! As one of our first 50 players, you have Pro Lifetime access. I am extremely grateful to have you here!</p>
        <p>Don't hesitate to reach out if you have any issues or feature requests.</p>
        <p>Best regards,<br>Derrick</p>
      </div>
      ${emailFooter}
    `;
    return sendEmail(to, subject, text, html);
  };
  
  export const sendWelcomeEmailRegular = (to, username) => {
    const subject = "Welcome to Achieve Arcade!";
    const text = `Dear Player,\n\nThank you for registering at Achieve Arcade! I am excited to have you on board! I hope you accomplish your goals, and live the life you deserve. If you have any questions, advice, or feedback, please don't hesitate to reach out.\n\nBest regards,\nDerrick`;
    const html = `
      <div style="">
        <p>Dear Player,</p>
        <p>Thank you for registering at Achieve Arcade! I am excited to have you on board!</p>
        <p> I hope you accomplish your goals, and live the life you deserve.</p>
        <p>If you have any questions, advice, or feedback, please don't hesitate to reach out.</p>
        <p>Best regards,<br>Derrick</p>
      </div>
      ${emailFooter}
    `;
    return sendEmail(to, subject, text, html);
  };
  
  export const sendPurchaseConfirmationEmail = (to, username) => {
    const subject = "Your Achieve Arcade Purchase Confirmation";
    const text = `Dear ${username},\n\nThank you for your purchase at Achieve Arcade! I'm thrilled to have you on board. I genuinely hope you enjoy playing and that Achieve Arcade helps you reach your goals. If you have any questions or need assistance, don't hesitate to reach out to me.\n\nBest regards,\nDerrick`;
    const html = `
        <div style="">
            <p>Dear ${username},</p>
            <p>Thank you for your purchase at Achieve Arcade! I'm thrilled to have you on board. I genuinely hope you enjoy playing and that Achieve Arcade helps you reach your goals.</p>
            <p>If you have any questions or need assistance, don't hesitate to reach out to me.</p>
            <p>Best regards,<br>Derrick</p>
        </div>
        ${emailFooter}
    `;
    return sendEmail(to, subject, text, html);
};

  
export const sendCancellationEmail = (to, username) => {
    const subject = "Your Subscription has been Cancelled";
    const text = `Dear Player,\n\nYour subscription has been cancelled, and your most recent purchase has been refunded! I greatly appreciate your opinion. What could I have done to make the product more worthwhile to you?\n\nBest regards,\nDerrick`;
    const html = `
      <div style="">
        <p>Dear Player,</p>
        <p>Your subscription has been cancelled, and your most recent purchase has been refunded!</p>
        <p>I greatly appreciate your opinion. What could I have done to make the product more worthwhile to you?</p>
        <p>Thank you for playing with us,<br>Derrick</p>
      </div>
      ${emailFooter}
    `;
    return sendEmail(to, subject, text, html);
};
