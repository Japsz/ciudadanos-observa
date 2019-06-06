//Vista agregar inst.
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
exports.save = function(req,res){
    if(req.session.isAdminLogged){
        var input = JSON.parse(JSON.stringify(req.body));
        req.getConnection(function (err, connection) {

            var inst_data = {
                etapas : input.etapas,
                likes : input.likes,
                nuevos   : input.nuevos,
                nombre : input.nombre
            };

            connection.query("INSERT INTO evento SET ? ",inst_data, function(err, rows)
            {

                if (err)
                    console.log("Error inserting : %s ",err );
                var query = "INSERT INTO etapa (`token`,`nro`,`idevento`,`nombre`) VALUES ?";
                var aux;
                var list = [];
                if(inst_data.etapas > 1){
                    for(var i = 0; i < inst_data.etapas;i++){
                        aux =[input.texto1[i]+"&&" + input.texto2[i],i+1,rows.insertId,input.noms[i]];
                        list.push(aux);
                    }
                } else {
                    aux =[input.texto1+"&&" + input.texto2,1,rows.insertId,input.noms];
                    list.push(aux);
                }
                connection.query(query,[list],function(err,rows){
                    res.redirect('/event');
                })
            });
            // console.log(query.sql); get raw query
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