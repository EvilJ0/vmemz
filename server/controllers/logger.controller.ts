import * as express from 'express'

const requestLoggerMiddleware= (req: express.Request,res: express.Response, next:express.NextFunction)=>{
  console.info(`${req.method} ${req.originalUrl} ${req.body.username}`);
  const start=new Date().getTime();
  res.on('finished',()=> {
    const elapsed = new Date().getTime() - start;
    console.info(`${req.method} ${req.originalUrl} ${res.statusCode} ${elapsed}ms ${req.body.name}`)
  })
  next();
}

export {requestLoggerMiddleware}
