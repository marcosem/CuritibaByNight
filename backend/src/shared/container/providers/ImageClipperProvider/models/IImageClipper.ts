export default interface IImageClipper {
  cropImage(
    file: string,
    path: string,
    propX: number,
    propY: number,
  ): Promise<string>;
}
