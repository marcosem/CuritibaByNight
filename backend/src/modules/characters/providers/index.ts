import { container } from 'tsyringe';
import IPDFParserProvider from '@modules/characters/providers/PDFParser/models/IPDFParserProvider';
import PDFParseProvider from '@modules/characters/providers/PDFParser/implementations/PDFParseProvider';
import IDomainMasqueradeProvider from '@modules/characters/providers/DomainMasqueradeProvider/models/IDomainMasqueradeProvider';
import DomainMasqueradeProvider from '@modules/characters/providers/DomainMasqueradeProvider/implementations/DomainMasqueradeProvider';

container.registerSingleton<IPDFParserProvider>(
  'PDFParserProvider',
  PDFParseProvider,
);

container.registerSingleton<IDomainMasqueradeProvider>(
  'DomainMasqueradeProvider',
  DomainMasqueradeProvider,
);
