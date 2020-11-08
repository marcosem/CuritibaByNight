import 'reflect-metadata';
import FakePDFParserProvider from '@modules/characters/providers/PDFParser/fakes/FakePDFParserProvider';
import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import ParseCharacterSheetService from '@modules/characters/services/ParseCharacterSheetService';
import Character from '@modules/characters/infra/typeorm/entities/Character';

import AppError from '@shared/errors/AppError';

let fakeStorageProvider: FakeStorageProvider;
let fakePDFParserProvider: FakePDFParserProvider;
let parseCharacterSheet: ParseCharacterSheetService;

describe('ParseCharacterSheet', () => {
  beforeEach(() => {
    fakePDFParserProvider = new FakePDFParserProvider();
    fakeStorageProvider = new FakeStorageProvider();

    parseCharacterSheet = new ParseCharacterSheetService(
      fakePDFParserProvider,
      fakeStorageProvider,
    );
  });

  it('Should be able to parse a PDF file', async () => {
    const char = await parseCharacterSheet.execute({
      sheetFilename: 'filename.pdf',
      mimetype: 'application/pdf',
    });
    expect(char).toBeInstanceOf(Character);
  });

  it('Should handle errors in PDF file', async () => {
    const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

    await expect(
      parseCharacterSheet.execute({
        sheetFilename: 'invalidPDFFile',
        mimetype: 'application/pdf',
      }),
    ).rejects.toBeInstanceOf(AppError);

    expect(deleteFile).toBeCalled();
  });

  it('Should handle empty file names', async () => {
    await expect(
      parseCharacterSheet.execute({
        sheetFilename: '',
        mimetype: 'application/pdf',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('Should not allow non PDF files', async () => {
    const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

    await expect(
      parseCharacterSheet.execute({
        sheetFilename: 'filename.rtf',
        mimetype: 'application/rtf',
      }),
    ).rejects.toBeInstanceOf(AppError);

    expect(deleteFile).toBeCalled();
  });
});
