const Mail = use('Mail')

exports.sendMail = async (to, subject, message, attach, cc, bcc) => {
  try {
    await Mail.raw(message, (msg) => {
      msg.from('app@gymtest.com', 'GymTest')
      msg.to(to)
      msg.subject(subject)
      msg.bcc(bcc)
      if (attach) {
        msg.attach(attach)
      }
    })
    return 'Message sent';
  } catch (error) {
    console.log(error, 'Error al Enviar Correo')
  }
};
