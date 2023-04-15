import type { NextApiRequest, NextApiResponse } from 'next'
import multer, { MulterError } from 'multer'
import Tesseract from 'tesseract.js';
import type { Request, Response } from 'express'
import { Animal, Category, Rates } from '@/components/data-table.types'

interface MulterFile {
  fieldname: string
  originalname: string
  encoding: string
  mimetype: string
  size: number
  buffer: Buffer
}

const storage = multer.memoryStorage()

const upload = multer({ storage })

export const config = {
  api: {
    bodyParser: false,
  },
}

export default async function handler(
  req: NextApiRequest & { file?: MulterFile },
  res: NextApiResponse<MulterFile | MulterError>
): Promise<void> {
  return new Promise((resolve, reject) => {
    upload.single('file')(req as unknown as Request, res as unknown as Response, (err: MulterError | any) => {
      if (err) {
        reject(err)
      } else {
        const file = req.file as MulterFile
        console.log(file.buffer);
        res.status(200).json(file)
        resolve()
      }
    })
  })
}


const imageRecognition = async (imagePath: string): Promise<string> => {
  try {
    const { data: { text } } = await Tesseract.recognize(imagePath, 'spa');
    return text;
  } catch (error) {
    console.error('[imageRecognition] Ocurrió un error al reconocer la imagen');
    console.error(error);
    throw error;
  }
};

const parseTextAndGetRates = (text: string, isNewImageFormat: boolean): Rates => {
  try {
    const linesOfText: string[] = text.split('\n');
    let rows: number = 0;
    let pricesList: (string | null)[][] = [];
    let titleSeason: string = '';
  
    linesOfText.forEach((text: string) => {
      const regex = /[a-zA-Z0-9.áéíóúÁÉÍÓÚ$]+/g;
      const validText = text.match(regex);
  
      if (validText) {
        const result: (string | null)[] = validText.map((item: string) =>
          item.length > 1 || item === '$' ? item : '$'
        );
  
        if (result.length > 0) {
          rows++;
  
          if (isNewImageFormat) {
            const season: boolean = result.includes('Precios') && result.includes('del');
  
            if (season) {
              titleSeason = result.join(' ');
            }
  
            if (rows === 13) {
              pricesList.push(['MACHOS']);
            }
  
            if (rows > 5) {
              let newResult;
              if (result.length === 5) {
                if (result[1] !== '$' && result[3] !== '$') {
                  newResult = [`${result[0]} ${result[1]}`, result[3], result[4]];
                }else {
                  newResult = [`${result[0]}`, result[2], result[4]];
                }
              } else if (result.length === 6) {
                newResult = [`${result[0]} ${result[1]}`, result[3], result[5]];
              } else {
                newResult = result;
              }
              pricesList.push(newResult);
            }
          } else {
            const season = result.includes('PRECIOS') && result.includes('DEL');
  
            if (season) {
              titleSeason = result.join(' ');
            }
  
            if (rows > 6 && rows < 26) {
              let newResult;

              if (result.length === 5) {
                newResult = [`${result[0]}`, result[2], result[4]];
              } else if (result.length === 6) {
                newResult = [`${result[0]} ${result[1]}`, result[3], result[5]];
              } else {
                newResult = result;
              }
              pricesList.push(newResult);
            }
          }
        }
      }
    });
  
    return { titleSeason, pricesList };
  } catch (error) {
    console.error('[parseTextAndGetRates] Ocurrió un error al analizar el texto y obtener las tarifas');
    console.error(error);
    throw error;
  }
};

const groupPricesByTypeofAnimal = (pricesList: (string | null)[][]): Animal[] => {
  try {
    let animals: Animal[] = [];
    let currentAnimal: Animal | null = null;
  
    pricesList.forEach((animal: any) => {
      if (animal.length === 1) {
        const name = animal[0]!;
        currentAnimal = { name, category: [] };
        animals.push(currentAnimal);
      } else if (currentAnimal) {
        const pricesByCategory: Category = {
          name: animal[0],
          prices: {
            min: parseStringToNumber(animal[1]),
            max: parseStringToNumber(animal[2]),
          }
        }
        currentAnimal.category.push(pricesByCategory);
      }
    });
  
    return animals;
  } catch (error) {
    console.error('[groupPricesByTypeofAnimal] Ocurrió un error al agrupar los precios por categoría de animal');
    console.error(error);
    throw error;
  }
};

const parseStringToNumber = (text: string) => {
  try {
    const validDecimals = validNumbersWithDecimals(text, 2);
    const regex = /\d.+/g;
    const number = validDecimals.match(regex);

    if (number) {
      const quantity = Number(number.join(''));
      return quantity.toFixed(2);
    } else {
      return validDecimals;
    } 
  } catch (error) {
    console.error('[parseStringToNumber] Ocurrió un error al analizar el texto y convertirlo a numerico');
    console.error(error);
    throw error
  }
}

const validNumbersWithDecimals = (text: string, totalDecimals:number = 2): string => {
  try { 
    if (text.includes(".") && text.split(".")[1].length === totalDecimals) {
      // Ya tiene dos decimales, no es necesario hacer nada
      return text;
    } else {
      // Convertir a dos decimales
      const formattedValue = (parseInt(text, 10) / 100).toFixed(totalDecimals);
      return formattedValue;
    }
  } catch (error) {
    console.error('[validNumbersWithDecimals] Ocurrió un al convertir a decimales');
    console.error(error);
    throw error;
  }
}