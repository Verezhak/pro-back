

import createError from 'http-errors';
import { Card } from '../db/cards.js';
import mongoose from 'mongoose';
import { Column } from '../db/columnSchema.js'; //Леся
import { updateCard } from '../services/cards.js';

export const getAllCardsController = async (req, res, next) => {
  try {

    const { boardId } = req.params;
    const cards = await Card.find({ boardId });
    if (!cards || cards.length === 0) {
      throw createError(404, 'No cards found in this column');
    }

    res.json({
      status: 200,
      message: 'Successfully found cards!',
      data: cards,
    });
  } catch (error) {
    next(error);
  }
};


export const getCardByIdController = async (req, res, next) => {
  try {
    const { boardId } = req.body;
    const { cardId } = req.params;
    const card = await Card.findOne({ _id: cardId, boardId });

    if (!card) {
      throw createError(404, 'Card not found');
    }

    res.json({
      status: 200,
      message: 'Successfully found the card!',
      data: card,
    });
  } catch (error) {
    next(error);
  }
};

export const createCardController = async (req, res, next) => {
  try {
    const { title, description, priority, boardId, columnId } = req.body;
   
    if (!mongoose.Types.ObjectId.isValid(boardId)) {
      return res.status(400).json({ message: 'Invalid boardId' });
    }

    if (columnId && !mongoose.Types.ObjectId.isValid(columnId)) {
      return res.status(400).json({ message: 'Invalid columnId' });
    }

    const cardData = { title, description, priority, boardId, columnId };
    const newCard = await Card.create(cardData); // Змінено на newCard Леся
    console.log('Created card:', newCard);
    if (columnId) {
      const updatedColumn = await Column.findByIdAndUpdate(
        columnId,
        { $push: { cards: newCard._id } },
        { new: true }
      );

    console.log('Column after adding card:', updatedColumn);
    if (!updatedColumn) {
      //Леся
      return res.status(404).json({ message: 'Column not found' });
    }

    console.log('Updated column with new card:', updatedColumn);
  }
    res.status(201).json({
      status: 201,
      message: 'Successfully created a card!',
      data: newCard,
    });
  } catch (error) {
    next(error);
  }
};










export const deleteCardController = async (req, res, next) => {
  try {
    const { cardId } = req.params;
    const task = await Card.findByIdAndDelete(cardId);
    if (!task) {
      throw createError(404, 'Card not found');
    }
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};





export const updateCardController = async (req, res, next) => {
  try {
    const {  cardId } = req.params;
    const { boardId, newColumnId, ...updateData } = req.body;
    if (!mongoose.Types.ObjectId.isValid(cardId) || !mongoose.Types.ObjectId.isValid(boardId)) {
      return res.status(400).json({ message: 'Invalid cardId or boardId format' });
    }
    if (newColumnId) {
      updateData.columnId = newColumnId;
    }

    const updatedCard = await updateCard(cardId, boardId, updateData);

    if (!updatedCard) {
      throw createError(404, 'Card not found');
    }
    if (newColumnId) {
      await Column.findByIdAndUpdate(newColumnId, { $push: { cards: updatedCard._id } }, { new: true });
    }

    res.json({
      status: 200,
      message: `Successfully updated Card with id ${cardId}!`,
      data: updatedCard,
    });
  } catch (error) {
    next(error);
  }
};








export const moveCardController = async (req, res, next) => {
  try {
    const { cardId } = req.params;
    const { columnId } = req.body;

    if (!cardId || !columnId) {
      return next(createError(400, 'Card ID and Column ID are required.'));
    }

    const card = await Card.findById(cardId);

    if (!card) {
      return next(createError(404, 'Card not found.'));
    }

    card.columnId = columnId;
    await card.save();

    const targetColumn = await Column.findById(columnId);

    if (!targetColumn) {
      return next(createError(404, 'Target column not found.'));
    }

    if (!targetColumn.cards.includes(card._id)) {
      targetColumn.cards.push(card._id);
      await targetColumn.save();
    }

    res.status(200).json({
      message: 'Card moved successfully',
      card,
    });
  } catch (error) {
    console.error('Error while moving card:', error);
    next(error);
  }
};
