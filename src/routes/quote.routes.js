import express from 'express';
import { body } from 'express-validator';
import {
  getAllQuotes,
  getQuoteById,
  createQuote,
  updateQuote,
  deleteQuote
} from '../controllers/quote.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validation.middleware.js';

const router = express.Router();

// Todas as rotas requerem autenticação
router.use(authenticate);

// Validações
const createQuoteValidation = [
  body('clientId').notEmpty().withMessage('ID do cliente é obrigatório'),
  body('origem').trim().notEmpty().withMessage('Origem é obrigatória'),
  body('destino').trim().notEmpty().withMessage('Destino é obrigatório'),
  body('peso').isFloat({ min: 0 }).withMessage('Peso deve ser um número positivo'),
  body('cubagem').isFloat({ min: 0 }).withMessage('Cubagem deve ser um número positivo'),
  body('valor').isFloat({ min: 0 }).withMessage('Valor deve ser um número positivo')
];

const updateQuoteValidation = [
  body('peso').optional().isFloat({ min: 0 }).withMessage('Peso deve ser um número positivo'),
  body('cubagem').optional().isFloat({ min: 0 }).withMessage('Cubagem deve ser um número positivo'),
  body('valor').optional().isFloat({ min: 0 }).withMessage('Valor deve ser um número positivo'),
  body('status').optional().isIn(['PENDENTE', 'APROVADA', 'REJEITADA', 'EM_TRANSITO', 'CONCLUIDA', 'CANCELADA'])
];

// Rotas
router.get('/', getAllQuotes);
router.get('/:id', getQuoteById);
router.post('/', createQuoteValidation, validate, createQuote);
router.put('/:id', updateQuoteValidation, validate, updateQuote);
router.delete('/:id', deleteQuote);

export default router;
