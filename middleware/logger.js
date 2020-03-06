// @desc        LOGS request to console
const logger = (req, res, next) => {
  console.log(
    `${req.method} ${req.protocol}://${req.get('host')}${req.originalUrl}`.cyan
      .bold
  );
  next();
};

module.exports = logger;
