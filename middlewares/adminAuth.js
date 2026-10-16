const isAdmin = (req, res, next) => {
    if (req.user.admin) {
        return next()
    }
    res.status(401).json({
        message: 'you are not authorized to access this resources.'
    })
}

export { isAdmin };