

import { Router } from 'express';
import contactsRouter from './contacts.js';
import userRouter from './user.js';
import authRouter from './auth.js';
// import columnsRouter from './column.js';
import boardsRouter from './board.js';

const router = Router();
router.use('/auth', authRouter);
router.use('/contacts', contactsRouter);
router.use('/user', userRouter);
// router.use('/columns', columnsRouter);
router.use('/boards', boardsRouter);
export default router;
