export function webAuth(req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.status(401).redirect('/login');
    }    
}

export function apiAuth(req, res, next) {
    next();
}