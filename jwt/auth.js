const { decode } = require('jsonwebtoken');
const Vendor = require('../schema/vendor/vendorSchema');
const User = require('../schema/user/userSchema');
const DeliveryBoy = require('../schema/delivery/deliveryBoySchema')
const { verifyToken } = require('./generate');


const protectVendor = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            if (token) {
                const decoded = verifyToken(token);
                const vendor = await Vendor.findById(decoded.id._id).select('-password');
                if (vendor.isBlocked) {
                    return res.status(403).json({ status: false, message: 'You are blocked by the admin' });
                }
                req.vendor = vendor;
                next();
            }
        } catch (error) {
            console.log(error);
            if (error.message === 'jwt expired') {
                return res.status(399).json({ status: false, message: 'Token expired' });
            } else {
                return res.status(405).json({ status: false, message: 'Invalid token' });
            }
        }
    }
    if (!token) {
        return res.status(401).json({ status: false, message: 'Token not found' });
    }
}


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
                const user = await User.findById(decoded.id).select('-password');

                if (!user) {
                    return res.status(403).json({ status: false, message: 'Invalid token' });
                }

                if (user?.isBlocked) {
                    return res.status(403).json({ status: false, message: 'You are blocked by the admin' });
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

const protectDeliveryBoy = async (req, res, next) => {
    try {
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
            if (token) {
                const decoded = verifyToken(token);
                const deliveryBoy = await DeliveryBoy.findById(decoded.id).select('-password');
                if (deliveryBoy.isBlocked) {
                    return res.status(403).json({ status: false, message: 'You are blocked by the admin' });
                }
                if (deliveryBoy.isDeleted) {
                    return res.status(403).json({ status: false, message: 'You are deleted by the admin' });
                }
                req.deliveryBoy = deliveryBoy;
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
}


module.exports = { protectVendor, protectAdmin, protectUser, protectDeliveryBoy };