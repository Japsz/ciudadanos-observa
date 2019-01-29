var send = require('../routes/sendmails'); //Importar la funcion para enviar mail

//Vista lista de monitores.
exports.list = function(req, res){
	if(req.session.isAdminLogged){
		req.getConnection(function(err,connection){
					 
						connection.query('SELECT user.*,GROUP_CONCAT(observatorio.idobservatorio,"&&",observatorio.nom,"&&",institucion.nom) as obsinfo FROM user ' +
                            ' LEFT JOIN monitor ON monitor.idmonitor = user.iduser' +
                            ' LEFT JOIN observatorio ON monitor.idobservatorio = observatorio.idobservatorio' +
                            ' LEFT JOIN institucion ON institucion.idinstitucion = observatorio.idinst' +
                            ' WHERE user.tipo <= 2 GROUP BY user.iduser',function(err,monits)
                            {
								
								if(err)
										console.log("Error Selecting : %s ",err );
								var aux= [];
								var aux2;
								for(var i=0;i<monits.length;i++){
									console.log(monits[i].obsinfo);
									if(monits[i].tipo == 1 && typeof monits[i].obsinfo != "object"){
										aux2 = monits[i].obsinfo.split(",");
										for(var j = 0;j<aux2.length;j++){
											aux.push(aux2[j].split("&&"));
										}
										monits[i].obsinfo = aux;
									}
									aux = [];
								}
								res.render('user',{page_title:"Stats",data:monits, usr:req.session.user});
										
						 });
						 //console.log(query.sql);
				});
		}
		else res.redirect('/bad_login');  
};

// Renderiza Vista de usuarios.
exports.user_cdd = function(req, res){
    if(req.session.isAdminLogged){
        res.render('user_cdd', {page_title:"Stats", usr:req.session.user});
    }
    else res.redirect('/bad_login');  
};

//Vista lista de ciudadanos.
exports.cdd_list = function(req, res){
    if(req.session.isAdminLogged){
        // Obtiene data de POST
        var input = JSON.parse(JSON.stringify(req.body));
        var clave = input.clave;
        // Agrega los datos del filtro
        var search = "";
        if(clave != ""){
            search += " AND (user.correo LIKE '%" + clave + "%' OR user.nombre LIKE '%" + clave + "%' OR user.username LIKE '%" + clave + "%')";
        }
        var fecha = new Date();
        var fecha_1 = "" + fecha.getFullYear() + "-" + (fecha.getMonth()+1);
        var fecha_2 = "" + fecha.getFullYear() + "-" + fecha.getMonth();
        if(fecha.getMonth() == 0){
            fecha_2 = "" + fecha.getFullYear() + "-12";
        }
        req.getConnection(function(err,connection){
            connection.query("SELECT user.*,ciudadano.medal,GROUP_CONCAT(observatorio.idobservatorio,'&&',observatorio.nom,'&&',institucion.nom) as obsinfo,"
                + " (SELECT COUNT(comentario.iduser) FROM comentario WHERE comentario.iduser=user.iduser) as comentarios,"
                + " (SELECT COUNT(post.iduser) FROM post WHERE post.iduser=user.iduser) as post,"
                + " (SELECT COUNT(comentario.fecha) FROM comentario where comentario.iduser=user.iduser AND comentario.fecha LIKE '%" + fecha_1 + "%' OR '%" + fecha_2 + "%') as fecha_comentario,"
                + " (SELECT COUNT(post.fecha) as fecha_post FROM post where post.iduser=user.iduser AND post.fecha LIKE '%" + fecha_1 + "%' OR '%" + fecha_2 + "%') as fecha_post"
                + " FROM user"
                + " LEFT JOIN ciudadano ON ciudadano.iduser=user.iduser"
                + " LEFT JOIN observatorio ON observatorio.idobservatorio = ciudadano.idobs"
                + " LEFT JOIN institucion ON institucion.idinstitucion = observatorio.idinst"
                + " " + search + " GROUP BY user.iduser",function(err,cdd)
            {
                if(err) console.log("Error Selecting : %s ",err );
                var aux= [];
                var aux2;
                for(var i=0;i<cdd.length;i++){
                    console.log(cdd[i].obsinfo);
                    if(cdd[i].tipo == 3 && typeof cdd[i].obsinfo != "object"){
                        aux2 = cdd[i].obsinfo.split(",");
                        for(var j = 0;j<aux2.length;j++){
                            aux.push(aux2[j].split("&&"));
                        }
                        cdd[i].obsinfo = aux;
                    }
                    aux = [];
                }
                connection.query("SELECT observatorio.*,COUNT(DISTINCT ciudadano.iduser) AS num_cdd,institucion.nom AS inst_nom FROM observatorio" +
                    " LEFT JOIN ciudadano ON ciudadano.idobs = observatorio.idobservatorio" +
                    " LEFT JOIN institucion ON institucion.idinstitucion = observatorio.idinst" +
                    " WHERE observatorio.estado != 3 GROUP BY observatorio.idobservatorio",function(err,rows){
                    if(err) console.log("Error selecting observatorios : %s",err);
                    res.render('table_cdd',{page_title:"Stats", data: cdd, usr:req.session.user,obs: rows});
                });
            });
        });
    }
    else res.redirect('/bad_login'); 
};
//Controlador Cambiar de observatorio un cdd
exports.change_obs = function(req,res){
    if(req.session.isAdminLogged){
        req.getConnection(function (err,connection){
            if(err) console.log("Error on connection: %s",err);
            connection.query("UPDATE ciudadano SET idobs = ? WHERE iduser = ?",[req.body.idobs,req.body.iduser],function(err,rows){
                if(err) console.log("Error on update: %s",err);
                res.send({err:false,err_msg:"Exito en la modifiación"});
            });
        })
    } else res.send({err: true,err_msg:"No tienes permisos"});
};

