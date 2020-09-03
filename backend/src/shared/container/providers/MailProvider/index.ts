import { container } from 'tsyringe';

import mailConfig from '@config/mail';
import IMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider';
import EtherealMailProvider from '@shared/container/providers/MailProvider/implementations/EtherealMailProvider';
import SESMailProvider from '@shared/container/providers/MailProvider/implementations/SESMailProvider';

const providers = {
  ethereal: container.resolve(EtherealMailProvider),
  ses: container.resolve(SESMailProvider),
};

// Need to have constructor executed when server is on
container.registerInstance<IMailProvider>(
  'MailProvider',
  providers[mailConfig.driver],
);
