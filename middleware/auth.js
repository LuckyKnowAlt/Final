module.exports = {
    ensureAuthenticated: (req, res, next) => {
        if (req.isAuthenticated()) return next();
        res.redirect('/login');
    },
    checkRole: (role) => {
        return (req, res, next) => {
            if (req.user && req.user.role === role) return next();
            res.status(403).send('Denied');
        };
    }
};
