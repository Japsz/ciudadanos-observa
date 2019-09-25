exports.bad_login = function(req, res){
	res.render('bad_login', { title: 'Observa Ciudadanía - Auth Error' });
};

exports.user_login = function(req, res){
	res.render('user_login', { title: 'Observa Ciudadanía - User Login' });
};

exports.admin_login = function(req, res){
	res.render('admin_login', { title: 'Observa Ciudadanía - Admins Login' });
};

exports.user_logout = function(req, res){
    req.session.isAdminLogged = false;
    req.session.isUserLogged = false;
    req.session.isMonitLogged = false;
    req.session.user = 'undefined';
	res.redirect('/');
};

exports.admin_logout = function(req, res){
	req.session.isAdminLogged = false;
    req.session.isUserLogged = false;
    req.session.isMonitLogged = false;
    req.session.user = 'undefined';
    res.redirect('/');
};

exports.user_login_handler = function(req, res){

	var input = JSON.parse(JSON.stringify(req.body));
    if(input.username.split("@").length > 1){
        var query = "SELECT * FROM user WHERE correo = ? LIMIT 1";
    } else {
        var query = 'SELECT * FROM user WHERE username = ? LIMIT 1'
    }
	var username = input.username;

	var password = input.password;

    req.getConnection(function(err,connection){
        if(err)
            console.log("Error Selecting : %s ",err );
          connection.query(query,[username],function(err,users)
          {
              if(err)
                  console.log("Error Selecting : %s ",err );
          	  if(users.length == 0 || users[0].tipo == 4){
          	  	console.log('Invalid Username or Password.');
          	  	res.redirect('/bad_login');
          	  } else if(users.length == 1){
                  var bcryptjs = require('bcryptjs')
                  bcryptjs.compare(password, users[0].password, function(err, result){
                      if (err) {
                          console.log(err)
                          res.redirect('/bad_login')
                      } else if(result) {
                          req.session.user = users[0];
                          var nom = users[0].nombre;
                          switch(users[0].tipo){
                              case 3:
                                  connection.query('SELECT observatorio.* FROM observatorio LEFT JOIN ciudadano ON ciudadano.idobs = observatorio.idobservatorio WHERE ciudadano.iduser = ?',users[0].iduser,function (err, rows){
                                      if(err) console.log("Error selecting cdd: %s",err);
                                      req.session.idobs = rows;
                                      req.session.isUserLogged = true;
                                      if(nom == null){
                                          res.render("/f_login",{data: users[0], obs: rows[0]});
                                      } else res.redirect('/indx');
                                  });
                                  break;
                              case 2:
                                  req.session.isUserLogged = true;
                                  res.redirect("/mod_indx");
                                  break;
                              case 1:
                                  connection.query('SELECT observatorio.* FROM observatorio LEFT JOIN monitor ON monitor.idobservatorio = observatorio.idobservatorio WHERE monitor.idmonitor = ? GROUP BY observatorio.idobservatorio',users[0].iduser,function (err, rows){
                                      if(err) console.log("Error selecting obs: %s",err);
                                      req.session.idobs = rows;
                                      req.session.isUserLogged = true;
                                      req.session.isMonitLogged = true;
                                      res.redirect('/indx');
                                  });
                                  break;
                              default:
                                  res.redirect('/bad_login');
                          }
                      } else {
                          res.redirect('/bad_login');
                      }
                  })
              } else {
          	      console.log(users)
                  res.redirect('/bad_login');
              }
          });
           
           //console.log(query.sql);
	});
  
};
exports.get_obsmonit = function (req, res) {
    var input = JSON.parse(JSON.stringify(req.body));
    req.getConnection(function(err,connection){

        connection.query('SELECT user.* FROM user LEFT JOIN monitor ON user.iduser = monitor.idmonitor WHERE monitor.idobservatorio = ?',[input.idobs],function(err,rows)
        {
            if(err)
                console.log("Error Selecting : %s ",err );
            var html = "";
            for(var i = 0;i<rows.length;i++){
                html += "<tr><td>" + rows[i].correo + "</td><td>" + rows[i].username + "</td><td><a class='btn btn-danger' onclick='manage_monits(" + rows[i].iduser + ',"del"' + ")'><span class='glyphicon glyphicon-remove'></span></a></td></tr>"
            }
            res.send(html);
        });
        //console.log(query.sql);
    });
};
exports.get_monit = function (req, res) {
    var input = JSON.parse(JSON.stringify(req.body));
    req.getConnection(function(err,connection){

        connection.query('SELECT * FROM user WHERE (correo LIKE ? OR username LIKE ?) AND tipo = 1' +
            ' AND  iduser not in (SELECT idmonitor FROM monitor WHERE idobservatorio = ?)',[input.corr + "%",input.corr + "%",input.idobs],function(err,rows)
        {
            if(err)
                console.log("Error Selecting : %s ",err );
            var html = "";
            for(var i = 0;i<rows.length;i++){
                html += "<tr><td>" + rows[i].correo + "</td><td>" + rows[i].username + "</td><td><a class='btn btn-success' onclick='manage_monits(" + rows[i].iduser + ',"add"' + ")'><span class='glyphicon glyphicon-plus'></span></a></td></tr>"
            }
            res.send(html);
        });
        //console.log(query.sql);
    });
};
exports.admin_login_handler = function(req, res){

	var input = JSON.parse(JSON.stringify(req.body));

	var username = input.username;
	var password = input.password;

    req.getConnection(function(err,connection){
         
          connection.query('SELECT * FROM admin WHERE username = ? AND password = ?',[username,password],function(err,rows)
          {
          	  if(rows.length == 0 ){
          	  	console.log('Invalid Username or Password.');
          	  	res.redirect('/bad_login');
          	  }

              if(err)
                  console.log("Error Selecting : %s ",err );
              
              if(rows.length == 1){
                  req.session.user = rows[0];
              	req.session.isAdminLogged = true;
              	res.redirect('/instit');
              }
          });
           //console.log(query.sql);
    });
  
};
exports.reset_pass = function (req, res) {
    if(req.params.recovery.length == 15){
        res.render("reset_pass",{recovery: req.params.recovery});
    } else {
        res.send("FALSOS PROFETAS ALÉJENSE DE LA GRAN ZANAHORIA, ARREPIÉNTETE PECADOR.")
    }
};
// Lógica enviar correo de recuperación
exports.send_mail = function (req, res) {
    var pass = require('generate-password').generate({length : 15,numbers : true});
    req.getConnection(function(err,connection){
        if(err) console.log("Error en la conexión %s",err);
        // Se setea el flag para recuperar la contraseña
        connection.query("SELECT iduser,username FROM user WHERE correo = ? ",[req.params.correo],function(err,cdd)
        {
            if(err){
                console.log("Error Selecting : %s ",err );
                res.send({error: true, str: "Hubo un error al hacer la búsqueda"});
                return;
            }
            if(cdd.length == 1){
                connection.query("UPDATE user SET recovery = ? WHERE iduser = ?",[pass,cdd[0].iduser],function(err,rows){
                    if(err){
                        console.log("Error Selecting : %s ",err );
                        res.send({error: true, str: "Hubo un error con la Base de datos (UPDATE)"});
                    }
                    res.mailer.send('mail_recovery_pass', {
                        to: req.params.correo, // REQUIRED. This can be a comma delimited string just like a normal email to field.
                        subject: 'Recupera tu contraseña', // REQUIRED.
                        data: cdd[0],
                        link: pass// All additional properties are also passed to the template as local variables.
                    }, function (err) {
                        if (err) {
                            // handle error
                            console.log(err);
                            res.send({error: true, str: "Hubo un error al agregar al hacer la búsqueda"});
                        } else {
                            res.send({error: false});
                        }
                    });
                });
            } else {
                res.send({error: true, str: "No encontramos un usuario con ese correo"});
            }
        });
        //console.log(query.sql);
    });
};
//Lógica validar reestablecimiento contraseña
exports.validate_recovery = function (req, res) {

    req.getConnection(function(err,connection){
        if(err) console.log("Error en la conexión %s",err);
        // Se setea el flag para recuperar la contraseña
        var bcrypt = require('bcryptjs')
        bcrypt.hash(req.body.pass, 10, function(err, hash){
            connection.query("UPDATE user SET recovery = 0, password = ? WHERE recovery = ?",[hash,req.body.recovery],function(err,cdd)
            {
                if(err){
                    console.log("Error Selecting : %s ",err );
                    res.send({error: true, str: "Hubo un error al hacer la búsqueda"});
                    return;
                }
                res.send({error: false})
            });
        })
        //console.log(query.sql);
    });
};

exports.add_obsmonit = function (req, res) {
    req.getConnection(function(err,connection){

        connection.query('INSERT INTO monitor SET ?',req.body,function(err,rows)
        {
            if(err){
                console.log("Error Selecting : %s ",err );
                res.send({error: true, str: "Hubo un error al agregar al monitor, Intente mas tarde"});
            }
            res.send({error: false});
        });
        //console.log(query.sql);
    });
};
exports.del_obsmonit = function (req, res) {
    req.getConnection(function(err,connection){

        connection.query('DELETE FROM monitor WHERE idmonitor = ? AND idobservatorio = ?',[parseInt(req.body.idmonitor),parseInt(req.body.idobservatorio)],function(err,rows)
        {
            if(err){
                console.log("Error Selecting : %s ",err );
                res.send({error: true, str: "Hubo un error al borrar al monitor, Intente mas tarde"});
            }
            res.send({error: false});
        });
        //console.log(query.sql);
    });
};


