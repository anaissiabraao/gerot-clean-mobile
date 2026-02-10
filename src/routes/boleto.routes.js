import express from 'express';
import { body } from 'express-validator';
import {
  getAllBoletos,
  getBoletoById,
  createBoleto,
  updateBoletoStatus
} from '../controllers/boleto.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validation.middleware.js';

const router = express.Router();

// Todas as rotas requerem autenticação
router.use(authenticate);

// Validações
const createBoletoValidation = [
  body('cteId').isUUID().withMessage('ID do CT-e inválido'),
  body('valor').isFloat({ min: 0 }).withMessage('Valor deve ser um número positivo'),
  body('vencimentoDias').optional().isInt({ min: 1 }).withMessage('Dias de vencimento inválidos')
];

const updateBoletoValidation = [
  body('status').isIn(['PENDENTE', 'GERADO', 'ENVIADO', 'PAGO', 'VENCIDO', 'CANCELADO'])
];

// Rotas
router.get('/', getAllBoletos);
router.get('/:id', getBoletoById);
router.post('/', createBoletoValidation, validate, createBoleto);
router.put('/:id/status', updateBoletoValidation, validate, updateBoletoStatus);

export default router;
