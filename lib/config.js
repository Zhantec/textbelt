const SENDMAIL_TRANSPORT = {
  // This transport uses the local sendmail installation.
  sendmail: true,
  newline: 'unix',
  path: '/usr/sbin/sendmail',
};

const SMTP_TRANSPORT = {
  // This is a Nodemailer transport. It can either be an SMTP server or a
  // well-known service such as Sengrid, Mailgun, Gmail, etc.
  // See https://nodemailer.com/transports/ and https://nodemailer.com/smtp/well-known/
  host: process.env.SMTP_HOST || 'smtp.example.com',
  port: process.env.SMTP_PORT || 587,
  auth: {
    user: process.env.SMTP_USER || 'user@example.com',
    pass: process.env.SMTP_PASS || 'example password 1',
  },
  secureConnection: process.env.SMTP_SECURE === 'true' ? 'true' : 'false',
  tls: {
    ciphers: 'SSLv3',
  },
};

// Determine which transport to use based on environment
const transport = process.env.SMTP_HOST ? SMTP_TRANSPORT :
                 process.env.USE_SENDMAIL === 'true' ? SENDMAIL_TRANSPORT :
                 SMTP_TRANSPORT;

module.exports = {
  transport,
  mailOptions: {
    from: process.env.MAIL_FROM || '"TextBelt" <textbelt@example.com>',
  },
  debugEnabled: process.env.DEBUG === 'true' || false,
};
