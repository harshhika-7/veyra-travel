
const jwt = require('jsonwebtoken')

function requireCustomer(req, res, next) {
  const authorization = req.headers.authorization || ''
  const [scheme, token, extra] = authorization.split(' ')

  if (scheme !== 'Bearer' || !token || extra) {
    return res.status(401).json({
      success: false,
      message: 'Please log in to continue.',
    })
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET,
      { algorithms: ['HS256'] }
    )

    if (
      decoded.role !== 'customer' ||
      !decoded.userId
    ) {
      return res.status(403).json({
        success: false,
        message: 'Customer access required.',
      })
    }

    req.customerId = decoded.userId
    next()
  } catch {
    return res.status(401).json({
      success: false,
      message: 'Your session has expired. Please log in again.',
    })
  }
}

module.exports = requireCustomer
