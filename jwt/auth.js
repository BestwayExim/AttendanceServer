const { decode } = require('jsonwebtoken');
const User = require('../schema/userSchema');
const { verifyToken } = require('./generate');



const protectAdmin = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            if (token) {
                const decoded = verifyToken(token);
                if (decoded.id._id == process.env.ADMIN_ID) {
                    req.admin = process.env.ADMIN_ID;
                    next();
                } else {
                    return res.status(403).json({ status: false, message: 'Invalid token' });
                }
            }
        } catch (error) {
            if (error.message == 'jwt expired') {
                return res.status(399).json({ status: false, message: 'Token expired' });
            } else {
                return res.status(403).json({ status: false, message: 'Invalid token' });
            }
        }
    }
    if (!token) {
        return res.status(401).json({ status: false, message: 'Token not found' });
    }
};

const protectUser = async (req, res, next) => {
    try {
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
            if (token) {
                const decoded = verifyToken(token);
                console.log('decoded', decoded)
                const user = await User.findById(decoded.id).select('-password');

                if (!user) {
                    return res.status(403).json({ status: false, message: 'Invalid token' });
                }

                req.user = user;
                next();
            }
        }
        if (!token) {
            return res.status(401).json({ status: false, message: 'Token not found' });
        }
    } catch (error) {
        if (error.message == 'jwt expired') {
            return res.status(399).json({ status: false, message: 'Token expired' });
        } else {
            return res.status(403).json({ status: false, message: 'Invalid token' });
        }
    }
};



module.exports = { protectAdmin, protectUser };