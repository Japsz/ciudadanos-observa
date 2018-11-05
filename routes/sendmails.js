var fs = require('fs');
var nodemailer = require("nodemailer");
var ejs = require("ejs");

// Servicio utilizado por nodemailer
var transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: 'observaciudadania17@gmail.com',
        pass: 'proyectaobserva'
    }
});

var send = {};

// Funcion para enviar mails
/* Parametros: 
    String: path_vista
    List string: name,id_proyecto
    List string: correos
*/
send.send_mail = function(data, res){
	ejs.renderFile(__dirname.split("routes")[0] + data.view , { data: data.inf }, function (err, html) {
        if(err) { console.log(err);
        } else {
            var mainOptions = {
                from: 'no-reply@example.com',
                to: data.mails,
                subject: data.subject,
                html: html
            };
            transporter.sendMail(mainOptions, function (errs, info) {
                if(errs) { console.log(errs);
                } else {
                    console.log('Mensaje enviado a: ' + data.mails);
                }
            });
        }
    });
};

//exportamos el objeto para tenerlo disponible en la zona de rutas
module.exports = send;