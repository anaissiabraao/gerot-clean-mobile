import express from 'express';
import { body } from 'express-validator';
import {
  getAllInvoices,
  getInvoiceById,
  createInvoice,
  updateInvoice,
  deleteInvoice
} from '../controllers/invoice.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validation.middleware.js';

const router = express.Router();

// Todas as rotas requerem autenticação
router.use(authenticate);

// Validações
const createInvoiceValidation = [
  body('clientId').notEmpty().withMessage('ID do cliente é obrigatório'),
  body('valorTotal').isFloat({ min: 0 }).withMessage('Valor total deve ser um número positivo')
];

// Rotas
router.get('/', getAllInvoices);
router.get('/:id', getInvoiceById);
router.post('/', createInvoiceValidation, validate, createInvoice);
router.put('/:id', updateInvoice);
router.delete('/:id', deleteInvoice);

export default router;