// Logica agregar cdd a obs.
exports.save_cdd = function(req,res){
    if(req.session.isAdminLogged){
        var input = JSON.parse(JSON.stringify(req.body));
        var generator = require('generate-password');
        // Generar clave alfanumérica
        var pass = generator.generate({length : 7,numbers : true});
        var data = {
                nombre     : '',
                apellido   : '',
                username   : '',
                rut        : '',
                fnac       : new Date(),
                tipo       : 3,
                password   : pass,
                correo     : input.correo
            };
        if(input.nom != ''){
            data.nombre = input.nom;
        }
        if(input.apellido != ''){
            data.apellido = input.apellido;
        }
        if(input.username != ''){
            data.username = input.username;
        }
        if(input.rut != ''){
            data.rut = input.rut;
        }
        if(input.fnac != ''){
            data.fnac = input.fnac;
        }
        req.getConnection(function (err, connection) {
            //Verificar si el correo ya está registrado
            connection.query("SELECT * FROM user WHERE correo = ?", input.correo, function(err, rows) {
                if(err) console.log("Error Selecting correo: %s",err);
                if(rows.length){
                    // Si existe, borrarlo de su observatorio y vincularlo al observatorio (NO EDITA SUS DATOS DE USUARIO)
                    connection.query("DELETE FROM ciudadano WHERE iduser = " + rows[0].iduser, function(err, r) {
                        if(err) console.log("Error deleting : %s ",err );
                        connection.query("INSERT INTO ciudadano SET ?",{idobs : input.idobs, iduser : rows[0].iduser}, function(err, rowss) {
                            if (err) {
                                console.log("Error inserting : %s ",err );
                            } else {
                                // Volver a habilitar el usuario tipo 4 => tipo 3
                                connection.query("UPDATE user SET tipo = 3 WHERE correo = ?",input.correo, function(err, rowsss) {
                                    if (err) console.log("Error Inserting cdd : %s ", err);
                                    // Reactivacion de usuario y Envio de mail
                                    connection.query("SELECT nom FROM observatorio WHERE idobservatorio=?", input.idobs,function(err, obs) {
                                        if(err) {
                                            console.log("Error Selecting observatorio: %s",err);
                                        } else {
                                            //Variables para envio de correo, data_mail debe tener las mismas variables
                                            var info = new Array(obs[0].nom, input.idobs, rows[0].iduser,true); //Envia el nombre del obs y su id para la url
                                            var mails = new Array(input.correo); //Debe ser array!
                                            var subj = "Bienvenido a observatorio de Observa Ciudadanía";
                                            var data_mail = {
                                                view: "views\\admin\\obs\\save_cdd.ejs", //Path
                                                subject: subj, //Asunto del mensaje
                                                inf: info, //Array con informacion necesaria
                                                mails: mails}; //Array de los correos
                                            send.send_mail(data_mail,function(err) {
                                                if(err){
                                                    console.log(err.message);
                                                }
                                            });
                                            console.log("Se vinculo a " + input.correo + " a observatorio " + input.idobs + ", mail enviado correctamente.");
                                            res.redirect('/show_obs/' + input.idobs);
                                        }
                                    });
                                });
                            }
                        });
                    });
                } else {
                    // Si no está registrado el correo, crear usuario
                    connection.query("INSERT INTO user SET ? ",data, function(err, rows) {
                        if (err){
                            console.log("Error inserting : %s ",err );
                        } else {
                            // Vincular usuario creado al observatorio
                            connection.query("INSERT INTO ciudadano SET ?",{idobs : input.idobs, iduser : rows.insertId}, function(err, rowss) {
                                if (err) console.log("Error Inserting cdd : %s ", err);
                                // Reactivacion de usuario y Envio de mail
                                connection.query("SELECT nom FROM observatorio WHERE idobservatorio=?", input.idobs,function(err, obs) {
                                    if(err) {
                                        console.log("Error Selecting observatorio: %s",err);
                                    } else {
                                        //Variables para envio de correo, data_mail debe tener las mismas variables
                                        var info = new Array(obs[0].nom, input.idobs, rows.insertId, false); //Envia el nombre del obs, idobs, iduser, usuario existe
                                        var mails = new Array(input.correo); //Debe ser array!
                                        var subj = "Bienvenido a observatorio de Observa Ciudadanía";
                                        var data_mail = {
                                            view: "views\\admin\\obs\\save_cdd.ejs", //Path
                                            subject: subj, //Asunto del mensaje
                                            inf: info, //Array con informacion necesaria
                                            mails: mails}; //Array de los correos
                                        send.send_mail(data_mail,function(err) {
                                            if(err){
                                                console.log(err.message);
                                            }
                                        });
                                        console.log("Se vinculo a " + input.correo + " a observatorio " + input.idobs + ", mail enviado correctamente.");
                                        res.redirect('/show_obs/' + input.idobs);
                                    }
                                });
                            });
                        }
                    });
                }
            });
        });
    }
    else res.redirect('/bad_login');
};

