const User = require('../schema/userSchema')
const bcrypt = require('bcrypt');
const { generateToken } = require('../jwt/generate')
const LateComing = require('../schema/lateComing')
const Attendance = require('../schema/attendance')
const { lateComing, applyForLeave, applyForWorkFromHome } = require('../handler/leaves')

const login = async (req, res) => {
    try {

        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Invalid Email" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid Password" });
        }
        const token = await generateToken(user._id, '3h');
        return res.status(200).json({ message: "Login Successful", token });

    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
}

const applyForLeaves = async (req, res) => {
    try {

        const { leaveType } = req.body;
        const leaveEnum = ['lateComing', 'workFromHome', 'leave']
        if (!leaveType || !leaveEnum.includes(leaveType)) {
            return res.status(400).json({ message: "Invalid leave type" });
        }

        if (leaveType == 'lateComing') {
            await lateComing(req, res)
        } else if (leaveType == 'leave') {
            await applyForLeave(req, res)
        } else if (leaveType == 'workFromHome') {
            await applyForWorkFromHome(req, res)
        }

    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: 'Validation Error', error: error.message });
        }
        return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
}

const getAttendanceData = async (req, res) => {
    try {
        const user = req?.user?._id;
        const today = new Date();
        const attendanceFilterMonth = req.query.attendanceFilterMonth || today.getMonth() + 1;
        const attendanceReportFilterMonth = req.query.attendanceReportFilterMonth || today.getMonth() + 1;
        const todayStr = today.toISOString().split('T')[0];


        // attendance Report

        const presentDays = await Attendance.countDocuments({
            userId: user,
            isLeave: false,
            date: {
                $gte: new Date(today.getFullYear(), attendanceReportFilterMonth - 1, 1),
                $lt: new Date(today.getFullYear(), attendanceReportFilterMonth + 1, 1)
            }
        });

        const absentDays = await Attendance.countDocuments({
            userId: user,
            isLeave: true,
            date: {
                $gte: new Date(today.getFullYear(), attendanceReportFilterMonth - 1, 1),
                $lt: new Date(today.getFullYear(), attendanceReportFilterMonth + 1, 1)
            }
        });

        const lateArrival = await LateComing.countDocuments({
            userId: user,
            date: {
                $gte: new Date(today.getFullYear(), attendanceReportFilterMonth - 1, 1),
                $lt: new Date(today.getFullYear(), attendanceReportFilterMonth + 1, 1)
            }
        });

        const leaveDays = 0;

        let attendanceReport = {
            presentDays,
            absentDays,
            lateArrival,
            leaveDays
        };

        // -----------------------------------------------------------
        // attendance filtering  - calendar showing the  attendance of the user
        let presentDaysArray = [];
        let absentDaysArray = [];
        let publicHolidays = [];

        presentDaysArray = await Attendance.find({
            userId: user,
            isLeave: false,
            isCheckedIn: true,
            date: {
                $gte: new Date(today.getFullYear(), attendanceFilterMonth - 1, 1),
                $lt: new Date(today.getFullYear(), attendanceFilterMonth + 1, 1)
            }
        })
            .select('date')


        absentDaysArray = await Attendance.find({
            userId: user,
            isLeave: true,
            date: {
                $gte: new Date(today.getFullYear(), attendanceFilterMonth - 1, 1),
                $lt: new Date(today.getFullYear(), attendanceFilterMonth + 1, 1)
            }
        })
            .select('date');


        publicHolidays = getWeekendDays(attendanceFilterMonth - 1, today.getFullYear());

        const calendarData = {
            presentDaysArray,
            absentDaysArray,
            publicHolidays
        };


        // ------------------------------------------------------------------------
        // work start and end time
        const workStartTime = new Date(process.env.WORKING_START);
        const workEndTime = new Date(process.env.WORKING_END);


        // checkIn and checkout time
        let checkInTime = new Date(process.env.WORKING_START);
        let checkOutTime = new Date(process.env.WORKING_END);

        const lateComing = await LateComing.findOne({ userId: user, date: { $gte: todayStr + 'T00:00:00.000Z', $lt: todayStr + 'T23:59:59.999Z' } });
        if (lateComing) {
            checkInTime = lateComing.arrivalTime
            checkOutTime = new Date(checkInTime);
            checkOutTime.setHours(checkInTime.getHours() + 8);
        }


        res.status(200).json({
            message: 'Attendance Data',
            checkInTime,
            checkOutTime,
            workStartTime,
            workEndTime,
            attendanceReport,
            calendarData

        })


    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
}

const checkInCheckOut = async (req, res) => {
    try {
        const maxDistanceInKm = 0.05
        const user = req?.user?._id;
        const { checkIn, lat, lng } = req.body;
        if (!lat || !lng) {
            return res.status(400).json({ message: "Check In and Location are required" });
        }
        if (checkIn == undefined || checkIn == null) {
            return res.status(400).json({ message: "Check In and Location are required" });
        }

        const today = new Date();
        const todayStr = today.toISOString().split('T')[0];

        const distance = calculateDistance(lat, lng, process.env.OFFICE_LATITUDE, process.env.OFFICE_LONGITUDE);
        if (distance > maxDistanceInKm) {
            return res.status(400).json({ message: "You are out of office" });
        }

        const startOfDay = new Date(today.setHours(0, 0, 0, 0));
        const endOfDay = new Date(today.setHours(23, 59, 59, 999));

        const isLeave = await Attendance.findOne({ userId: user, date: { $gte: startOfDay, $lt: endOfDay } });
        if (isLeave && isLeave?.isLeave == true) {
            return res.status(400).json({ message: "You are on leave" });
        }

        // checkIn and checkout time
        let checkInTime = new Date(process.env.WORKING_START);
        let checkOutTime = new Date(process.env.WORKING_END);

        checkInTime.setDate(today.getDate());
        checkInTime.setMonth(today.getMonth());
        checkInTime.setFullYear(today.getFullYear());

        checkOutTime.setDate(today.getDate());
        checkOutTime.setMonth(today.getMonth());
        checkOutTime.setFullYear(today.getFullYear());


        let isLateArrived = false;

        const lateComing = await LateComing.findOne({ userId: user, date: { $gte: todayStr + 'T00:00:00.000Z', $lt: todayStr + 'T23:59:59.999Z' } });
        if (lateComing) {
            isLateArrived = true;
            checkInTime = lateComing.arrivalTime
            checkOutTime = new Date(checkInTime);
            checkOutTime.setHours(checkInTime.getHours() + 8);
        }

        // checkIn true & checkOut false
        if (checkIn == true) {

            if (new Date() > checkInTime) {
                return res.status(400).json({ message: "You are late" });

            }

            const start = new Date(process.env.WORKING_START)
            start.setDate(today.getDate());
            start.setMonth(today.getMonth());
            start.setFullYear(today.getFullYear());

            if (isLateArrived == true && new Date() <= start) {
                isLateArrived = false;
                await LateComing.findOneAndDelete({ userId: user, date: { $gte: todayStr + 'T00:00:00.000Z', $lt: todayStr + 'T23:59:59.999Z' } });
            }

            const isAlreadyCheckedIn = await Attendance.findOne({ userId: user, date: { $gte: startOfDay, $lt: endOfDay }, isCheckedIn: true, isLeave: false });
            if (!isAlreadyCheckedIn) {
                const newAttendance = new Attendance({
                    userId: user,
                    date: new Date(),
                    checkIn: new Date(),
                    isCheckedIn: true,
                    isLateArrived,
                    isLeave: false
                })
                await newAttendance.save();
            } else {
                return res.status(400).json({ message: "You are already checked in" });
            }
        }

        if (checkIn == false) {
            if (new Date() < checkOutTime) {
                if (new Date() < checkInTime) {
                    return res.status(400).json({ message: "You are not checked in" });
                }

                const isAlreadyCheckedIn = await Attendance.findOne({ userId: user, date: { $gte: startOfDay, $lt: endOfDay }, isCheckedIn: true, isLeave: false });
                if (!isAlreadyCheckedIn) {
                    return res.status(400).json({ message: "You are not checked in" });
                }

                if (isAlreadyCheckedIn?.isCheckedOut) {
                    return res.status(400).json({ message: "You are already checked out" });
                }

                isAlreadyCheckedIn.isCheckedOut = true;
                isAlreadyCheckedIn.checkout = new Date();
                await isAlreadyCheckedIn.save();

            } else {
                return res.status(400).json({ message: "You are late " });
            }
        }

        res.status(200).json({ message: "Attendance Updated Successfully" });

    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
}

module.exports = {
    login, applyForLeaves, getAttendanceData, checkInCheckOut
}




function toRadians(degrees) {
    return degrees * (Math.PI / 180);
}

function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the earth in km
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
}



function getWeekendDays(year, month) {
    const weekendDays = [];
    const date = new Date(year, month - 1, 1);

    // Loop through all days of the month
    while (date.getMonth() === month - 1) {
        const dayOfWeek = date.getDay();

        // Check if it's Saturday (6) or Sunday (0)
        if (dayOfWeek === 0 || dayOfWeek === 6) {
            weekendDays.push(new Date(date));
        }

        date.setDate(date.getDate() + 1);
    }

    return weekendDays;
}