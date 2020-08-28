import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvider';

class FakeStorageProvider implements IStorageProvider {
  private storageAvatar: string[] = [];

  private storageSheet: string[] = [];

  private storage: string[] = [];

  public async saveFile(file: string, type: string): Promise<string> {
    switch (type) {
      case 'avatar':
        this.storageAvatar.push(file);
        break;
      case 'sheet':
        this.storageSheet.push(file);
        break;
      default:
        this.storage.push(file);
    }

    return file;
  }

  public async deleteFile(file: string, type: string): Promise<void> {
    let findIndex;

    switch (type) {
      case 'avatar':
        findIndex = this.storageAvatar.findIndex(
          storageFile => storageFile === file,
        );

        this.storageAvatar.splice(findIndex, 1);

        break;
      case 'sheet':
        findIndex = this.storageSheet.findIndex(
          storageFile => storageFile === file,
        );

        this.storageSheet.splice(findIndex, 1);

        break;
      default:
        findIndex = this.storage.findIndex(storageFile => storageFile === file);

        this.storage.splice(findIndex, 1);
    }
  }
}

export default FakeStorageProvider;
