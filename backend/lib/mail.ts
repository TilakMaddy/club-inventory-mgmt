import { createTransport, getTestMessageUrl } from 'nodemailer';
import 'dotenv/config';


// Trasnporter => helps you hook up to smtp server and sendmail

const transport = createTransport({
  host: process.env.MAIL_HOST,
  port: parseInt(process.env.MAIL_PORT),
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  }
});

function makeANiceEmail(text: string) {
  return `
    <div className="email" style="
      border: 1px solid black;
      padding: 20px;
      font-family: sans-serif;
      line-height: 2;
      font-size: 20px;
    ">
      <h2>Hello !</h2>
      <p>${text}</p>
      <p>Website Admin. </p>
    </div>
  `;
}

export interface MailResponse {
  accepted?: (string)[] | null;
  rejected?: (null)[] | null;
  envelopeTime: number;
  messageTime: number;
  messageSize: number;
  response: string;
  envelope: Envelope;
  messageId: string;
}
export interface Envelope {
  from: string;
  to?: (string)[] | null;
}


export async function sendPasswordResetEmail(
  resetToken: string,
  to: string
): Promise<void> {
  // email the user a token
  const info = (await transport.sendMail({
    to,
    from: 'admin@store.com',
    subject: 'Reset password',
    html: makeANiceEmail(`

      We have received a requested for a password reset for your email Id. If it is not you, kindly ignore it.
      <br>
      <a href="${process.env.FRONTEND_URL}/reset?token=${resetToken}">Click Here to reset</a>
      <br>
        (or)
      <br>
      Copy paste the link below into the URL bar
      <br>
      ${process.env.FRONTEND_URL}/reset?token=${resetToken}
      <br>
      Caution ⚠️ : Using the above link can cause anyone who clicks it to reset your account. Hence make sure to not share it with anybody.
      <br>
      Peace ✌️

    `),
  }));// as MailResponse;

  if (process.env.MAIL_USER.includes('ethereal.email')) {
    console.log(`💌 Message Sent!  Preview it at ${getTestMessageUrl(info)}`);
  }
}