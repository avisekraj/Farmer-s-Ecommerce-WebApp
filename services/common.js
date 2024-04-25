const passport = require('passport');

exports.isAuth = (req, res, done) => {
    return passport.authenticate('jwt');
};

exports.sanitizeuser = (user) => {
    return { id: user.id, role: user.role }
}

exports.cookieExtractor = function (req) {
    let token = null;
    if (req && req.cookies) {
        token = req.cookies['jwt'];
    }
    // token="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2MTkwMGNhNGZmNzEwYWNmMmMwOTFkNCIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzEyOTE4ODk4fQ.bpZiBu4cwGXU-B_2CkOz2B6e3K21hOGhJXfRz0bSCz0"
    return token;
};

// keyid=rzp_test_UQkhZssdSXYHpp
// keyAPI=7jOw3TN0NZCIBTaWU7QvnUJ9