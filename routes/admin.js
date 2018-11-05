var send = require('../routes/sendmails'); //Importar la funcion para enviar mail

//Vista lista de usuarios.
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