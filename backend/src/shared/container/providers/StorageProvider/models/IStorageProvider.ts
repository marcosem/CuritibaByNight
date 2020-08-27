export default interface IStorageProvider {
  saveFile(file: string, type: string): Promise<string>;
  deleteFile(file: string, type: string): Promise<void>;
}