exports.modproy = function(req,res){
    if(req.session.isAdminLogged){
        req.getConnection(function(err,connection){
            connection.query('SELECT postinterno.*,proyecto.titulo,user.username,user.avatar_pat as iconouser FROM postinterno LEFT JOIN proyecto ON proyecto.idproyecto = postinterno.idproyecto LEFT JOIN user ON user.iduser = postinterno.iduser WHERE postinterno.tipo = 0 GROUP BY postinterno.idpostinterno',function(err,rows)
            {

                if(err)
                    console.log("Error Selecting : %s ",err );
                if(rows.length){
                	for(var i = 0;i<rows.length;i++){
                		rows[i].token = rows[i].token.split("&&");
					}
				}
                res.render('admin/event/modproys',{page_title:"Stats",data:rows, usr:req.session.user});

            });
            //console.log(query.sql);
        });
    }
    else res.redirect('/bad_login');
};
exports.moderate_p = function(req,res){
    if(req.session.isAdminLogged){
        var input = JSON.parse(JSON.stringify(req.body));
        req.getConnection(function(err,connection){
        	if(input.resp == "si"){
        		connection.query("UPDATE postinterno SET tipo = 4 WHERE idpostinterno = ?",input.idpost,function(err,rows){
        			if(err) console.log("Error Updating1 : %s ",err);
        			connection.query("UPDATE proyecto SET gotlaik = 0, gotuser = 0, etapa = (etapa + 1) WHERE idproyecto = (SELECT idproyecto FROM postinterno WHERE idpostinterno = ?)",input.idpost,function(err,rows){
                        if(err) console.log("Error Updating2 : %s ",err);
                        connection.query("UPDATE postinterno SET tipo = 5 WHERE idproyecto = (SELECT idproyecto FROM postinterno WHERE idpostinterno = ?) AND tipo = 0",input.idpost,function(err,rows){
                            if(err) console.log("Error Updating3 : %s ",err);
                            connection.query("SELECT postinterno.*,proyecto.titulo,user.correo FROM postinterno LEFT JOIN proyecto ON proyecto.idproyecto = postinterno.idproyecto" +
								" LEFT JOIN user ON user.iduser = proyecto.idcreador WHERE postinterno.idpostinterno = ? GROUP BY postinterno.idpostinterno",input.idpost,function(err,rows){
                                if(err) console.log("Error SELECTING : %s ",err);
								if(rows.length){
                                    var newuser_act = {
                                        iduser: rows[0].iduser,
                                        idproyecto: rows[0].idproyecto,
                                        tipo : 5,
                                        principal : "El proyecto avanzó de etapa!",
                                        contenido: '<h4>' + rows[0].token.split("&&")[0] + '</h4>' + rows[0].texto1 +'<hr style="border-top-color: black; margin-top: 20px"><h4>' + rows[0].token.split("&&")[1] + '</h4>' + rows[0].texto2,
                                        fecha: new Date()
                                    };
                                    rows[0].token = rows[0].token.split("&&");
                                    connection.query("INSERT INTO actualizacion SET ?",newuser_act,function (err,rows){
                                        if(err) console.log("Error INSERTING : %s ",err);
                                        res.redirect("/mod_proys");
                                    });
                                    res.mailer.send('mail_avance', {
                                        to: rows[0].correo, // REQUIRED. This can be a comma delimited string just like a normal email to field.
                                        subject: 'El avance de tu proyecto fue aprobado', // REQUIRED.
                                        data: rows[0],
                                        estado: "aprobado"// All additional properties are also passed to the template as local variables.
                                    }, function (err) {
                                        if (err) {
                                            // handle error
                                            console.log(err);
                                            res.send('There was an error sending the email');
                                        }
                                        return;
                                    });
                                }
							});
						});
					});
				});
			} else if(input.resp == "no"){
        		connection.query("UPDATE postinterno SET tipo = 5 WHERE idpostinterno = ?",input.idpost,function(err,rows){
                    if(err) console.log("Error Updating : %s ",err);
                    connection.query("SELECT postinterno.*,proyecto.titulo,user.correo FROM postinterno LEFT JOIN proyecto ON proyecto.idproyecto = postinterno.idproyecto" +
                        " LEFT JOIN user ON user.iduser = proyecto.idcreador WHERE postinterno.idpostinterno = ? GROUP BY postinterno.idpostinterno",input.idpost,function(err,rows) {
                        if (err) console.log("Error SELECTING : %s ", err);
                        res.redirect("/mod_proys");
                        res.mailer.send('mail_avance', {
                            to: rows[0].correo, // REQUIRED. This can be a comma delimited string just like a normal email to field.
                            subject: 'El avance de tu proyecto fue rechazado', // REQUIRED.
                            data: rows[0],
							comm: input.comment,
                            estado: "rechazado"// All additional properties are also passed to the template as local variables.
                        }, function (err) {
                            if (err) {
                                // handle error
                                console.log(err);
                                res.send('There was an error sending the email');
                                return;
                            }
                        });
                    });
				});
			} else
				res.redirect("/bad_login");
            //console.log(query.sql);
        });
    }
    else res.redirect('/bad_login');

};
//Vista agregar usuario.
exports.add = function(req, res){
	if(req.session.isAdminLogged){
		res.render('add_user',{page_title:"Agregar usuario", usr:req.session.user});
		}
		else res.redirect('/bad_login');
};
// Logica agregar user.
exports.save = function(req,res){
	if(req.session.isAdminLogged){
		var input = JSON.parse(JSON.stringify(req.body));
		req.getConnection(function (err, connection) {

				var data = {

						username   : input.username,
						password   : input.password,
						tipo	   : input.tipo,
						correo	   : input.correo,
	                    avatar_pat : "/assets/img/placeholder.png"

				};
				var query = connection.query("INSERT INTO user SET ? ",data, function(err, rows)
				{

					if (err)
							console.log("Error inserting : %s ",err );

                    res.redirect('/user');
				});

			 // console.log(query.sql); get raw query

		});
		}
		else res.redirect('/bad_login');
};
//Vista editar usuario.
exports.edit = function(req, res){
	
	if(req.session.isAdminLogged){
		var username = req.params.username;
		
		req.getConnection(function(err,connection){
				var query = connection.query('SELECT * FROM user WHERE username = ?',[username],function(err,rows)
				{
						
						if(err)
								console.log("Error Selecting : %s ",err );
		 
						res.render('edit_user',{page_title:"Edit Users",data:rows, usr:req.session.user});
								
					 
				 });
				 
				 //console.log(query.sql);
		}); 
		}
		else res.redirect('/bad_login');
};
//Logica editar usuario.
exports.save_edit = function(req,res){

	if(req.session.isAdminLogged){
		var input = JSON.parse(JSON.stringify(req.body));
		var username = req.params.username;
		
		req.getConnection(function (err, connection) {
				
				var data = {

						username   : input.username,
						password   : input.password 
				
				};
				
				connection.query("UPDATE user set ? WHERE username = ? ",[data,username], function(err, rows)
				{
	
					if (err)
							console.log("Error Updating : %s ",err );
				 
					res.redirect('/user');
					
				});
		});
		}
		else res.redirect('/bad_login');
};

