import { transport } from "../config/nodemailer";

type EmailType = {
  name: string;
  email: string;
  token: string;
};

export class AuthEmail {
  static sendConfirmationEmail = async (user: EmailType) => {
    console.log(user);
    const email = await transport.sendMail({
      from: "CashTrackr <admin@cashtrackr.com>",
      to: user.email,
      subject: "CashTrackr - Confirma tu cuenta",
      html: `
      <p>Hola: ${user.name}, haz creado tu cuenta en CashTrackr, ya esta casi lista</p>
      <p>Visita el siguiente enlace:</p>
      <a href="#">Confirmar Cuenta</a>
      <p>e ingresa el código: <b>${user.token}</b></p>
      `,
    });

    console.log("MENSAJE ENVIADO", email.messageId);
  };
}

//* mailwind => para darle diseño al html
