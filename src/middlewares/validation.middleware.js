import { validationResult } from 'express-validator';

/**
 * Middleware para validar resultados da validação
 */
export const validate = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Dados inválidos',
      details: errors.array()
    });
  }
  
  next();
};
