const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "Correo",
        pass: "Clave",
    }
})
const send =  async(correos, mensaje) => {
    const mailOptions = {
        from: "Correo",
        to: correos,
        subject: `Roommates`,
        html: mensaje,

    }
    await transporter.sendMail(mailOptions)
}

module.exports = {send}