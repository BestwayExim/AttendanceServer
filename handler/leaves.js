const LateComing = require('../schema/lateComing')
const Leave = require('../schema/leaveSchema')
const WorkFromHome = require('../schema/workFromHomeSchema')

const lateComing = async (req, res) => {
    try {
        const user = req?.user?._id;
        let { date, time, reason } = req.body;
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        const timeRegex = /^\d{2}:\d{2}:\d{2}$/;

        if (!date || !time || !reason) {
            return res.status(400).json({ message: "Date and Time are required" });
        }

        if (!dateRegex.test(date)) {
            return res.status(400).json({ message: "Invalid Date format. Use YYYY-MM-DD." });
        }

        if (!timeRegex.test(time)) {
            return res.status(400).json({ message: "Invalid Time format. Use HH:MM:SS." });
        }
        const parsedDate = new Date(date);

        const totalLateComingPerMonth = await LateComing.countDocuments({
            userId: user,
            date: {
                $gte: new Date(parsedDate.getFullYear(), parsedDate.getMonth(), 1),
                $lt: new Date(parsedDate.getFullYear(), parsedDate.getMonth() + 1, 1)
            }
        });

        if (totalLateComingPerMonth >= 4) {
            return res.status(400).json({ message: "You have already applied for Total late coming for this month" });
        }

        if (isNaN(parsedDate.getTime())) {
            return res.status(400).json({ message: "Invalid Date value." });
        }

        console.log('before new', process.env.WORKING_START)
        const workingStartTime = new Date(process.env.WORKING_START);
        console.log('after new', workingStartTime)
        workingStartTime.setFullYear(parsedDate.getFullYear());
        workingStartTime.setMonth(parsedDate.getMonth());
        workingStartTime.setDate(parsedDate.getDate());

        let lateAllowedTime = workingStartTime;
        lateAllowedTime.setMinutes(lateAllowedTime.getMinutes() - 15);

        // Check if the request is being made too late
        if (lateAllowedTime < new Date()) {
            return res.status(400).json({ message: "You must apply at least 15 minutes before the start time." });
        }

        const year = parsedDate.getFullYear();
        const month = String(parsedDate.getMonth() + 1).padStart(2, '0');
        const day = String(parsedDate.getDate()).padStart(2, '0');
        const dateTimeString = `${year}-${month}-${day}T${time}`;


        const arrivalDateTime = new Date(dateTimeString);
        if (isNaN(arrivalDateTime.getTime())) {
            return res.status(400).json({ message: "Invalid Date and Time values." });
        }

        const newLateComing = new LateComing({
            userId: user,
            date: parsedDate.toISOString().split('T')[0],
            arrivalTime: arrivalDateTime,
            reason: reason
        });
        await newLateComing.save();


        return res.status(200).json({ message: "Late Coming Applied Successfully" });

    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: 'Validation Error', error: error.message });
        }
        return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
}

const applyForLeave = async (req, res) => {
    try {

        const user = req?.user?._id;
        let { startDate, endDate, reason } = req.body;
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;


        if (!startDate || !endDate || !reason) {
            return res.status(400).json({ message: "Date and reason are required" });
        }

        if (!dateRegex.test(startDate)) {
            return res.status(400).json({ message: "Invalid Date format - Start Date. Use YYYY-MM-DD." });
        }
        if (!dateRegex.test(endDate)) {
            return res.status(400).json({ message: "Invalid Date format - End Date. Use YYYY-MM-DD." });
        }

        startDate = new Date(startDate);
        endDate = new Date(endDate);

        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(23, 59, 59, 999);
        // Validate date range
        if (startDate > endDate) {
            return res.status(400).json({ message: "Start Date cannot be after End Date." });
        }
        // Check for existing leave applications
        const existingLeaves = await Leave.find({
            userId: user,
            $or: [
                {
                    startDate: { $lte: endDate, $gte: startDate }
                },
                {
                    endDate: { $gte: startDate, $lte: endDate }
                },
            ]
        });

        if (existingLeaves.length > 0) {
            return res.status(400).json({ message: "Leave application overlaps with an existing application." });
        }

        const newLeave = new Leave({
            userId: user,
            startDate,
            endDate,
            reason
        });
        await newLeave.save();


        return res.status(200).json({ message: "Leave Applied Successfully" });
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: 'Validation Error', error: error.message });
        }
        return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
}

const applyForWorkFromHome = async (req, res) => {
    try {
        const user = req?.user?._id;
        let { startDate, endDate, reason } = req.body;
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;


        if (!startDate || !endDate || !reason) {
            return res.status(400).json({ message: "Date and reason are required" });
        }

        if (!dateRegex.test(startDate)) {
            return res.status(400).json({ message: "Invalid Date format - Start Date. Use YYYY-MM-DD." });
        }
        if (!dateRegex.test(endDate)) {
            return res.status(400).json({ message: "Invalid Date format - End Date. Use YYYY-MM-DD." });
        }

        startDate = new Date(startDate);
        endDate = new Date(endDate);


        // Validate date range
        if (startDate > endDate) {
            return res.status(400).json({ message: "Start Date cannot be after End Date." });
        }
        // Check for existing leave applications
        const existingLeaves = await WorkFromHome.find({
            userId: user,
            $or: [
                {
                    startDate: { $lte: endDate, $gte: startDate }
                },
                {
                    endDate: { $gte: startDate, $lte: endDate }
                },
            ]
        });

        if (existingLeaves.length > 0) {
            return res.status(400).json({ message: "Leave application overlaps with an existing application." });
        }
        const newWorkFromHome = new WorkFromHome({
            userId: user,
            startDate,
            endDate,
            reason
        });
        await newWorkFromHome.save();

        return res.status(200).json({ message: "Work From Home Applied Successfully" });
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: 'Validation Error', error: error.message });
        }
        return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
}


module.exports = {
    lateComing, applyForLeave, applyForWorkFromHome
}