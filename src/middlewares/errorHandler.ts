const errorHandler = (req, res, next) => {
    console.log(`error Handler`);
    next();
}

export default errorHandler;
