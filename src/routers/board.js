import { Router } from 'express';
import { authenticate } from '../middlewares/authenticate.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { createBoardController, deleteBoardController, getAllBoardsController, getBoardByIdController, updateBoardController } from '../controllers/boardController.js';
import { validateBody } from '../middlewares/validateBody.js';
import { createBoardSchema, updateBoardSchema } from '../validation/board.js';




const boardsRouter = Router();

boardsRouter.get('/', authenticate, ctrlWrapper(getAllBoardsController));

boardsRouter.get(
    '/:id',
    authenticate,
    ctrlWrapper(getBoardByIdController),
); // додала щоб лише власник дошки міг її отримати за id

boardsRouter.post(
    '/',
    authenticate,
    validateBody(createBoardSchema),
    ctrlWrapper(createBoardController),
);

boardsRouter.patch(
    '/:id',
    authenticate,
    validateBody(updateBoardSchema),
    ctrlWrapper(updateBoardController),
);

boardsRouter.delete(
    '/:id',
    authenticate,
    ctrlWrapper(deleteBoardController),
);

export default boardsRouter;