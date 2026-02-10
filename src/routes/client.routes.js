import express from 'express';
import { body, query } from 'express-validator';
import {
  getAllClients,
  getClientById,
  createClient,
  updateClient,
  deleteClient
} from '../controllers/client.controller.js';
import { authenticate, authorize } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validation.middleware.js';

const router = express.Router();

// Todas as rotas requerem autenticação
router.use(authenticate);

// Validações
const createClientValidation = [
  body('cnpj').trim().notEmpty().withMessage('CNPJ é obrigatório'),
  body('razaoSocial').trim().notEmpty().withMessage('Razão social é obrigatória'),
  body('emailFaturamento').optional().isEmail().withMessage('Email inválido')
];

const updateClientValidation = [
  body('razaoSocial').optional().trim().notEmpty().withMessage('Razão social não pode ser vazia'),
  body('emailFaturamento').optional().isEmail().withMessage('Email inválido')
];

// Rotas
router.get('/', getAllClients);
router.get('/:id', getClientById);
router.post('/', createClientValidation, validate, createClient);
router.put('/:id', updateClientValidation, validate, updateClient);
router.delete('/:id', authorize('ADMIN'), deleteClient);

export default router;
