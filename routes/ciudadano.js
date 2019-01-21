exports.save_comment_single = function (req,res) {
    if(req.session.isUserLogged){
        var input = JSON.parse(JSON.stringify(req.body));
        input.iduser = req.session.user.iduser;
        req.getConnection(function(err,connection){
            connection.query('INSERT INTO comentario SET ? ',[input],function(err,rows)
            {
                if(err)
                    console.log("Error Selecting : %s ",err );
                res.redirect("/post/" + input.idpost);
                //console.log(query.sql);
            });
        });
    } else res.redirect('/bad_login');
};
exports.save_comment = function (req,res) {
    if(req.session.isUserLogged){
        var input = JSON.parse(JSON.stringify(req.body));
        input.iduser = req.session.user.iduser;
        req.getConnection(function(err,connection){
            connection.query('INSERT INTO comentario SET ? ',[input],function(err,rows)
            {
                if(err)
                    console.log("Error Selecting : %s ",err );
                res.redirect(307,"/pstcomment_stream");
                //console.log(query.sql);
            });
        });
    } else res.redirect('/bad_login');
};
exports.del_comment = function (req,res) {
    if(req.session.isUserLogged){
        req.getConnection(function(err,connection){
            connection.query('DELETE FROM comentario WHERE idcomentario = ? AND iduser = ?',[req.params.idcom,req.session.user.iduser],function(err,rows)
            {
                if(err) {
                    console.log("Error Deleting : %s ",err );
                    res.send("no");
                } else
                    res.send("si");
                //console.log(query.sql);
            });
        });
    } else res.redirect('/bad_login');
};
exports.check_usr = function (req,res) {
    if(req.session.isUserLogged){
        var input = JSON.parse(JSON.stringify(req.body));
        if(input.username != req.session.user.username) {
            req.getConnection(function (err, connection) {
                connection.query('SELECT * FROM user WHERE username = ?', input.username, function (err, rows) {
                    if (err ) {
                        console.log("Error Deleting : %s ", err);
                    } else if (rows.length){
                        res.send("no");
                    } else {
                        res.send("si");

                    }
                    //console.log(query.sql);
                });
            });
        } else {
            res.send("si")
        }
    } else res.redirect('/bad_login');
};
exports.intern_laik = function (req, res) {
    if(req.session.isUserLogged){
        var input = JSON.parse(JSON.stringify(req.body));
        req.getConnection(function (err, connection) {
            connection.query("SELECT postinterno.laiks,COUNT(userproyecto.iduser) as cantint, postinterno.tipo,postinterno.token,proyecto.idcreador FROM postinterno INNER JOIN userproyecto ON postinterno.idproyecto = userproyecto.idproyecto" +
                " LEFT JOIN proyecto ON proyecto.idproyecto = postinterno.idproyecto WHERE postinterno.idpostinterno = ? GROUP BY postinterno.laiks",[input.idpost], function(err, rows)
            {

                if (err)
                    console.log("Error inserting : %s ",err );
                var newlike, classname, numint, totvot;
                if(rows){
                    numint = rows[0].cantint;
                    if(rows[0].laiks){
                        if(rows[0].laiks == "fin"){
                            newlike = "fin";
                            var alert = "fin";
                            if(rows[0].idcreador == req.session.user.iduser){
                                alert = "rdy";
                            }
                            res.send({html: '<i class="glyphicon glyphicon-ok"></i>',newlaik: "btn-success",alert: alert});
                        } else if(rows[0].laiks.indexOf("&" + req.session.user.iduser + "&") != -1){
                            newlike =  rows[0].laiks.replace("&" + req.session.user.iduser + "&",'');
                            classname = "btn-inverse";
                        } else {
                            newlike = rows[0].laiks + "&" + req.session.user.iduser + "&";
                            classname = "btn-success";
                        }
                    } else {
                        newlike = "&" + req.session.user.iduser + "&";
                        classname = "btn-success";
                    }
                    var tip = rows[0].tipo;
                    var tok = rows[0].token.split("&&");
                    var creador = rows[0].idcreador;
                    if(newlike == ""){
                        totvot = 0;
                    } else {
                        totvot = newlike.split("&&").length;
                    }
                    if(totvot >= ((numint - numint%2)/2 + 1)){ // Votación completa
                        if(tip == 2){
                            connection.query("SELECT solucion.iduser,proyecto.titulo,proyecto.etapa,solucion.idproyecto,solucion.contenido,user.correo FROM solucion LEFT JOIN proyecto ON proyecto.idproyecto = solucion.idproyecto" +
                                " LEFT JOIN user ON user.iduser = solucion.iduser WHERE idsolucion = ? GROUP BY solucion.iduser",tok[0],function(err,rows){
                                if (err)
                                    console.log("Error inserting : %s ",err );
                                var idproj = rows[0].idproyecto;
                                var iduser = rows[0].iduser;
                                var cont = rows[0].contenido;
                                var dats = rows[0];
                                connection.query("INSERT INTO userproyecto SET ? ",[{iduser:rows[0].iduser,idproyecto: rows[0].idproyecto,etapa: rows[0].etapa}],function(err,rows){
                                    if (err) {
                                        console.log("Error inserting : %s ",err );
                                        connection.query("UPDATE postinterno SET laiks = ? WHERE idpostinterno = ?",["fin",input.idpost],function(err,rows){
                                            if (err)
                                                console.log("Error inserting : %s ",err );
                                            res.send({html: '<i class="glyphicon glyphicon-ok"></i>',newlaik: "btn-success",alert: "sameuser"});
                                        });
                                    } else {
                                        newlike = "fin";
                                        connection.query("UPDATE postinterno SET laiks = ? WHERE idpostinterno = ?",[newlike,input.idpost], function(err, rows)
                                        {
                                            if (err)
                                                console.log("Error updating : %s ",err );
                                            connection.query("UPDATE proyecto SET gotuser = 1 WHERE idproyecto = ?",idproj, function(err,rows){
                                                if (err)
                                                    console.log("Error updating : %s ",err );
                                                var newuser_act = {
                                                    iduser: iduser,
                                                    idproyecto: idproj,
                                                    tipo : 5,
                                                    principal : "Se unió al proyecto!",
                                                    contenido: cont,
                                                    fecha: new Date()
                                                };
                                                connection.query("INSERT INTO actualizacion SET ?",newuser_act,function(err, actid){
                                                    if (err)
                                                        console.log("Error insert actualizacion: %s", err);
                                                    res.send({html: '<i class="glyphicon glyphicon-ok"></i>',newlaik: "btn-success",alert: "newuser"});
                                                });
                                                res.mailer.send('mail_newuser', {
                                                    to: dats.correo, // REQUIRED. This can be a comma delimited string just like a normal email to field.
                                                    subject: 'Fuiste agregado a un proyecto!', // REQUIRED.
                                                    data: dats
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
                                    }
                                });
                            });
                        } else {
                            newlike = "fin";
                            connection.query("UPDATE postinterno SET laiks = ? WHERE idpostinterno = ?",[newlike,input.idpost], function(err, rows)
                            {
                                if (err)
                                    console.log("Error updating : %s ",err );
                                if(req.session.user.iduser == creador){
                                    newlike = "rdy";
                                }
                                res.send({html: '<i class="glyphicon glyphicon-ok"></i>',newlaik: "btn-success",alert: newlike});
                            });
                        }
                    } else { // Votación Incompleta
                        connection.query("UPDATE postinterno SET laiks = ? WHERE idpostinterno = ?",[newlike,input.idpost], function(err, rows)
                        {
                            if (err)
                                console.log("Error updating : %s ",err );
                            res.send({html: '<i class="glyphicon glyphicon-thumbs-up"></i>' + totvot + ' / ' + ((numint - numint%2)/2 + 1),newlaik: classname,alert: "no"});
                        });
                    }

                } else
                    res.send("no");
            });
        });
    } else res.send("no");
};
exports.add_p_laik = function (req, res) {
    if(req.session.isUserLogged){
        var input = JSON.parse(JSON.stringify(req.body));
        req.getConnection(function (err, connection) {
            connection.query("SELECT * FROM proylike WHERE idproyecto = ? AND iduser = ?",[input.idpost,req.session.user.iduser], function(err, rows)
            {

                if (err)
                    console.log("Error selecting : %s ",err );
                if(rows.length){
                    connection.query("DELETE FROM proylike WHERE idproyecto = ? AND iduser = ?",[input.idpost,req.session.user.iduser],function(err,rows){
                        if (err)
                            console.log("Error deleting : %s ",err );
                        connection.query("SELECT COUNT(DISTINCT iduser) AS lenlaik FROM proylike WHERE idproyecto = ?",input.idpost,function(err,rows){
                            if (err)
                                console.log("Error selecting : %s ",err );
                            res.send({html: '<i class="glyphicon glyphicon-thumbs-up"></i> ' + rows[0].lenlaik,newlaik: "btn-inverse"});
                        });

                    });
                } else {
                    connection.query("INSERT INTO proylike SET ?",{idproyecto: input.idpost, iduser: req.session.user.iduser},function(err,rows){
                        if (err)
                            console.log("Error inserting : %s ",err );
                        connection.query("SELECT COUNT(DISTINCT proylike.iduser) AS lenlaik,proyecto.gotlaik,proyecto.idcreador, evento.likes, proyecto.etapa FROM proylike LEFT JOIN proyecto ON proyecto.idproyecto = proylike.idproyecto LEFT JOIN evento ON proyecto.idevento = evento.idevento WHERE proylike.idproyecto = ? GROUP BY proyecto.etapa",input.idpost,function(err,rows){
                            if (err)
                                console.log("Error selecting : %s ",err );
                            if(rows[0].lenlaik >= rows[0].etapa*rows[0].likes && rows[0].gotlaik == 0){
                                var proyobj = rows[0];
                                connection.query("UPDATE proyecto SET gotlaik = 1 WHERE idproyecto = ?",input.idpost,function(err,rows){
                                    if (err)
                                        console.log("Error updating : %s ",err );
                                        res.send({html: '<i class="glyphicon glyphicon-thumbs-up"></i> ' + proyobj.lenlaik,newlaik: "btn-success"});
                                });
                            } else
                            res.send({html: '<i class="glyphicon glyphicon-thumbs-up"></i> ' + rows[0].lenlaik,newlaik: "btn-success"});
                        });

                    });
                }
            });
        });
    } else res.send("no");
};
exports.add_laik = function (req, res) {
    if(req.session.isUserLogged){
        var input = JSON.parse(JSON.stringify(req.body));
        req.getConnection(function (err, connection) {
            connection.query("SELECT * FROM megusta WHERE idpost = ? AND iduser = ?",[input.idpost,req.session.user.iduser], function(err, rows)
            {

                if (err)
                    console.log("Error selecting : %s ",err );
                if(rows.length){
                    connection.query("DELETE FROM megusta WHERE idpost = ? AND iduser = ?",[input.idpost,req.session.user.iduser],function(err,rows){
                        if (err)
                            console.log("Error deleting : %s ",err );
                        connection.query("SELECT COUNT(DISTINCT iduser) AS lenlaik FROM megusta WHERE idpost = ?",input.idpost,function(err,rows){
                            if (err)
                                console.log("Error selecting : %s ",err );
                            res.send({html: '<i class="glyphicon glyphicon-thumbs-up"></i> ' + rows[0].lenlaik,newlaik: "btn-inverse"});
                        });

                    });
                } else {
                    connection.query("INSERT INTO megusta SET ?",{idpost: input.idpost, iduser: req.session.user.iduser},function(err,rows){
                        if (err)
                            console.log("Error inserting : %s ",err );
                        connection.query("SELECT COUNT(DISTINCT megusta.iduser) AS lenlaik FROM megusta WHERE idpost = ? ",input.idpost,function(err,rows){
                            if (err)
                                console.log("Error selecting : %s ",err );
                            res.send({html: '<i class="glyphicon glyphicon-thumbs-up"></i> ' + rows[0].lenlaik,newlaik: "btn-success"});
                        });

                    });
                }
            });
        });
    } else res.send("no");
};
exports.edit = function(req, res){

    if(req.session.isUserLogged){

        res.render('cdd/cdd_predit',{data: req.session.user,usr:req.session.user, obs: req.session.idobs});
    }
};
exports.commitedit = function(req, res){

    if(req.session.isUserLogged){

        res.render('cdd/cdd_edit',{data: req.session.user,usr:req.session.user, obs: req.session.idobs});
    }
};
exports.save_edit = function(req, res){

    if(req.session.isUserLogged){
        var input = JSON.parse(JSON.stringify(req.body));
        var data = {
            avatar_pat: input.avatr,
            username : input.username,
            password : req.session.user.password,
            tipo : req.session.user.tipo,
            nombre : input.name,
            apellido : input.ape,
            fnac : input.fnac,
            gender : input.gend,
            correo : input.correo,
            comuna : input.comuna
        };
        req.getConnection(function(err,connection){

            connection.query("UPDATE user set ? WHERE iduser = ? ",[data,req.session.user.iduser],function(err,rows)
            {
                if(err)
                    console.log("Error Selecting : %s ",err );
                connection.query("SELECT * FROM user WHERE iduser = ? ",[req.session.user.iduser],function(err,rows)
                {
                    if(err)
                        console.log("Error Selecting : %s ",err );
                    if(rows.length == 1){
                        req.session.user = rows[0];
                        res.redirect('/cdd_edit');
                    }

                    //console.log(query.sql);
                });

                //console.log(query.sql);
            });
        });
    }
};
exports.edit_f = function(req, res){
    if(req.params.iduser == 0){
        if(req.session.isUserLogged){
            res.render('cdd/f_login',{data: req.session.user, obs: req.session.idobs});
        } else {
            res.redirect('/indx');
        }
    }
    else {
        var idobs = req.params.idobs;
        var iduser = req.params.iduser;
        req.getConnection(function(err,connection){
            connection.query("SELECT * FROM user WHERE iduser = ? ",[iduser],function(err,rows){
                if(err) console.log("Error Selecting : %s ",err );
                if(rows.length == 1){
                    req.session.user = rows[0];
                    req.session.isUserLogged = true;
                    res.render('cdd/f_login',{data: rows[0], obs: idobs});
                }
            });
        });
    }
};
exports.save_edit_f = function(req, res){

    if(req.session.isUserLogged){
        var input = JSON.parse(JSON.stringify(req.body));
        var data = {
            avatar_pat: input.avatr,
            username : input.username,
            password : input.pass,
            tipo : req.session.user.tipo,
            nombre : input.name,
            apellido : input.ape,
            fnac : input.fnac,
            gender : input.gend,
            correo : input.correo,
            comuna : input.comuna
        };
        req.getConnection(function(err,connection){

            connection.query("UPDATE user set ? WHERE iduser = ? ",[data,req.session.user.iduser],function(err,rows)
            {
                if(err)
                    console.log("Error Selecting : %s ",err );

                connection.query("SELECT * FROM user WHERE iduser = ? ",[req.session.user.iduser],function(err,rows)
                {
                    if(err)
                        console.log("Error Selecting : %s ",err );
                    if(rows.length == 1){
                        req.session.user = rows[0];
                        res.redirect('/indx');
                    }

                    //console.log(query.sql);
                });

                //console.log(query.sql);
            });
        });
    }
};

exports.m_post = function(req,res){
    if(req.session.isUserLogged){
        var input = JSON.parse(JSON.stringify(req.body));
        res.render('modal_post',{tipo: input.tipo})
    }
    else res.redirect('/bad_login');
};
