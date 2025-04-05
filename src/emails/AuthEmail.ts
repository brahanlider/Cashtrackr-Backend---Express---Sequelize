import { transport } from "../config/nodemailer";

type EmailType = {
  name: string;
  email: string;
  token: string;
};

export class AuthEmail {
  static sendConfirmationEmail = async (user: EmailType) => {
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

    // console.log("MENSAJE ENVIADO", email.messageId);  // TESTING : comentar por errores
  };

  // esto se enviara al usuario cuando quiera recuperar password
  static sendPasswordResetToken = async (user: EmailType) => {
    const email = await transport.sendMail({
      from: "CashTrackr <admin@cashtrackr.com>",
      to: user.email,
      subject: "CashTrackr - Reestablece tu Password",
      html: `
      <p>Hola: ${user.name}, has solicitado reestablecer tu password</p>
      <p>Visita el siguiente enlace:</p>
      <a href="#">Reestablecer Password</a>
      <p>e ingresa el código: <b>${user.token}</b></p>
      `,
    });

    // console.log("MENSAJE ENVIADO", email.messageId);  // TESTING : comentar por errores
  };
}

//* mailwind => para darle diseño al html
