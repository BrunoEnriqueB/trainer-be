import { Transporter } from 'nodemailer';

const nodemailer = require('nodemailer');

const transporter: Transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE as string,
  host: process.env.EMAIL_HOST as string,
  secure: process.env.EMAIL_SECURE as string,
  auth: {
    user: process.env.EMAIL_AUTH_USER as string,
    pass: process.env.EMAIL_AUTH_PASS as string
  }
});

export default transporter;
