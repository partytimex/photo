var nodemailer = require('nodemailer');
module.exports = {
    send: function(data) {
        var user = 'partytimex@hotmail.com',
            pass = ' ';
        var smtpTransport = nodemailer.createTransport("SMTP", {
            service: "QQ",
            auth: {
                user: user,
                pass: pass
            }
        });

        smtpTransport.sendMail({
            from: 'Bugs<' + user + '>',
            to: '<partytimex@hotmal.com>',
            subject: data.title || new Date().toLocaleString(),
            html: '<pre>' + data.message + '<br>' + data.stack + '</pre>'
        }, function(err, res) {
            if (err) {
                console.log(err);
            } else {
                console.log(res);
            }
        });
    }
};