import { Card } from '../db/cards.js';

export const getAllCards = async (boardId, columnId) => {
  return await Card.find({ boardId, columnId });
};

export const getCardById = async (cardId, boardId) => {
  return await Card.findOne({ _id: cardId, boardId });
};

export const createCard = async (payload) => {
  return await Card.create(payload);
};

export const updateCard = async (cardId, boardId, payload) => {
  return await Card.findOneAndUpdate({ _id: cardId, boardId }, payload, { new: true });
};

export const deleteCard = async (cardId, boardId) => {
  return await Card.findOneAndDelete({ _id: cardId, boardId });
};