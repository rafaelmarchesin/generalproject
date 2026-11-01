import { avatarFromPhoto, loadImage, pixelize, toDataURL, type Crop } from '@projeto-x/engine';

/** Lê um arquivo de imagem escolhido pela pessoa, sem enviá-lo a lugar nenhum. */
export function readFile(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) { reject(new Error('Escolha um arquivo de imagem.')); return; }
    const url = URL.createObjectURL(file);
    loadImage(url).then((img) => { URL.revokeObjectURL(url); resolve(img); }, (e) => { URL.revokeObjectURL(url); reject(e); });
  });
}

export function avatarDataURL(img: HTMLImageElement, crop: Crop, shirt: string): string {
  return toDataURL(avatarFromPhoto(img, crop, shirt));
}

/** Memória 56×40 em pixel art (recorte central). */
export function memoryDataURL(img: HTMLImageElement): string {
  return toDataURL(pixelize(img, 56, 40, 6));
}
