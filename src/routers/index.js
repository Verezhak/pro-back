

import { Router } from 'express';
import contactsRouter from './contactsRouter.js';
import userRouter from './userRouter.js';
import columnsRouter from './column.js';
import boardsRouter from './board.js';

const router = Router();

router.use('/contacts', contactsRouter);
router.use('/user', userRouter);
router.use("/columns", columnsRouter);
router.use('/boards', boardsRouter);
export default router;
