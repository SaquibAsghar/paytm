const validateMiddleware = (inputBody) => (
    (req, res, next) => {
    console.log(`${inputBody} request body, ${req.body}`);
});
module.exports = {
    validateMiddleware,
};
