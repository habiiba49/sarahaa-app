import { Router } from 'express';
import { uploadArrayOfFiles, uploadSingleFile } from '../../lib/media/multer.js';
import { allowedFields, fileValidation } from '../../lib/media/file.validation.js';
console.log('uploadSingleFile:', typeof uploadSingleFile);
console.log('uploadArrayOfFiles:', typeof uploadArrayOfFiles);


const userRouter= Router();
 
console.log("user router load")



userRouter.post('/upload-profile-pic', uploadSingleFile('pp'),
fileValidation(),
(req, res, next) => {
    console.log(req.file)
    res.json('okay')
})

userRouter.post('/upload-cv', 
    uploadSingleFile('cv', allowedFields.files),
    fileValidation(allowedFields.files),
(req, res, next) => {
    res.json('okay')
})

userRouter.post('/upload-cover-images', uploadArrayOfFiles('cover-images', 3),(req, res, next) => {
    console.log(req.files)
    res.json('okay')
})

export default userRouter;