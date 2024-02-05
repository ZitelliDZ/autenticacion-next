import {Resend} from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const domain = process.env.NEXT_PUBLIC_APP_URL;

export const sendTwoFactorTokenEmail = async (email: string, token: string) => {
  
  const confirmLink = `${domain}/auth/new-password?token=` + token;
  await resend.emails.send({
    from: 'onboarding@resend.dev',
    to: email,
    subject: 'Código 2FA - Tratamientos Capilares',
    html: `<p>Hola, te hablamos desde Tratamientos Capilares</p><p>El código es : ${token}</p>`
  });

}

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const confirmLink = `${domain}/auth/new-password?token=` + token;
  await resend.emails.send({
    from: 'onboarding@resend.dev',
    to: email,
    subject: 'Restaurar contraseña - Tratamientos Capilares',
    html: `<p>Hola, te hablamos desde Tratamientos Capilares</p><p>Para restaurar la contraseña haz click aquí  <a href="${confirmLink}">aquí</a></p>`
  });

}


  export const sendVerificationEmail = async (email: string, token: string) => {
    const confirmLink = `${domain}/auth/new-verification?token=` + token;
    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: email,
      subject: 'Confirma tu email - Tratamientos Capilares',
      html: `<p>Hola, te hablamos desde Tratamientos Capilares</p><p>Para verificar tu cuenta da click <a href="${confirmLink}">aquí</a></p>`
    });
  }