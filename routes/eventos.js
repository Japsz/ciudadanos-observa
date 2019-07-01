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
            connection.query('SELECT event.idevento, etapas.*, (SELECT COUNT(idenunciado) FROM etapas as et LEFT JOIN enunciado ON et.idetapa=enunciado.idetapa WHERE et.idetapa=etapas.idetapa) as enunciados FROM etapas'
                + ' LEFT JOIN event ON event.idevento = etapas.idevento'
                + ' WHERE etapas.idevento = ? ORDER BY nro ASC', req.params.idevent, function(err, evento) {
                if(err) console.log("Error Selecting : %s ",err );
                // console.log(evento);
                if(evento.length){
                    connection.query('SELECT event.idevento, event.nombre as evento, etapas.*, enunciado.enunciado, enunciado.idenunciado, enunciado.archivo FROM etapas'
                    + ' LEFT JOIN enunciado ON enunciado.idetapa = etapas.idetapa'
                    + ' LEFT JOIN event ON event.idevento = etapas.idevento'
                    + ' WHERE etapas.idevento = ? ORDER BY nro ASC', req.params.idevent, function(err, data) {
                    if(err) console.log("Error Selecting : %s ",err );
                    var enunciados = "";
                    for(var i=0; i<evento.length; i++){
                        enunciados += "" + evento[i].enunciados;
                        if(i != evento.length - 1){
                            enunciados += " ";
                        }
                    }
                    new_data = [];
                    for(var i=0; i<data.length; i++){
                        // Ordeno los enunciados por etapa
                        if(new_data[data[i].nro - 1] == null){
                            new_data[data[i].nro - 1] = [data[i]];
                        } else {
                            new_data[data[i].nro - 1].push(data[i]);
                        }
                    }
                    console.log(new_data);
                    if(data.length){
                            res.render('admin/event/edit_event',{page_title:"Editar evento", data: new_data, evento:evento, usr:req.session.user, enunciados: enunciados});
                        } else res.redirect("/bad_login");
                    });
                } else res.redirect("/bad_login");
            });
        });
    }
    else res.redirect('/bad_login');
};

