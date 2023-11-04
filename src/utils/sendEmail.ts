import transporter from '@src/config/nodemailer';

import EmailConstructor from '@src/domain/EmailConstructor';
import { EmailServiceUnavailableException } from '@src/domain/EmailException';

export default function sendEmail(emailBody: EmailConstructor): Promise<void> {
  return new Promise((resolve, reject) => {
    transporter.sendMail(emailBody, (error, info) => {
      if (error) {
        console.error(error);
        return reject(new EmailServiceUnavailableException());
      }

      resolve();
    });
  });
}
