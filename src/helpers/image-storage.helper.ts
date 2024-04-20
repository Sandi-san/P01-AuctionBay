import fs from 'fs'
import { diskStorage, Options } from 'multer'
import { extname } from 'path'

type validFileExtensionsType = 'png' | 'jpg' | 'jpeg'
type validMimeType = 'image/png' | 'image/jpg' | 'image/jpeg'
const validFileExtensions: validFileExtensionsType[] = ['png', 'jpg', 'jpeg']
const validMimeTypes: validMimeType[] = ['image/png', 'image/jpg', 'image/jpeg']

export const saveImageToStorage: Options = {
  storage: diskStorage({
    //:root/files
    destination: './files',
    filename(req, file, callback) {
      //create unique suffix
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
      //get file extension
      const ext = extname(file.originalname)
      //write filename
      const filename = `${uniqueSuffix}${ext}`
      //return
      callback(null, filename)
    },
  }),
  fileFilter(req, file, callback) {
    //check ce je mime correct (aktualna vrsta datoteke)
    const allowedMimeTypes: validMimeType[] = validMimeTypes
    validMimeTypes.includes(file.mimetype as validMimeType) ? callback(null, true) : callback(null, false)
  },
}

export const isFileExtensionSafe = async (fullFilePath: string): Promise<boolean> => {
  //DYNAMIC IMPORT, sicer ti ts vrne Module must use import to load ES instead of require()???
  const { fileTypeFromFile } = await import('file-type')
  
  return fileTypeFromFile(fullFilePath).then((fileExtensionsAndMimeType) => {
    if (!fileExtensionsAndMimeType?.ext) return false
    const isFileTypeLegit = validFileExtensions.includes(fileExtensionsAndMimeType.ext as validFileExtensionsType)
    const isMimeTypeLegit = validMimeTypes.includes(fileExtensionsAndMimeType.ext as validMimeType)
    const isFileLegit = isFileTypeLegit && isMimeTypeLegit
    return isFileLegit
  })
}

export const removeFile = (fullFilePath: string): void => {
  try {
    fs.unlinkSync(fullFilePath)
  } catch (error) {
    console.log(error)
  }
}
