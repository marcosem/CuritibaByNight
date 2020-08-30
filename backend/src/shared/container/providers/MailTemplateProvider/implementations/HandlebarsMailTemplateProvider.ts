import handlebars from 'handlebars';
import IMailTemplateProvider from '@shared/container/providers/MailTemplateProvider/models/IMailTemplateProvider';
import IParseMailTemplateProvider from '@shared/container/providers/MailTemplateProvider/dtos/IParseMailTemplateDTO';

class HandlebarsMailTemplateProvider implements IMailTemplateProvider {
  public async parse({
    template,
    variables,
  }: IParseMailTemplateProvider): Promise<string> {
    const parseTemplate = handlebars.compile(template);

    return parseTemplate(variables);
  }
}

export default HandlebarsMailTemplateProvider;
