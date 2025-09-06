function loggingMiddleware(req, res, next) {
  const start = Date.now();
  
  res.on("finish", () => {
    const duration = Date.now() - start;
    console.log(JSON.stringify({
      time: new Date().toISOString(),
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      duration: `${duration}ms`,
      body: req.method === 'POST' ? req.body : undefined
    }));
  });

  next();
}

module.exports = loggingMiddleware;
