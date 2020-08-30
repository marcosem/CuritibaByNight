import IMailTemplateProvider from '@shared/container/providers/MailTemplateProvider/models/IMailTemplateProvider';
import IParseMailTemplateProvider from '@shared/container/providers/MailTemplateProvider/dtos/IParseMailTemplateDTO';

class FakeMailTemplateProvider implements IMailTemplateProvider {
  public async parse({
    template,
  }: IParseMailTemplateProvider): Promise<string> {
    return template;
  }
}

export default FakeMailTemplateProvider;
