import React, { createContext, useContext, useState, useCallback } from 'react';
import ModalImageCrop from '../components/ModalImageCrop';

interface IImageCropData {
  setImage: (img: File) => void;
  width: number;
  height: number;
  kindred?: boolean;
}

interface IImageCropContextData {
  showImageCrop(width: number, height: number, isKindred?: boolean): void;
  closeImageCrop(): void;
  getImage(): File;
  isImageSelected: boolean;
}

const ImageCrop = createContext<IImageCropContextData>(
  {} as IImageCropContextData,
);

const ImageCropProvider: React.FC = ({ children }) => {
  const [isImageCropOpen, setImageCropOpen] = useState<boolean>(false);
  const [imageCropData, setImageCropData] = useState<IImageCropData>(
    {} as IImageCropData,
  );
  const [croppedImage, setCroppedImage] = useState<File>({} as File);
  const [isImgSelected, setIsImgSelected] = useState<boolean>(false);

  const closeImageCrop = useCallback(() => {
    if (!isImageCropOpen) {
      return;
    }
    setImageCropData({} as IImageCropData);
    // setCroppedImage({} as File);
    setImageCropOpen(false);
  }, [isImageCropOpen]);

  const setImage = useCallback((img: File) => {
    setCroppedImage(img);
    setIsImgSelected(true);
  }, []);

  const showImageCrop = useCallback(
    (width: number, height: number, isKindred = false) => {
      const newCharData: IImageCropData = {
        setImage,
        width,
        height,
        kindred: isKindred,
      };

      setCroppedImage({} as File);
      setImageCropData(newCharData);
      setImageCropOpen(true);
    },
    [setImage],
  );

  const getImage = useCallback(() => {
    setIsImgSelected(false);
    return croppedImage;
  }, [croppedImage]);

  return (
    <ImageCrop.Provider
      value={{
        showImageCrop,
        closeImageCrop,
        getImage,
        isImageSelected: isImgSelected,
      }}
    >
      {children}
      {isImageCropOpen && <ModalImageCrop imageCropData={imageCropData} />}
    </ImageCrop.Provider>
  );
};

function useImageCrop(): IImageCropContextData {
  const context = useContext(ImageCrop);

  if (!context) {
    throw new Error('useImageCrop must be used within a ImageCropProvider');
  }

  return context;
}

export { ImageCropProvider, useImageCrop };
