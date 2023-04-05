export const userPermision = (req, res, next) => {
    const statusRol = req.cookies.userInfo;
    if (statusRol) {
        if (statusRol.rol !== 'admin' || statusRol.rol === 'user' || statusRol === 'undefined' || statusRol === null) { 
            res.status(403).redirect('/users/notAuthorized'); 
        } else {
            next();    
        }
    } else {
        res.status(403).redirect('/users/notAuthorized')
    }
}

