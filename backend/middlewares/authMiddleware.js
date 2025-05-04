const checkAdmin = (req, res, next) => {
    const { role } = req.user;
    if (role !== 'admin') {
        return res.status(403).send('You do not have permission to perform this action');
    }
    next();
};

app.use('/create-channel', checkAdmin);
