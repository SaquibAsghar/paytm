const validateMiddleware = (inputBody) => (
    (req, res, next) => {
    console.log(`request body, ${req.body}`);
    console.log(__filename)
    // const { success, error, data } = inputBody.safeParse(req.body);
    // if (!success) {
    //     return res.status(411).json({
    //     success,
    //     error,
    //     });
    // }
    console.log("1st middleware");
    res.locals.myUserName = "syed saquib asghar"
    next();
});

function middleware2(req, res, next) {
    console.log("2nd middleware")
    console.log(res.locals.myUserName);
    next();
} 

function middleware3(req, res) {
    res.status(301).json({
        msg: 'Solved!',
    })
}
module.exports = {
    validateMiddleware,
    middleware2,
    middleware3
};
