var send = require('../routes/sendmails'); //Importar la funcion para enviar mail

// Logica agregar cdd a obs.
exports.save_cdd = function(req,res){
    if(req.session.isUserLogged && req.session.user.tipo == 1){
        var input = req.body;
        var generator = require('generate-password');
        // Generar clave alfanumérica
        var pass = generator.generate({length : 7,numbers : true});
        req.getConnection(function (err, connection) {

            var data = {
                username : input.correo.split("@")[0],
                password   : pass,
                tipo	   : 3,
                correo	   : input.correo
            };
            //Verificar si el correo ya está registrado
            connection.query("SELECT * FROM user WHERE correo = ?",input.correo,function(err, rows)
            {
                if(err) console.log("Error Selecting correo: %s",err);
                if(rows.length){
                    // Si existe, vincularlo al observatorio
                    var idusuario = rows[0].iduser;
                    connection.query("INSERT INTO ciudadano SET ?",{idobs : input.idobs, iduser : rows[0].iduser}, function(err, rows)
                    {
                        if (err){
                            console.log("Error inserting cdd exist: %s ",err );
                            res.send({err:true,errmsg:"El correo ya está registrado en otro observatorio"});
                        } else {
                            // Volver a habilitar el usuario tipo 4 => tipo 3
                            connection.query("UPDATE user SET tipo = 3 WHERE correo = ?",input.correo, function(err, rows)
                            {
                                if (err) console.log("Error Inserting cdd : %s ", err);
                                    // Reactivacion de usuario y Envio de mail
                                    connection.query("SELECT nom FROM observatorio WHERE idobservatorio=?", input.idobs,function(err, rows)
                                    {
                                        if(err) {console.log("Error Selecting observatorio: %s",err);
                                        } else {
                                            //Variables para envio de correo, data_mail debe tener las mismas variables
                                            var obs = new Array(rows[0].nom, input.idobs); //Envia el nombre del obs y su id para la url
                                            var mails = new Array(input.correo); //Debe ser array!
                                            var subj = "Bienvenido al observatorio " + rows[0].nom;
                                            var data_mail = {
                                                view: "views\\monitor\\save_cdd.ejs", //Path
                                                subject: subj, //Asunto del mensaje
                                                inf: obs, //Array con informacion de observatorio
                                                mails: mails}; //Array de los correos
                                            send.send_mail(data_mail,function(err) {
                                                if(err){
                                                    console.log(err.message);
                                                }
                                                console.log("Se vinculo a " + input.correo + " a observatorio " + input.idobs + ", mail enviado correctamente.");
                                                res.send({err:false,insertId: idusuario});
                                            });
                                        }
                                    });
                            });
                        }
                    });
                } else {
                    var bcrypt = require('bcryptjs')
                    bcrypt.hash(data.password, 10, function(err, hash){
                        data.password = hash
                        // Si no está registrado el correo, crear usuario
                        connection.query("INSERT INTO user SET ? ",data, function(err, rows)
                        {

                            if (err){
                                console.log("Error inserting user: %s ",err );
                                res.send({err:true,errmsg: "Error al ingresar usuario"});

                            } else {
                                var idusuario = rows.insertId;
                                // Vincular usuario creado al observatorio
                                connection.query("INSERT INTO ciudadano SET ?",{idobs : input.idobs, iduser : rows.insertId}, function(err, rows)
                                {
                                    if (err){
                                        console.log("Error Inserting cdd nuevo: %s ", err);
                                        res.send({err:true,errmsg:"El Correo ya está registrado en otro observatorio"});
                                    } else {
                                        // Enviar correo de Usuario nuevo.
                                        res.mailer.send('mail', {
                                            to: input.correo, // REQUIRED. This can be a comma delimited string just like a normal email to field.
                                            subject: 'Estás Inscrito en ObservaCiudadanía!', // REQUIRED.
                                            password: pass,
                                            usrname: input.correo.split("@")[0]// All additional properties are also passed to the template as local variables.
                                        }, function (err) {
                                            if (err) {
                                                // handle error
                                                console.log(err);
                                                res.send({err:true,errmsg: 'Hubo un error al enviar el correo'});
                                            } else
                                                res.send({err:false,insertId: idusuario});
                                        });
                                    }
                                });
                            }
                        });
                    })
                }
            });


            // console.log(query.sql); get raw query

        });
    }
    else res.send({err:true,errmsg:"No deberias tener acceso a esta vista :c"});
};
//Conseguir la información de un observatorio específico
exports.get_obs = function(req, res){
    if(req.session.isUserLogged && req.session.user.tipo == 1){
        req.getConnection(function(err,connection){

            connection.query('SELECT * FROM observatorio WHERE idobservatorio = ?',req.params.idobs,function(err,rows)
            {

                if(err)
                    console.log("Error Selecting : %s ",err );
                var obs = rows[0];
                connection.query('SELECT user.*,ciudadano.medal FROM user LEFT JOIN ciudadano ON user.iduser = ciudadano.iduser WHERE idobs = ? GROUP BY user.iduser',req.params.idobs,function(err,rows)
                {

                    if(err)
                        console.log("Error Selecting : %s ",err );

                    res.render('monitor/get_obs',{data:rows,usr:req.session.user,obs : obs});

                });

            });
            //console.log(query.sql);
        });
    }
    else res.redirect('/bad_login');
};
//Conseguir todos los observatorios de un monitor
exports.obs_monit = function(req, res){
    if(req.session.isUserLogged && req.session.user.tipo == 1){
        req.getConnection(function(err,connection){
            if(err) console.log(err);
           connection.query("SELECT observatorio.* FROM observatorio LEFT JOIN monitor" +
               " ON monitor.idobservatorio = observatorio.idobservatorio WHERE idmonitor = ?",req.session.user.iduser,function(err,obs){
              if(err) console.log(err);
              req.session.idobs = obs;
              res.render('monitor/monit_obs',{page_title:"Observatorios",data:obs,usr:req.session.user, obs: obs});

           });
        });

    }
    else res.redirect('/bad_login');
};
//Cambiar el Badge de un ciudadano
exports.upd_medal = function(req, res){
    if((req.session.isUserLogged && req.session.user.tipo == 1) || req.session.isAdminLogged){
        req.getConnection(function(err,connection){
            if(err) console.log(err);
            connection.query("UPDATE ciudadano SET medal = ? WHERE iduser = ?",[req.body.medal,req.body.iduser],function(err,obs){
                if(err){
                    console.log(err);
                    res.send({err:true,errmsg:"Ocurrió un error al actualizar la información"});
                } else res.send({err:false,errmsg: "Exito"});
            });
        });
    }
    else res.send({err:true, errmsg:"DEJATE MALDITO JAKER"});
};
exports.drop_cdd = function (req, res) {
    if((req.session.isUserLogged && req.session.user.tipo == 1) || req.session.isAdminLogged){
        var input = JSON.parse(JSON.stringify(req.body));
        req.getConnection(function(err,connection){

            connection.query('DELETE FROM ciudadano WHERE iduser = ? AND idobs = ?',[input.iduser,input.idobs],function(err,rows)
            {

                if(err){
                    console.log("Error deleting : %s ",err );
                    res.redirect('/obs_usr/' + input.idobs);
                    return
                }
                connection.query('UPDATE user SET tipo = 4 WHERE iduser = ?',input.iduser,function(err,rows)
                {

                    if(err) console.log("Error Selecting : %s ",err );
                    connection.query('SELECT observatorio.idobservatorio, observatorio.nom, user.iduser, user.correo, user.username, user.tipo FROM user'
                        +' JOIN observatorio ON observatorio.idobservatorio = ' + input.idobs
                        +' WHERE user.iduser = ' + input.iduser, function(err,rows)
                        {
                        //Variables para envio de correo, data_mail debe tener las mismas variables
                        var obs = new Array(rows[0].nom, input.idobs); //Envia el nombre del obs y su id para la url
                        var mails = new Array(rows[0].correo); //Debe ser array!
                        var subj = "Eliminación del observatorio " + rows[0].nom;
                        var data_mail = {
                            view: "views\\admin\\obs\\obs_archive.ejs", //Path
                            subject: subj, //Asunto del mensaje
                            inf: obs, //Array con informacion de observatorio
                            mails: mails}; //Array de los correos
                        send.send_mail(data_mail,function(err) {
                            if(err){
                                console.log(err.message);
                            }
                        });
                        console.log("Se elimino a " + rows[0].correo + " de observatorio " + input.idobs + ", mail enviado correctamente.");
                        res.redirect('/obs_usr/' + input.idobs);
                    });

                });


            });
            //console.log(query.sql);
        });
    }
    else res.redirect('/bad_login');
};
exports.get_prepost = function(req, res){
    if(req.session.isUserLogged && req.session.user.tipo == 1){
        req.getConnection(function(err,connection){

            connection.query('SELECT post.*,user.username,ciudadano.idobs,GROUP_CONCAT(DISTINCT tags.tag ORDER BY tags.tag) AS tagz FROM' +
                ' post LEFT JOIN tagpost ON post.idpost = tagpost.idpost LEFT JOIN tags ON tagpost.idtag = tags.idtag INNER JOIN user ON user.iduser = post.iduser' +
                ' LEFT JOIN ciudadano ON ciudadano.idobs = post.idobs WHERE post.tipo > 1 AND post.estado = 1 AND post.idobs = ? GROUP BY post.idpost ORDER BY post.fecha ASC ',req.params.idobs,function(err,rows)
            {
                if(err)
                    console.log("Error Selecting : %s ",err );

                res.render('monitor/app_post',{data:rows, usr:req.session.user, obs: req.session.idobs});

                //console.log(query.sql);
            });
        });
    } else res.redirect('/bad_login');
};
exports.get_modpost = function(req, res){
    if(req.session.isUserLogged && req.session.user.tipo == 2){
        req.getConnection(function(err,connection){

            connection.query('SELECT post.*,user.username,GROUP_CONCAT(DISTINCT tags.tag ORDER BY tags.tag) AS tagz FROM' +
                ' post LEFT JOIN tagpost ON post.idpost = tagpost.idpost LEFT JOIN tags ON tagpost.idtag = tags.idtag INNER JOIN user ON user.iduser = post.iduser' +
                ' WHERE post.tipo = 1 AND post.estado = 1 GROUP BY post.idpost ORDER BY post.fecha ASC ',function(err,rows)
            {
                if(err)
                    console.log("Error Selecting : %s ",err );
                //console.log(rows);

                var posts = rows;
                connection.query('SELECT comentario.*,user.username,user.iduser FROM' +
                    ' comentario INNER JOIN user ON user.iduser = comentario.iduser WHERE comentario.estado = 1 GROUP BY comentario.idcomentario ORDER BY comentario.fecha ASC ',function(err,rows)
                {
                    if(err)
                        console.log("Error Selecting : %s ",err );

                    res.render('monitor/mod_moderate',{data:posts, data2:rows, usr:req.session.user, obs: req.session.idobs});

                    //console.log(query.sql);
                });
                //console.log(query.sql);
            });
        });
    } else res.redirect('/bad_login');
};
exports.approve_p = function(req, res){
    var input = JSON.parse(JSON.stringify(req.body));
    if(req.session.isUserLogged && (req.session.user.tipo == 1 || req.session.user.tipo == 2)){
        req.getConnection(function(err,connection){

            connection.query("UPDATE post SET estado = '2', fecha = CURRENT_TIMESTAMP WHERE idpost = ? ",[input.idpost],function(err,rows)
            {
                if(err)
                    console.log("Error Selecting : %s ",err );
                res.send("si");
                //console.log(query.sql);
            });
        });
    } else res.send("no, maldito ghjaker");
};
exports.remove_p = function(req, res){
    var input = JSON.parse(JSON.stringify(req.body));
    if(typeof input.comment == 'undefined'){
        input.comment = "";
    }
    if(req.session.isUserLogged && (req.session.user.tipo == 1 || req.session.user.tipo == 2)){
        req.getConnection(function(err,connection){

            connection.query("UPDATE post SET estado = 3 WHERE idpost = ?",[input.idpost],function(err,rows)
            {
                if(err)
                    console.log("Error Selecting : %s ",err );
                connection.query("SELECT post.*,user.correo FROM post INNER JOIN user ON user.iduser = post.iduser WHERE idpost = ? GROUP BY post.idpost",[input.idpost],function(err,rows)
                {
                    if(err)
                        console.log("Error Selecting : %s ",err );
                    res.mailer.send('mail_rechazo', {
                        to: rows[0].correo, // REQUIRED. This can be a comma delimited string just like a normal email to field.
                        subject: 'Un post tuyo fue rechazado', // REQUIRED.
                        post: rows[0], // All additional properties are also passed to the template as local variables.
                        tipo: req.session.user.tipo,
                        razon: input.razon,
                        comm: input.comment
                    }, function (err) {
                        if (err) {
                            // handle error
                            console.log(err);
                            res.send('There was an error sending the email');
                        } else
                        res.send("si");
                    });
                    //console.log(query.sql);
                });
                //console.log(query.sql);
            });
        });
    } else res.send("no, maldito ghjaker");
};
exports.approve_comment = function(req, res){
    var input = JSON.parse(JSON.stringify(req.body));
    if(req.session.isUserLogged && req.session.user.tipo == 2){
        req.getConnection(function(err,connection){

            connection.query("UPDATE comentario SET estado = '2' WHERE idcomentario = ? ",[input.idcoment],function(err,rows)
            {
                if(err)
                    console.log("Error Selecting : %s ",err );
                res.send("si");
                //console.log(query.sql);
            });
        });
    } else res.send("no, maldito ghjaker");
};
exports.del_comment = function (req,res) {
    if(req.session.isUserLogged && req.session.user.tipo == 2){
        var input = JSON.parse(JSON.stringify(req.body));
        req.getConnection(function(err,connection){
            connection.query('SELECT comentario.*,user.correo,user.nombre FROM comentario INNER JOIN user ON user.iduser = comentario.iduser WHERE idcomentario = ?',[input.idcomentario],function(err,rows)
            {
                if(err) {
                    console.log("Error Deleting : %s ",err );
                    res.send("no");
                } else {
                    var comment = rows[0];
                    connection.query('DELETE FROM comentario WHERE idcomentario = ?',[input.idcomentario],function(err,rows)
                    {
                        if(err)
                            console.log("Error Deleting : %s ",err );
                        res.mailer.send('mail_c_rechazo', {
                            to: comment.correo, // REQUIRED. This can be a comma delimited string just like a normal email to field.
                            subject: 'Un comentario tuyo fue eliminado', // REQUIRED.
                            comm: comment, // All additional properties are also passed to the template as local variables.
                            razon: input.razon,
                        }, function (err) {
                            if (err) {
                                // handle error
                                console.log(err);
                                res.send('There was an error sending the email');
                            } else
                            res.send("si");
                        });
                        //console.log(query.sql);
                    });
                }
                //console.log(query.sql);
            });
        });
    } else res.redirect('/bad_login');
};