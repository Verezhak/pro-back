

import { Router } from 'express';
import { validateBody } from '../middlewares/validateBody.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { updateUserSchema } from '../validation/user.js';

import { authenticate } from '../middlewares/authenticate.js';
import { upload } from "../middlewares/multer.js";
import { getCurrentUserController, updateThemeController, updateUserController } from '../controllers/userController.js';
const router = Router();



router.get(
    '/current',
    authenticate,
    ctrlWrapper(getCurrentUserController)
);

router.patch('/themes',
    authenticate,
    ctrlWrapper(updateThemeController));

router.patch('/update',
    authenticate,
    upload.single('avatar'),
    validateBody(updateUserSchema),
    ctrlWrapper(updateUserController));

export default router;
