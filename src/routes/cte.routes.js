import express from 'express';
import { body } from 'express-validator';
import {
  emitirCte,
  consultarStatusCte,
  getAllCtes,
  getCteById
} from '../controllers/cte.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validation.middleware.js';

const router = express.Router();

// Todas as rotas requerem autenticação
router.use(authenticate);

// Validações
const emitirCteValidation = [
  body('quoteId').optional().isUUID().withMessage('ID da cotação inválido'),
  body('invoiceId').optional().isUUID().withMessage('ID da nota fiscal inválido'),
  body('numeroCte').optional().isString().withMessage('Número do CT-e inválido')
];

// Rotas
router.post('/emitir', emitirCteValidation, validate, emitirCte);
router.get('/status/:chave', consultarStatusCte);
router.get('/', getAllCtes);
router.get('/:id', getCteById);

export default router;
