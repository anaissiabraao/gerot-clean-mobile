import express from 'express';
import { body } from 'express-validator';
import {
  emitirMdfe,
  encerrarMdfeController,
  consultarStatusMdfe,
  getAllMdfes,
  getMdfeById
} from '../controllers/mdfe.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validation.middleware.js';

const router = express.Router();

// Todas as rotas requerem autenticação
router.use(authenticate);

// Validações
const emitirMdfeValidation = [
  body('cteIds').isArray({ min: 1 }).withMessage('É necessário informar pelo menos um CT-e'),
  body('cteIds.*').isUUID().withMessage('ID do CT-e inválido')
];

// Rotas
router.post('/emitir', emitirMdfeValidation, validate, emitirMdfe);
router.post('/encerrar/:id', encerrarMdfeController);
router.get('/status/:chave', consultarStatusMdfe);
router.get('/', getAllMdfes);
router.get('/:id', getMdfeById);

export default router;
