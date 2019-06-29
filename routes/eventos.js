//Vista agregar evento.
exports.add_evnt = function(req, res){
    if(req.session.isAdminLogged){
        res.render('admin/event/add_evnt',{page_title:"Agregar Evento",usr:req.session.user});
    }
    else res.redirect('/bad_login');
};

//Vista lista de eventos
exports.list = function(req, res){
    if(req.session.isAdminLogged){
        req.getConnection(function(err,connection){

            var query = connection.query('SELECT * FROM event',function(err,rows)
            {

                if(err)
                    console.log("Error Selecting : %s ",err );

                res.render('admin/event/event_list',{page_title:"Eventos",data:rows, usr:req.session.user});

            });
            //console.log(query.sql);
        });
    }
    else res.redirect('/bad_login');
};

//Editar evento
exports.edit_event = function(req, res){
    if(req.session.isAdminLogged){
        req.getConnection(function(err,connection){
            // Por terminar
        });
    }
    else res.redirect('/bad_login');
};

//Vista Detalle evento
exports.obs_list = function(req, res){
    if(req.session.isAdminLogged){
        req.getConnection(function(err,connection){

            connection.query('SELECT observatorio.nom,institucion.nom as instnom, institucion.comuna FROM observatorio '
                + ' LEFT JOIN institucion ON observatorio.idinst = institucion.idinstitucion '
                + ' WHERE observatorio.idevento = ? GROUP BY observatorio.idobservatorio',req.params.id,function(err,rows) {
                if(err) console.log("Error Selecting : %s ",err );
                connection.query('SELECT event.nombre as evento, etapas.*, enunciado.enunciado, enunciado.idenunciado, enunciado.archivo FROM etapas'
                    + ' LEFT JOIN enunciado ON enunciado.idetapa = etapas.idetapa'
                    + ' LEFT JOIN event ON event.idevento = etapas.idevento'
                    + ' WHERE etapas.idevento = ? ORDER BY nro ASC',req.params.id,function(err,etapas) {
                    if(err) console.log("Error Selecting : %s ",err );
                    console.log(etapas);
                    if(etapas.length){
                        res.render('admin/event/event_obs',{page_title:"Observatorios",data:rows, etapa:etapas, usr:req.session.user});
                    } else res.redirect("/bad_login");
                });
            });
            //console.log(query.sql);
        });
    }
    else res.redirect('/bad_login');
};
exports.obstream = function(req, res){
    var input = JSON.parse(JSON.stringify(req.body));
    var dats = [];
    if(req.session.isAdminLogged){
        var query = "SELECT observatorio.nom,institucion.nom as instnom, institucion.comuna, observatorio.idobservatorio FROM observatorio LEFT JOIN institucion ON observatorio.idinst = institucion.idinstitucion WHERE observatorio.idevento != ? AND observatorio.nom LIKE ? AND institucion.nom LIKE ? AND institucion.comuna LIKE ? GROUP BY observatorio.idobservatorio";
        dats.push(input.idevnt);
        dats.push(input.nom + "%");
        dats.push(input.ape + "%");
        dats.push(input.verif + "%");
        req.getConnection(function(err,connection){
            connection.query(query,dats,function(err,rows)
            {
                if(err)
                    console.log("Error Selecting : %s ",err );
                res.render('admin/event/evnt_stream',{data:rows, idevnt: input.idevnt});

            });
            //console.log(query.sql);
        });
    }
    else res.redirect('/bad_login');

};
// Logica agregar evento.
exports.save_event = function(req,res){
    if(req.session.isAdminLogged){
        var input = JSON.parse(JSON.stringify(req.body));
        req.getConnection(function (err, connection) {
            connection.query('INSERT INTO event (nombre) VALUES (?) ',[input.event],function(err,event){
                if(err) console.log("Error inserting : %s ",err );
                var sql = "INSERT INTO etapas (idevento, nro, nombre, likes, nuevos) VALUES ";
                for(var i=0; i < input.data.length;i++){
                    sql += "("+ event.insertId + "," + (i+1) + ",'"+ input.data[i][0] + "',"+ input.data[i][1] + ","+ input.data[i][2] +")";
                    if(i != input.data.length -1){
                        sql += ",";
                    }
                }
                connection.query(sql,function(err, etapas){
                    if(err) console.log("Error inserting : %s ",err );
                    var sql2 = "INSERT INTO enunciado (idetapa, enunciado, archivo) VALUES ";
                    for(var i=0; i < input.data.length; i++){
                        for(var j=3; j<input.data[i].length; j++){
                            if(input.data[i][j][1] != 'Escrito'){
                                sql2 += "("+ (etapas.insertId + i) + ",'" + input.data[i][j][0] + "',"+ 1 +")";
                            } else {
                                sql2 += "("+ (etapas.insertId + i) + ",'" + input.data[i][j][0] + "',"+ 0 +")";
                            }
                            if(!((j == input.data[i].length -1) && (i == input.data.length -1))){
                                sql2 += ",";
                            }
                        }
                    }                    
                    connection.query(sql2,function(err, enunciado){
                        if(err) console.log("Error inserting : %s ",err );
                        if(enunciado.insertId){
                            res.send("ok");
                        }
                    });
                });
            });
        });
    }
    else res.redirect('/bad_login');
};
exports.inst_edit = function(req,res){
    if(req.session.isAdminLogged){
        var input = JSON.parse(JSON.stringify(req.body));
        req.getConnection(function (err, connection) {

            var inst_data = {
                correo : input.correo,
                fono : input.fono,
                nom   : input.nom,
                comuna : input.comuna,
                direccion : input.direccion,
                avatar_pat : "/assets/img/placeholder.png"
            };
            console.log(input);
            connection.query("UPDATE institucion SET ? WHERE idinstitucion = ?",[inst_data,input.id], function(err, rows)
            {

                if (err)
                    console.log("Error inserting : %s ",err );

                res.redirect('/instit');

            });
            // console.log(query.sql); get raw query
        });
    }
    else res.redirect('/bad_login');
};
exports.addto_evnt = function(req,res){
    if(req.session.isAdminLogged){
        var input = JSON.parse(JSON.stringify(req.body));
        req.getConnection(function (err, connection) {
            connection.query("UPDATE observatorio SET idevento = ? WHERE idobservatorio = ?",[input.idevnt,input.idobs], function(err, rows)
            {

                if (err)
                    console.log("Error inserting : %s ",err );
                connection.query("SELECT observatorio.nom,institucion.nom as instnom, institucion.comuna FROM observatorio LEFT JOIN institucion ON observatorio.idinst = institucion.idinstitucion WHERE observatorio.idevento = ? GROUP BY observatorio.idobservatorio",[input.idevnt],function(err,rows){
                    if (err)
                        console.log("Error inserting : %s ",err );
                    res.render("admin/event/allobs",{data:rows});
                });
            });
            // console.log(query.sql); get raw query
        });
    }
    else res.redirect('/bad_login');
};