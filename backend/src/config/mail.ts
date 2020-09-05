interface IMailConfig {
  driver: 'ethereal' | 'ses';
  defaults: {
    from: {
      email: string;
      name: string;
    };
  };
}

export default {
  driver: `${process.env.MAIL_DRIVER}` || 'ethereal',
  defaults: {
    from: {
      email: `${process.env.APP_NOTIFICATION_EMAIL}`,
      name: 'Curitiba By Night',
    },
  },
} as IMailConfig;
