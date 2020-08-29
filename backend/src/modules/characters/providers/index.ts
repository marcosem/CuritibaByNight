import { container } from 'tsyringe';
import IPDFParserProvider from '@modules/characters/providers/PDFParser/models/IPDFParserProvider';
import PDFParseProvider from '@modules/characters/providers/PDFParser/implementations/PDFParseProvider';

container.registerSingleton<IPDFParserProvider>(
  'PDFParserProvider',
  PDFParseProvider,
);