// Logica editar evento.
exports.save_edit_event = function(req,res){
    if(req.session.isAdminLogged){
        var input = JSON.parse(JSON.stringify(req.body));
        console.log(input);
        console.log(input.data);
        var msj_res = "";
        //           Eliminar etapas          //
        var delete_etapa = [];
        for(var i=0; i<input.ilist_etap.length; i++){
            // Si no esta en la lista final, entonces se ha eliminado esta etapa
            if(!input.elist_etap.includes(input.ilist_etap[i])){
                delete_etapa.push(input.ilist_etap[i]);
            }
        }
        if(delete_etapa.length > 0){
            var delete_etapa_sql = "DELETE FROM enunciado WHERE idetapa IN (";
            var delete_etapa_sql2 = "DELETE FROM etapas WHERE idetapa IN (";
            for(var i=0; i<delete_etapa.length; i++){
                delete_etapa_sql += "" + delete_etapa[i];
                delete_etapa_sql2 += "" + delete_etapa[i];
                if(i != delete_etapa.length -1){
                    delete_etapa_sql += ",";
                    delete_etapa_sql2 += ",";
                }
            }
            delete_etapa_sql += ")";
            delete_etapa_sql2 += ")";
            console.log(delete_etapa_sql);
            req.getConnection(function (err, connection) {
                connection.query(delete_etapa_sql, function(err, enunciados){
                    if(err){
                        console.log("Error deleting enunciado : %s ",err );
                        msj_res += "No se pueden eliminar enunciados que tienen respuestas.";
                    }
                    console.log(delete_etapa_sql2);
                    connection.query(delete_etapa_sql2, function(err, etapas){
                        if(err){
                            console.log("Error deleting etapa : %s ",err );
                            msj_res += "No se pueden eliminar etapas que tienen respuestas de enunciado.";
                        }
                    });
                });
            });
        }
        //           Insertar etapas          //
        if(input.elist_etap.includes(0)){
            var insert_etapa_sql = "INSERT INTO etapas (idevento, nro, nombre, likes, nuevos) VALUES ";
            var new_etapa = 0;
            for(var i=0; i<input.elist_etap.length; i++){
                if(input.elist_etap[i] == 0){
                    new_etapa += 1;
                    insert_etapa_sql += "("+ input.idevento + "," + (i+1) + ",'"+ input.data[i][0] + "',"+ input.data[i][1] + ","+ input.data[i][2] +")";
                    if(i != input.data.length -1){
                        insert_etapa_sql += ",";
                    }
                }
            }
            req.getConnection(function (err, connection) {
                connection.query(insert_etapa_sql, function(err, etapas){
                    if(err) console.log("Error inserting etapas: %s ",err );
                    count = 0;
                    for(var i=(input.elist_enun.length-new_etapa); i<input.elist_enun.length; i++){
                        for(var j=0; j<input.elist_enun[i].length; j++){
                            if(input.elist_enun[i][j] == 0){
                                input.elist_enun[i][j] = parseInt(etapas.insertId) + count;
                            }
                        }
                        count += 1;
                    }
                    // Insertar enunciados de nuevas etapas
                    var insert_enunciado_sql = "INSERT INTO enunciado (idetapa, enunciado, archivo) VALUES ";
                    var new_enun_etapa = [];
                    for(var i=0; i<input.elist_etap.length; i++){
                        if(input.elist_etap[i] == 0){
                            for(var j=3; j<input.data[i].length; j++){
                                if(new_enun_etapa,length > 0){
                                    insert_enunciado_sql += ",";
                                }
                                if(input.data[i][j][1] != 'Escrito'){
                                    insert_enunciado_sql += "("+ input.elist_enun[i][0] + ",'" + input.data[i][j][0] + "',"+ 1 +")";
                                } else {
                                    insert_enunciado_sql += "("+ input.elist_enun[i][0] + ",'" + input.data[i][j][0] + "',"+ 0 +")";
                                }
                                new_enun_etapa.push(input.elist_enun[i][0]);
                            }
                        }
                    }
                    console.log(insert_enunciado_sql);
                    connection.query(insert_enunciado_sql, function(err, etapas){
                        if(err) console.log("Error inserting enunciados: %s ",err );
                    });
                });
            });
        }
        //           Actualizar etapas          //
        // Eliminar enunciados borrados de etapas existentes
        var delete_enunciado = [];
        for(var i=0; i<input.elist_etap.length; i++){
            // Si ya existia esta etapa, se actualiza
            if(input.ilist_etap.includes(input.elist_etap[i])){
                // Eliminar enunciados borrados
                for(var j=0; j< input.ilist_enun[i].length; j++){
                    // Si ha sido borrado
                    if(!input.elist_enun[i].includes(input.ilist_enun[i][j])){
                        delete_enunciado.push(input.ilist_enun[i][j]);
                    }
                }
            }
        }
        if(delete_enunciado.length > 0){
            console.log(delete_enunciado);
            var update_delete_sql = "DELETE FROM enunciado WHERE idenunciado IN (";
            for(var e=0; e<delete_enunciado.length; e++){
                update_delete_sql += delete_enunciado[e];
                if(e != delete_enunciado.length -1){
                    update_delete_sql += ",";
                }
            }
            update_delete_sql += ")";
            console.log(update_delete_sql);
            req.getConnection(function (err, connection) {
                connection.query(update_delete_sql, function(err, enunciados){
                    if(err){
                        console.log("Error deleting enunciado: %s ",err );
                        msj_res += "No se pueden eliminar enunciados que tienen respuestas.";
                    }
                });
            });
        }
        // Insertar enunciados nuevos de etapas existentes
        var new_enun = [];
        var update_insert_sql = "INSERT INTO enunciado (idetapa, enunciado, archivo) VALUES ";
        for(var i=0; i<input.elist_etap.length; i++){
            // Si ya existia esta etapa, se actualiza
            if(input.ilist_etap.includes(input.elist_etap[i])){
                // Insertar enunciados nuevos en etapa existente
                if(input.elist_etap[i] != 0){ // Si no es una etapa nueva
                    for(var j=3; j<input.data[i].length; j++){
                        if(input.data[i][j][2] == 0){
                            if(new_enun.length > 0){
                                update_insert_sql += ",";
                            }
                            if(input.data[i][j][1] != 'Escrito'){
                                update_insert_sql += "("+ input.elist_etap[i] + ",'" + input.data[i][j][0] + "',"+ 1 +")";
                            } else {
                                update_insert_sql += "("+ input.elist_etap[i] + ",'" + input.data[i][j][0] + "',"+ 0 +")";
                            }
                            new_enun.push(input.elist_etap[i]);
                        }
                    }
                }
            }
        }
        if(new_enun.length > 0){
            console.log(update_insert_sql);
            req.getConnection(function (err, connection) {
                connection.query(update_insert_sql, function(err, etapas){
                    if(err) console.log("Error inserting enunciados: %s ",err );
                });
            });
        }
        // Actualizar evento, etapas y enunciados
        var evento = {
            nombre : input.event
        };
        req.getConnection(function (err, connection) {
            connection.query("UPDATE event SET ? WHERE idevento = ?",[evento, input.idevento], function(err, rows){
                if (err) console.log("Error updating event: %s ",err );
                // La sig query inserta las etapas, en caso de existir, las actualiza (siempre las actualiza)
                update_etapas_sql = "INSERT INTO etapas (idetapa, idevento, nro, nombre, likes, nuevos) VALUES ";
                for(var i=0; i<input.elist_etap.length; i++){
                    if(input.elist_etap[i] != 0){
                        update_etapas_sql += "(" + input.elist_etap[i] + "," + input.idevento + "," + (i+1) + ",'" + input.data[i][0] + "'," + input.data[i][1] + "," + input.data[i][2] + ")";
                        if(i != input.elist_etap.length -1){
                            update_etapas_sql += ", ";
                        }
                    }
                }
                update_etapas_sql += " ON DUPLICATE KEY UPDATE idetapa=VALUES(idetapa), idevento=VALUES(idevento), nro=VALUES(nro), nombre=VALUES(nombre), likes=VALUES(likes), nuevos=VALUES(nuevos)";
                console.log(update_etapas_sql);
                connection.query(update_etapas_sql, function(err, rows){
                    if (err) console.log("Error updating etapas: %s ",err );
                    var update_enunciados_sql = "INSERT INTO enunciado (idenunciado, idetapa, enunciado, archivo) VALUES ";
                    var update_enun = [];
                    for(var i=0; i<input.elist_etap.length; i++){
                        if(input.elist_etap[i] != 0){
                            for(var j=3; j<input.data[i].length; j++){
                                if(input.data[i][j][2] != 0){
                                    if(update_enun.length > 0){
                                        update_enunciados_sql += ",";
                                    }
                                    if(input.data[i][j][1] != 'Escrito'){
                                    update_enunciados_sql += "(" + input.data[i][j][2] + "," + input.elist_etap[i] + ",'" + input.data[i][j][0] + "'," + 1 + ")";
                                    } else{
                                        update_enunciados_sql += "(" + input.data[i][j][2] + "," + input.elist_etap[i] + ",'" + input.data[i][j][0] + "'," + 0 + ")";
                                    }
                                    update_enun.push(input.data[i][j][2]);
                                }
                            }
                        }
                    }
                    update_enunciados_sql += " ON DUPLICATE KEY UPDATE idenunciado=VALUES(idenunciado), idetapa=VALUES(idetapa), enunciado=VALUES(enunciado), archivo=VALUES(archivo)";
                    console.log(update_enunciados_sql);
                    connection.query(update_enunciados_sql, function(err, rows){
                        if (err) console.log("Error updating enunciados: %s ",err );
                        if(msj_res == ""){
                            res.send("ok");
                        } else{
                            res.send(msj_res);
                        }
                    });
                });
            });
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
                connection.query('SELECT event.idevento, event.nombre as evento, etapas.*, enunciado.enunciado, enunciado.idenunciado, enunciado.archivo FROM etapas'
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

//Eliminar evento
exports.delete_event = function(req, res){
    if(req.session.isAdminLogged){
        req.getConnection(function(err,connection){
            connection.query("UPDATE observatorio SET idevento = ? WHERE idevento = ?",[1, req.params.idevent], function(err, rows){
                if (err) console.log("Error updating observatorio: %s ",err );
                connection.query('SELECT * FROM event',function(err,rows){
                    if(err) console.log("Error Selecting : %s ",err );
                    res.render('admin/event/event_list',{page_title:"Eventos",data:rows, usr:req.session.user});
                });
            });
        });
    }
    else res.redirect('/bad_login');
};