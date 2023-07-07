// middleware/auth.js
function authorize(req, res, next) {
    if (req.session.userId) {
        // User is logged in
        next();
    } else {
        // User is not logged in
        //res.redirect("/login");
        res.send("log in to proceed")
    }
}

module.exports = authorize;