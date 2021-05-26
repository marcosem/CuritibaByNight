/* eslint-disable @typescript-eslint/no-explicit-any */
import React, {
  useState,
  useCallback,
  useRef,
  useEffect,
  ChangeEvent,
} from 'react';
import { FiX } from 'react-icons/fi';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

import {
  Overlay,
  CloseModalButton,
  Container,
  ReactCropContainer,
  CropContainer,
  CanvasContainer,
  CanvasMask,
  CanvasMaskWindow,
  LabelBox,
  ButtonBox,
} from './styles';

import Button from '../Button';

import { useImageCrop } from '../../hooks/imageCrop';
import { useMobile } from '../../hooks/mobile';

interface IImageCropData {
  setImage: (img: File) => void;
  width: number;
  height: number;
  kindred?: boolean;
}

interface IImageCropDataProps {
  imageCropData: IImageCropData;
}

const ModalImageCrop: React.FC<IImageCropDataProps> = ({
  imageCropData,
}: IImageCropDataProps) => {
  const [upImg, setUpImg] = useState<string>();
  const imgRef = useRef<any>(null);
  const [crop, setCrop] = useState<ReactCrop.Crop>({
    unit: '%',
    width: 50,
    x: 25,
    y: 25,
    aspect: imageCropData.width / imageCropData.height,
  });
  const [openDlg, setOpenDlg] = useState<boolean>(true);
  const [completedCrop, setCompletedCrop] = useState<any>(null);
  const { setImage } = imageCropData;
  const { closeImageCrop } = useImageCrop();
  const { isMobileVersion } = useMobile();
  const previewCanvasRef = useRef<any>(null);

  const closeDialog = useCallback(() => {
    setOpenDlg(false);
    setTimeout(() => {
      closeImageCrop();
    }, 150);
  }, [closeImageCrop]);

  const onLoad = useCallback(img => {
    imgRef.current = img;
  }, []);

  const onSelectFile = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener('load', () => setUpImg(reader.result as string));
      reader.readAsDataURL(e.target.files[0]);
    }
  }, []);

  const handleSaveImage = useCallback(() => {
    previewCanvasRef.current.toBlob((blob: File) => {
      const newBlob = blob;
      // newBlob.name = fileName;
      setImage(newBlob);
      closeDialog();
    });
  }, [closeDialog, setImage]);

  useEffect(() => {
    if (!completedCrop || !previewCanvasRef.current || !imgRef.current) {
      return;
    }

    const image = imgRef.current;
    const canvas = previewCanvasRef.current;
    const myCrop = completedCrop;

    if (image !== null && canvas !== null) {
      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;
      const ctx = canvas.getContext('2d');
      const pixelRatio = window.devicePixelRatio;

      canvas.width = myCrop.width * pixelRatio;
      canvas.height = myCrop.height * pixelRatio;

      ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      ctx.imageSmoothingQuality = 'high';

      ctx.drawImage(
        image,
        myCrop.x * scaleX,
        myCrop.y * scaleY,
        myCrop.width * scaleX,
        myCrop.height * scaleY,
        0,
        0,
        myCrop.width,
        myCrop.height,
      );
    }
  }, [completedCrop]);

  return (
    <Overlay>
      <Container openClose={openDlg} isMobile={isMobileVersion}>
        <LabelBox isMobile={isMobileVersion}>
          <label htmlFor="ImageLoad">
            <span>Selecione uma Imagem</span>
            <input
              type="file"
              accept="image/*"
              id="ImageLoad"
              onChange={onSelectFile}
            />
          </label>
        </LabelBox>

        <ReactCropContainer>
          <CropContainer>
            <ReactCrop
              src={upImg || ''}
              onImageLoaded={onLoad}
              crop={crop}
              onChange={c => setCrop(c)}
              onComplete={c => setCompletedCrop(c)}
              imageStyle={
                upImg
                  ? {
                      maxWidth: '252px',
                      maxHeight: '252px',
                      // border: 'solid #ff0000 1px',
                    }
                  : { height: '252px' }
              }
            />
          </CropContainer>

          <CanvasContainer
            visible={!!upImg}
            isMobile={isMobileVersion}
            myWidth={imageCropData.width}
            myHeight={imageCropData.height}
          >
            <canvas
              ref={previewCanvasRef}
              // Rounding is important so the canvas width and height matches/is a multiple for sharpness.
              style={{
                width: `${isMobileVersion ? 0 : imageCropData.width}px`, // Math.round(completedCrop?.width ?? 0),
                height: `${isMobileVersion ? 0 : imageCropData.height}px`, // Math.round(completedCrop?.height ?? 0),
              }}
            />
            {!isMobileVersion && imageCropData.kindred && (
              <CanvasMask
                visible={!!upImg}
                myWidth={imageCropData.width}
                myHeight={imageCropData.height}
              >
                <CanvasMaskWindow
                  visible
                  myWidth={imageCropData.width}
                  myHeight={imageCropData.height}
                />
              </CanvasMask>
            )}
          </CanvasContainer>
        </ReactCropContainer>

        <CloseModalButton onClick={closeDialog}>
          <FiX />
        </CloseModalButton>

        {upImg && (
          <ButtonBox isMobile={isMobileVersion}>
            <Button type="button" onClick={handleSaveImage}>
              Salvar Imagem
            </Button>
          </ButtonBox>
        )}
      </Container>
    </Overlay>
  );
};

export default ModalImageCrop;
