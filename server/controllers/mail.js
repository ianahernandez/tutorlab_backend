// ====================================================
//      Controlador: Correo electrónico
//      By TutorLab Team ©
// ====================================================

const mailgun = require("mailgun-js");

const DOMAIN = 'sandbox36ec2ef58b014140ba34e8eea197076a.mailgun.org';

const api_key = 'e6a28d1c326cee59b188d147833b6a8c-816b23ef-41b5c701'

const mg = mailgun({apiKey: api_key, domain: DOMAIN});


sendMail = (to, subject, text) => {

  const data = {

    from: 'TutorLab <info@tutorlab.com>',
    
    to,
    
    subject,
    
    text,
    
  };

  mg.messages().send(data, function (error, body) {
    console.log(body);
  });
}

module.exports = { sendMail };