//Logica editar Badge
exports.change_badge = function(req,res) {
    console.log('cambie una badge?');
    if (req.session.isAdminLogged) {
        req.getConnection(function (err, connection) {
            if (err) console.log(err);
            connection.query("UPDATE ciudadano SET medal = ? WHERE iduser = ?", [req.body.new_medal, req.body.iduser], function (err, obs) {
                if (err) {
                    console.log(err);
                    res.send({err: true, errmsg: "Ocurrió un error al actualizar la información"});
                } else res.send({err: false, errmsg: "Exito"});
            });
        });
    };
};


//Conseguir csvs cdd
exports.g_csv_cdd = function(req,res){
    if(req.session.isAdminLogged){
        var input = JSON.parse(JSON.stringify(req.body));
        var csvWriter = require('csv-write-stream');
			var writer = csvWriter({ headers: ["Usuario", "Nombre", "Apellido", "FdeNac","Comuna", "correo","genero","N de posts","Likes dados", "Proyectos creados","Proyectos en que participa"]});
        var fs = require('fs');
        req.getConnection(function (err, connection) {

            connection.query("SELECT user.*,COUNT(DISTINCT post.idpost) AS posts,COUNT(DISTINCT megusta.idpost) as likes,COUNT(DISTINCT proyecto.idproyecto) AS proys,COUNT(DISTINCT userproyecto.idproyecto) AS inproys FROM user LEFT JOIN ciudadano ON ciudadano.iduser = user.iduser" +
                " LEFT JOIN post ON post.iduser = user.iduser LEFT JOIN megusta ON megusta.iduser = user.iduser" +
                " LEFT JOIN proyecto ON proyecto.idcreador = user.iduser LEFT JOIN userproyecto ON userproyecto.iduser = user.iduser" +
                " WHERE ciudadano.idobs = ? GROUP BY user.iduser",input.idobs, function(err, rows)
            {

                if (err)
                    console.log("Error Select : %s ",err );
                var fnac, correo;
                var f_gen = new Date().toLocaleString();
                f_gen = f_gen.replace(/\s/g,'');
                f_gen = f_gen.replace(/\:/g,'');
                f_gen = f_gen.replace(/\//g,'');
                f_gen = f_gen.replace(/\,/g,'');
                if(rows.length){
                    // 'C:/Users/Go Jump/Desktop/'
                    writer.pipe(fs.createWriteStream('public/csvs/obscdd' + input.idobs +' hasta ~ ' + f_gen + '.csv'));
                    for (var i = 0; i <rows.length; i++) {
                        if(typeof rows[i].correo == "string"){
                            correo = rows[i].correo;
                        } else {
                            correo = "N/A";
                        }
                        fnac = new Date(rows[i].fnac).toLocaleDateString();
                        switch(rows[i].gender) {
                            case "1":
                                rows[i].gender = "F";
                                break;
                            case "0":
                                rows[i].gender = "M";
                                break;
                            default:
                                rows[i].gender = "Otro";
                        }
                        writer.write([rows[i].username, rows[i].nombre, rows[i].apellido,fnac,rows[i].comuna, correo,rows[i].gender,rows[i].posts,rows[i].likes,rows[i].proys,rows[i].inproys]);
                    }
                    writer.end();
                }
                res.send('/csvs/obscdd' + input.idobs +' hasta ~ ' + f_gen + '.csv');
            });

            // console.log(query.sql); get raw query

        });
    }
    else res.redirect('/bad_login');
};
//Conseguir csvs cdd
exports.g_csv_proy = function(req,res){
    if(req.session.isAdminLogged){
        var input = JSON.parse(JSON.stringify(req.body));
        var csvWriter = require('csv-write-stream');
        var writer = csvWriter({ headers: ["Titulo", "Problema", "descripcion", "Fecha creacion", "etapa","Usuario creador","N Likes","N actualizaciones","N de post en el muro interno", "N integrantes","Tags"]});
        var fs = require('fs');
        req.getConnection(function (err, connection) {

            var query = connection.query("SELECT proyecto.*,COUNT(DISTINCT actualizacion.idactualizacion) AS nacts,COUNT(DISTINCT proylike.iduser) as likes,COUNT(DISTINCT postinterno.idpostinterno) AS postinterns,evento.etapas,user.username,COUNT(DISTINCT userproyecto.iduser) AS inproys," +
                "GROUP_CONCAT(DISTINCT tags.tag SEPARATOR ' ') as nomtags FROM proyecto LEFT JOIN tagproyecto ON tagproyecto.idproyecto = proyecto.idproyecto LEFT JOIN tags ON tags.idtag = tagproyecto.idtag" +
                " LEFT JOIN user ON user.iduser = proyecto.idcreador LEFT JOIN postinterno ON postinterno.idproyecto = proyecto.idproyecto LEFT JOIN proylike ON proylike.idproyecto = proyecto.idproyecto" +
                " LEFT JOIN actualizacion ON actualizacion.idproyecto = proyecto.idproyecto LEFT JOIN userproyecto ON userproyecto.idproyecto = proyecto.idproyecto LEFT JOIN evento ON evento.idevento = proyecto.idevento WHERE proyecto.idobservatorio = ? GROUP BY proyecto.idproyecto ORDER BY proyecto.creacion ASC",input.idobs, function(err, rows)
            {

                if (err)
                    console.log("Error Select : %s ",err );
                var fnac;
                var f_gen = new Date().toLocaleString();
                f_gen = f_gen.replace(/\s/g,'');
                f_gen = f_gen.replace(/\:/g,'');
                f_gen = f_gen.replace(/\//g,'');
                f_gen = f_gen.replace(/\,/g,'');
                console.log(req.path);
                var pat = 'public/csvs/obspry_' + input.idobs +'_hasta_~_' + f_gen + '.csv';
                if(rows.length){
                    // 'C:/Users/Go Jump/Desktop/'
                    writer.pipe(fs.createWriteStream(pat));
                    for (var i = 0; i <rows.length; i++) {
                        if(rows[i].etapa > rows[i].etapas){
                            rows[i].etapa = "Fin";
                        }
                        fnac = new Date(rows[i].creacion).toLocaleDateString();
                        writer.write([rows[i].titulo, rows[i].problema, rows[i].descripcion,fnac,rows[i].etapa, rows[i].username,rows[i].likes,rows[i].nacts,rows[i].postinterns,rows[i].inproys,rows[i].nomtags]);
                    }
                    writer.end();
                }
                res.send('/csvs/obspry_' + input.idobs +'_hasta_~_' + f_gen + '.csv');
            });

            // console.log(query.sql); get raw query

        });
    }
    else res.redirect('/bad_login');
};
//Desvincular Ciudadano de Observatorio.
exports.delete_user = function(req,res){
	if(req.session.isAdminLogged){
        req.getConnection(function (err, connection) {
			connection.query("UPDATE user SET tipo = 4 WHERE iduser = ?",[req.params.iduser],function(err,rows)
            {
                if(err) {console.log("Error deleting : %s ",err );
                } else {
                    connection.query("SELECT observatorio.idobservatorio, observatorio.nom, user.iduser, user.nombre, user.correo FROM user " + 
                        "JOIN ciudadano ON ciudadano.iduser = user.iduser JOIN observatorio ON ciudadano.idobs = observatorio.idobservatorio " +
                        "WHERE user.iduser=?", req.params.iduser, function(err, rows)
                    {
                        if(err) {console.log("Error selecting mails: %s",err);
                        } else {
                            // Mail de DESACTIVACIÓN de usuario
                            var obs = new Array(rows[0].nom, rows[0].idobservatorio); //Envia el nombre del obs y su id para la url
                            var mails = new Array(); //Debe ser array!
                            for(i = 0; i < rows.length ;i++) {
                                if(rows[i].correo != null) {
                                    mails.push(rows[i].correo);
                                }
                            }
                            var subj = "Aviso sobre tu observatorio " + rows[0].nom;
                            var data_mail = {
                                view: "views\\admin\\obs\\obs_archive.ejs", //Path
                                subject: subj, //Asunto del mensaje
                                inf: obs, //Array con informacion de observatorio
                                mails: mails}; //Array de los correos
                            //Delete va aqui porque asi encuentra el observatorio por el iduser
                            connection.query("DELETE FROM ciudadano WHERE iduser = ? ",[req.params.iduser], function(err, rows)
                            {
                                if(err) {console.log("Error deleting : %s ",err );
                                } else{ 
                                    send.send_mail(data_mail,function(err) {
                                        if(err){ console.log(err.message);}
                                    });
                                    console.log("Se desvinculo a " + mails + " de observatorio " + req.params.id + ", mail enviado correctamente.");
                                    res.redirect(req.header("Referer") || '/');
                                }
                            });
                        }
                    });
                }
            });
		});
    } else {
        res.redirect('/bad_login');
    }
};