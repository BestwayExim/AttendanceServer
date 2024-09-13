const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');
const path = require('path');


const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.NODEMAILER_USER,
        pass: process.env.NODEMAILER_PASS,
    }
});

const templatePath = path.join(__dirname, '..', 'templates');

const handlebarOptions = {
    viewEngine: {
        extName: '.handlebars',
        partialsDir: templatePath,
        defaultLayout: false,
    },
    viewPath: templatePath,
    extName: '.handlebars',
};

transporter.use('compile', hbs(handlebarOptions));


const emailReportController = async (req, res) => {
    try {
        const mailOptions = {
            from: '"OWPMF" <mail.musthak@gmail.com>',
            to: 'hr@owpmf.tech',
            subject: 'Attendance Summary',
            template: 'attendanceReport',
            context: {
                date: new Date().toLocaleDateString(),
                day: new Date().toLocaleDateString('en-US', { weekday: 'long' }),
                employees: [
                    { name: 'Ananthu', status: 'present' },
                    { name: 'Aswin', status: 'absent' },
                    { name: 'Riswin', status: 'late' },
                    { name: 'Musthakk', status: 'late' },
                    { name: 'Nithin', status: 'wfh' },
                    { name: 'Jafar', status: 'wfh' },
                    { name: 'Abdu', status: 'present' },
                    { name: 'Nehla', status: 'present' }
                ]
            }
        };
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
            console.log('Message sent: %s', info.messageId);
            res.send('Email sent successfully');
        });
    } catch (error) {
        console.log(error);
        res.send('Failed to send email');
    }
};

module.exports = emailReportController;