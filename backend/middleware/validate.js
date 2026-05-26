export function requireFields(fields) {
  return function validateRequiredFields(req, res, next) {
    const missing = fields.filter(field => req.body[field] === undefined || req.body[field] === '');
    if (missing.length) {
      return res.status(400).json({ success: false, message: `Missing required fields: ${missing.join(', ')}` });
    }
    next();
  };
}
