const notFound = (req,res,next) =>{
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
};
// Runs after all routes, if none of them match , Creates a new Error object with the message "Not Found - <path>" Passes the error to the next middleware (errorHandler) using next(error)




const errorHandler = (err , req, res , next) =>{
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);
    res.json({
        message : err.message ,
        stack : process.env.NODE_ENV ===  "production" ? null : err.stack,
    });
};
//  This is a centralized error handler, which: Checks the current status code; if it's still 200, sets it to 500 (internal server error) , 
// Sends a JSON response with:
// message: the error message
// stack: the error stack trace (only in dev mode, hidden in production)




module.exports = {notFound , errorHandler};