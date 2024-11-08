
import { Router } from 'express';

import { validateBody } from '../middlewares/validateBody.js';
import { isValidId } from '../middlewares/isValidId.js';
import { cardSchema, updateCardSchema } from '../validation/cards.js';
import { createCardController, deleteCardController, getAllCardsController, getCardByIdController, moveCardController, updateCardController } from '../controllers/cards.js';

const cardsRouter = Router();

cardsRouter.get('/:boardId',isValidId('boardId'), getAllCardsController);
cardsRouter.get('/:cardId', isValidId('cardId'), getCardByIdController);
cardsRouter.post('/', validateBody(cardSchema), createCardController);
cardsRouter.patch(
  '/:cardId',
  isValidId('cardId'),
  validateBody(updateCardSchema),
  updateCardController,
);
cardsRouter.delete('/:cardId', isValidId('cardId'), deleteCardController);
cardsRouter.patch('/move/:cardId', moveCardController);

export default cardsRouter;
