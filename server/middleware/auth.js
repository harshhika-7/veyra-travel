
const jwt = require('jsonwebtoken')

function requireAdmin(req, res, next) {
  const authorization = req.headers.authorization || ''

  const [scheme, token] = authorization.split(' ')

  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({
      success: false,
      message: 'Admin authentication required.',
    })
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET,
      { algorithms: ['HS256'] }
    )

    if (decoded.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied.',
      })
    }

    req.admin = decoded
    next()
  } catch {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired login session.',
    })
  }
}

module.exports = requireAdmin
