import { Request, Response, NextFunction } from 'express'
import * as multer from 'multer'
import * as fs from 'fs';

type DestinationCallback = (error: Error | null, destination: string) => void
type FileNameCallback = (error: Error | null, filename: string) => void

export const fileStorage = multer.diskStorage({
    destination: (
        request: Request,
        file: Express.Multer.File,
        callback: DestinationCallback
    ): void => {
        console.log(request.body.path);
        const path = `./efficacy_assets/${request.body.path || ''}`;
        fs.mkdirSync(path, { recursive: true });
        callback(null, path)
    },

    filename: (
        request: Request,
        file: Express.Multer.File,
        callback: FileNameCallback
    ): void => {
        callback(null, `${Date.now() + '-' + Math.round(Math.random() * 1E9)}`);
    },
});

export const fileFilter = (
    request: Request,
    file: Express.Multer.File,
    callback: multer.FileFilterCallback
): void => {
    if (
        file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/jpeg'
    ) {
        callback(null, true)
    } else {
        callback(null, false)
    }
}

export const multerMiddleware = (req: Request, res: Response, next: NextFunction) => {
    // Perform any necessary operations or modifications
    const multerSingle = multer({
        storage: fileStorage
    }).single("file");
    multerSingle(req, res, next);
}