require('dotenv').config();
const sendEmail = require('./utils/sendEmail');

const test = async () => {
  try {
    console.log('Sending test email to timevault.app.mailer@gmail.com...');
    await sendEmail({
      email: 'timevault.app.mailer@gmail.com', // Sending it to itself just to test!
      subject: 'TimeVault API Test',
      html: '<h1>Success!</h1><p>Your TimeVault email server is correctly configured and working!</p>'
    });
    console.log('✅ Test email sent successfully!');
  } catch (err) {
    console.error('❌ Failed to send email:', err);
  }
};

test();
