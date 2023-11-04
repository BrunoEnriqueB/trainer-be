import { SendMailOptions } from 'nodemailer';

export default class EmailConstructor {
  public from: string;

  constructor(
    public text: string,
    public subject: string,
    public html: string,
    public to: string[],
    options?: SendMailOptions
  ) {
    this.from = process.env.EMAIL_FROM as string;
  }
}

export class RecoveryPasswordTemplate extends EmailConstructor {
  constructor(to: string[], password: string) {
    super(
      'Aqui está sua nova senha no aplicativo treinador',
      'Recuperação de senha',
      `<p>Utilize a senha abaixo para fazer o acesso. Após isso troque sua senha</p>` +
        `<h2>${password}</h2>`,
      to
    );
  }
}
