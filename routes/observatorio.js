//Vista agregar inst.
exports.add_inst = function(req, res){
    if(req.session.isAdminLogged){
        res.render('admin/obs/add_inst',{page_title:"Agregar Institución"});
    }
    else res.redirect('/bad_login');
};
//Vista lista de instituciones.
exports.list = function(req, res){
    if(req.session.isAdminLogged){
        req.getConnection(function(err,connection){

            connection.query('SELECT institucion.*,' +
                'GROUP_CONCAT(observatorio.idobservatorio,"@@",observatorio.nom,"@@",observatorio.max,"@@",observatorio.estado) AS obs_token FROM institucion' +
                ' LEFT JOIN observatorio ON observatorio.idinst = institucion.idinstitucion GROUP BY institucion.idinstitucion',function(err,rows)
            {

                if(err)
                    console.log("Error Selecting : %s ",err );
                console.log(rows);
                res.render('admin/obs/instit_list',{page_title:"Instituciones",data:rows, usr:req.session.user});

            });
            //console.log(query.sql);
        });
    }
    else res.redirect('/bad_login');
};
//Vista detalle observatorio.
exports.admin_obs = function(req, res){
    if(req.session.isAdminLogged){
        req.getConnection(function(err,connection){

            var query = connection.query('SELECT * FROM observatorio WHERE idobservatorio = ?',req.params.idobs,function(err,obs)
            {
                if(err)
                    console.log("Error Selecting : %s ",err );
                connection.query("SELECT user.*,COUNT(post.idpost) AS posts FROM user LEFT JOIN ciudadano ON ciudadano.iduser = user.iduser LEFT JOIN post ON post.iduser = user.iduser" +
                    " WHERE ciudadano.idobs = ? GROUP BY user.iduser",req.params.idobs,function(err,users){
                    if(err)
                        console.log("Error Selecting : %s ",err );
                    connection.query("SELECT proyecto.*,user.username,evento.nombre, COUNT(userproyecto.iduser) AS ints FROM proyecto LEFT JOIN user ON user.iduser = proyecto.idcreador" +
                        " LEFT JOIN evento ON proyecto.idevento = evento.idevento LEFT JOIN userproyecto ON userproyecto.idproyecto = proyecto.idproyecto WHERE proyecto.idobservatorio = ? GROUP BY proyecto.idproyecto",req.params.idobs,function(err,proyects){
                        if(err)
                            console.log("Error Selecting : %s ",err );
                        res.render('admin/obs/admin_obs',{page_title:"Observatorios",obs:obs[0], usr:req.session.user,users: users,proyects: proyects});
                    });

                });

            });
            //console.log(query.sql);
        });
    }
    else res.redirect('/bad_login');
};
// Mostrar observatorios de Institución específica
exports.obs_list = function(req, res){
    if(req.session.isAdminLogged){
        req.getConnection(function(err,connection){

            connection.query('SELECT observatorio.*,user.correo,COUNT(proyecto.idproyecto) AS proyectos, COUNT(ciudadano.iduser) AS cdds FROM observatorio LEFT JOIN monitor ON monitor.idobservatorio = observatorio.idobservatorio LEFT JOIN user ON monitor.idmonitor = user.iduser' +
                ' LEFT JOIN proyecto ON proyecto.idobservatorio = observatorio.idobservatorio LEFT JOIN ciudadano ON ciudadano.idobs = observatorio.idobservatorio WHERE observatorio.idinst = ? GROUP BY observatorio.idobservatorio',req.params.id,function(err,rows)
            {
                if(err)
                    console.log("Error Selecting : %s ",err );

                connection.query('SELECT * FROM institucion WHERE idinstitucion = ?',req.params.id,function(err,insts)
                {
                    if(err)
                        console.log("Error Selecting : %s ",err );

                    res.render('admin/obs/obs_list',{page_title:"Observatorios",data:rows,inst:insts[0], usr:req.session.user});

                });

            });
            //console.log(query.sql);
        });
    }
    else res.redirect('/bad_login');
};
// Logica agregar institucion y monitor principal.
exports.save = function(req,res){
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
            connection.query("INSERT INTO institucion SET ? ",inst_data, function(err, rows)
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
//Lógica editar institucion
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
// Logica agregar observatorio.
// Estado:
//      1 - Activo
//      2 - Inactivo
//      3 - Archivado
exports.obs_save = function(req,res){
    if(req.session.isAdminLogged){
        var input = JSON.parse(JSON.stringify(req.body));
        req.getConnection(function (err, connection) {

            var data = {
                estado : 1,
                nom   : input.nom,
                avatar_pat : "/assets/img/placeholder.png",
                max : input.maxim,
                idinst : input.id
            };

            connection.query("INSERT INTO observatorio SET ? ",data, function(err, rows)
            {

                if (err)
                    console.log("Error inserting : %s ",err );

                res.redirect('/show_obs/' + rows.insertId);

            });
            // console.log(query.sql); get raw query
        });
    }
    else res.redirect('/bad_login');
};
// Lógica Archivar Observatorio
exports.obs_archive = function(req, res){
    if(req.session.isAdminLogged){
        req.getConnection(function(err,connection){
            connection.query('DELETE FROM monitor WHERE idobservatorio = ?',req.params.id,function(err,rows)
            {
                if(err)
                    console.log("Error Deleting : %s ",err );

                connection.query('UPDATE user SET tipo = 4 WHERE iduser IN (SELECT iduser FROM ciudadano WHERE idobs = ?)',req.params.id,function(err,insts)
                {
                    if(err)
                        console.log("Error Updating : %s ",err );
                    // Enviar correo a TODOS los usuarios modificados en la query anterior (DESACTIVACIÓN
                    connection.query('UPDATE observatorio SET estado = 3 WHERE idobservatorio = ?',req.params.id,function(err,insts)
                    {
                        if(err)
                            console.log("Error Selecting : %s ",err );
                        connection.query('DELETE FROM ciudadano WHERE idobs = ?',req.params.id,function(err,insts)
                        {
                            if(err)
                                console.log("Error Selecting : %s ",err );

                            res.redirect("/instit");
                        });
                    });
                });

            });
            //console.log(query.sql);
        });
    }
    else res.redirect('/bad_login');
};
