/**
 * Created by benja on 26-06-2017.
 */

var send = require('../routes/sendmails'); //Importar la funcion para enviar mail

exports.indx = function(req, res){
    if(req.session.isUserLogged){
        req.getConnection(function(err,connection){
            connection.query('SELECT COUNT(DISTINCT comentario.idcomentario) as c_count,post.*,user.username,'
                + ' COALESCE(user.avatar_pat,"/assets/img/placeholder.png") AS iconouser,'
                + ' GROUP_CONCAT(DISTINCT tags.tag,"@", tags.idtag ORDER BY tags.tag) AS tagz,'
                + ' COUNT(DISTINCT megusta.iduser) as likes, GROUP_CONCAT(DISTINCT megusta.iduser) as laiktoken, observatorio.nom FROM post'
                + ' LEFT JOIN observatorio ON post.idobs=observatorio.idobservatorio'
                + ' LEFT JOIN tagpost ON post.idpost = tagpost.idpost LEFT JOIN tags ON tagpost.idtag = tags.idtag LEFT JOIN user ON user.iduser = post.iduser'
                + ' LEFT JOIN megusta ON megusta.idpost = post.idpost LEFT JOIN comentario ON comentario.idpost = post.idpost WHERE post.estado = 2 GROUP BY post.idpost ORDER BY post.fecha DESC LIMIT 6',function(err,rows){
                if(err)
                    console.log("Error Selecting : %s ",err );
                res.render('posts/cdd_index',{data :rows, usr:req.session.user, obs: req.session.idobs,stream: "indx",helper: ""});

                //console.log(query.sql);
            });
        });
    } else res.redirect('/bad_login');
};

exports.indx_stream = function(req, res){
    if(req.session.isUserLogged){
        var input = JSON.parse(JSON.stringify(req.body));
        var wher;
        var render = "posts/";
        var query = 'SELECT post.*, GROUP_CONCAT(DISTINCT megusta.iduser) as laiktoken,COALESCE(user.avatar_pat,"/assets/img/placeholder.png") AS iconouser,user.username,' +
            'GROUP_CONCAT(DISTINCT tags.tag,"@", tags.idtag ORDER BY tags.tag) AS tagz, COUNT(DISTINCT megusta.iduser) as likes,  COUNT(DISTINCT comentario.idcomentario) as c_count, observatorio.nom FROM' +
            ' post LEFT JOIN observatorio ON post.idobs=observatorio.idobservatorio LEFT JOIN tagpost ON post.idpost = tagpost.idpost LEFT JOIN comentario ON comentario.idpost = post.idpost LEFT JOIN tags ON tagpost.idtag = tags.idtag LEFT JOIN user ON user.iduser = post.iduser' +
            ' LEFT JOIN megusta ON megusta.idpost = post.idpost WHERE post.fecha < ? ';
        switch(input.strim){
            case "indx":
                wher = 'AND post.estado = 2 GROUP BY post.idpost ORDER BY post.fecha DESC LIMIT 6';
                break;
            case "miobs":
                wher = 'AND post.estado = 2 AND post.idobs = ? GROUP BY post.idpost ORDER BY post.fecha DESC LIMIT 6';
                break;
            case "btag":
                wher = 'AND post.estado = 2 AND post.idpost IN (SELECT post.idpost FROM post LEFT JOIN tagpost ON tagpost.idpost = post.idpost LEFT JOIN tags ON tags.idtag = tagpost.idtag WHERE tags.tag = ?) ' +
                    'GROUP BY post.idpost ORDER BY post.fecha DESC LIMIT 6';
                break;
            case "getcat":
                wher = 'AND post.estado = 2 AND post.idpost IN (SELECT post.idpost FROM post LEFT JOIN tagpost ON tagpost.idpost = post.idpost LEFT JOIN tags ON tags.idtag = tagpost.idtag WHERE tags.idtag = ?) ' +
                    'GROUP BY post.idpost ORDER BY post.fecha DESC LIMIT 6';
                break;
            case "usrpost":
                wher = "AND post.iduser = ? GROUP BY post.idpost ORDER BY post.fecha DESC LIMIT 6";
                render += "my";
                break;
            case "archives":
                wher = 'AND post.fecha > ? AND post.estado = 2 GROUP BY post.idpost ORDER BY post.fecha DESC LIMIT 6';
                break;
            default:
                wher = 'AND post.estado = 2 GROUP BY post.idpost ORDER BY post.fecha DESC LIMIT 6';
                break;
        }
        req.getConnection(function(err,connection){

            connection.query(query + wher,[new Date(input.idpost),input.helper],function(err,rows)
            {
                if(err)
                    console.log("Error Selecting : %s ",err );
                if(rows.length){
                    res.render(render + 'pst_stream',{data:rows, usr:req.session.user},function (err,html) {
                        if(err) console.log("Error rendering: %s",err);
                        res.send({html: html, newval: rows[rows.length - 1].fecha});
                    });
                } else {
                    res.send({html: "<p>No hay Mas Posts</p>", newval: "nada"});
                }


                //console.log(query.sql);
            });
        });
    } else res.redirect('/bad_login');
};
// Ver post entero
exports.getpost = function(req, res){
    if(req.session.isUserLogged){
        req.getConnection(function(err,connection){

            connection.query('SELECT post.*,user.avatar_pat AS iconouser,user.username, GROUP_CONCAT(DISTINCT megusta.iduser) as laiktoken' +
                ',GROUP_CONCAT(DISTINCT tags.tag,"@", tags.idtag ORDER BY tags.tag) AS tagz, COUNT(DISTINCT megusta.iduser) as likes FROM' +
                ' post LEFT JOIN tagpost ON post.idpost = tagpost.idpost LEFT JOIN tags ON tagpost.idtag = tags.idtag INNER JOIN user ON user.iduser = post.iduser' +
                ' LEFT JOIN megusta ON megusta.idpost = post.idpost WHERE post.idpost  = ? AND post.estado = 2 GROUP BY post.idpost',req.params.idpost,function(err,rows)
            {
                if(err)
                    console.log("Error Selecting : %s ",err );
                var post = rows[0];
                connection.query('SELECT comentario.*,user.username,user.avatar_pat FROM comentario INNER JOIN user ON user.iduser = comentario.iduser' +
                    ' WHERE idpost  = ? GROUP BY comentario.idcomentario',req.params.idpost,function(err,rows)
                {
                    if(err)
                        console.log("Error Selecting : %s ",err );

                    res.render('posts/getpost',{data:post,usr:req.session.user, obs: req.session.idobs,comments : rows});

                    //console.log(query.sql);
                });
                //console.log(query.sql);
            });
        });
    } else res.redirect('/bad_login');
};
exports.getcomments = function(req, res){
    var input = JSON.parse(JSON.stringify(req.body));
    if(req.session.isUserLogged){
        req.getConnection(function(err,connection){

            connection.query('SELECT comentario.*,user.username,COALESCE(user.avatar_pat,"/assets/img/placeholder.png") as avatar_pat FROM comentario INNER JOIN user ON user.iduser = comentario.iduser' +
                ' WHERE comentario.idpost  = ? GROUP BY comentario.idcomentario',input.idpost,function(err,rows)
            {
                if(err)
                    console.log("Error Selecting : %s ",err );

                res.render('posts/cmnt_stream',{data:input.idpost,usr:req.session.user,comments : rows});

                //console.log(query.sql);
            });
            //console.log(query.sql);
        });
    } else res.redirect('/bad_login');
};
// Logica agregar post.
//    Estados
// 1 : pendiente
// 2 : aceptado
// 3 : rechazado
exports.save = function(req,res){
    if(req.session.isUserLogged){
        var input = JSON.parse(JSON.stringify(req.body));
        req.getConnection(function (err, connection) {
            if(input.tipo == "4"){
                var embed = require("embed-video");
                // Crea iframe con el reproductor de video correspondiente (youtube, vimeo, dailymotion)
                input.tit = embed(input.tit,{attr:{width:"100%",height:536}});
            } else if (input.tipo == "1" && input.tags == "") input.tags = "idea";
            var data = {
                estado : 1,
                tipo   : input.tipo,
                iduser   : req.session.user.iduser,
                t_principal : input.tit,
                tags : input.tags.replace(/\s/g,'')
            };
            if(parseInt(input.tipo) > 1 && input.texto != ""){
                data.contenido = input.texto;
            }
            if(req.session.user.tipo == 1){
                data.estado = 2;
            }
            if(input.idobserva != 'no'){
                data.idobs = input.idobserva;
            }
            connection.query("INSERT INTO post SET ? ",data, function(err, rows) {
                if(err) console.log("Error inserting : %s ",err );
                // Obtengo los usuarios del observatorio(envia solo si el post es por observatorio) para enviar un correo informando el post
                if(input.idobserva != 'no'){
                    connection.query('SELECT user.iduser, observatorio.idobservatorio as idobs, observatorio.nom, username, correo, nombre FROM user'
                        + ' LEFT JOIN ciudadano ON user.iduser=ciudadano.iduser'
                        + ' JOIN observatorio ON observatorio.idobservatorio=ciudadano.idobs'
                        + ' where idobservatorio =' + input.idobserva, function(err, obs) {
                        if(err) {
                            console.log("Error Selecting : %s ",err );
                        } else if(obs.length > 0) {
                            //Variables para envio de correo, data_mail debe tener las mismas variables
                            var correos = [];
                            for(var i=0; i<obs.length; i++){
                                if(obs[i].correo != null){
                                    correos.push(obs[i].correo);
                                }
                            }
                            var obs = new Array(obs[0].nom, obs[0].idobs); //Envia el nombre del obs y su id para la url
                            var subj = "Aviso de Observa ciudadania";
                            var data_mail = {
                                view: "views\\monitor\\post_notice.ejs", //Path
                                subject: subj, //Asunto del mensaje
                                inf: obs, //Array con informacion de observatorio
                                mails: correos}; //Array de los correos
                            send.send_mail(data_mail,function(err) {
                                if(err){
                                    console.log(err.message);
                                }
                            });
                        }
                    });
                }
                var postid = rows.insertId;
                if(input.tags != ""){
                    var tags = input.tags.replace(/\s/g,'').split(",");
                    var aux = [];
                    var query2 = "SELECT * FROM tags WHERE tag = ?";
                    for(var k = 0 ; k < tags.length;k++){
                        if(k >= 1){
                            query2 += " OR tag = ?";
                        }
                        aux.push([tags[k]]);
                    }
                    connection.query("INSERT INTO tags (`tag`) VALUES ?",[aux], function(err, nada) {
                        if (err) console.log("Error INSERTINg : %s ",err );
                        connection.query(query2,tags, function(err, tags) {
                            if (err) console.log("Error selecting : %s ",err );
                            //console.log(tags);
                            var query ="INSERT INTO tagpost (`idtag`, `idpost`) VALUES ?";
                            var list = [];
                            for(var i = 0; i < tags.length;i++){
                                aux =[tags[i].idtag,postid];
                                list.push(aux);
                            }
                            if(input.cat != ""){
                                list.push([input.cat,postid]);
                            }
                            connection.query(query,[list], function(err, rows) {
                                if (err) console.log("Error inserting : %s ",err );
                                res.send("si");
                            });
                        });
                    });
                } else {
                    if(input.cat != ""){
                        connection.query("INSERT INTO tagpost (`idtag`, `idpost`) VALUES ?",[[[input.cat,postid]]], function(err, rows){
                            if (err) console.log("Error inserting : %s ",err );
                            res.send("si");
                        });
                    } else {
                        res.send("si");
                    }
                }
            });
            // console.log(query.sql); get raw query
        });
    }
    else res.send("no");
};
// buscar por fecha
exports.b_fecha = function(req, res){

    req.getConnection(function(err,connection){
        var input = JSON.parse(JSON.stringify(req.body));
        connection.query('SELECT post.*, GROUP_CONCAT(DISTINCT megusta.iduser) as laiktoken,user.avatar_pat AS iconouser,user.username,GROUP_CONCAT(DISTINCT tags.tag,"@", tags.idtag ORDER BY tags.tag) AS tagz, COUNT(DISTINCT megusta.iduser) as likes FROM' +
            ' post LEFT JOIN tagpost ON post.idpost = tagpost.idpost LEFT JOIN tags ON tagpost.idtag = tags.idtag INNER JOIN user ON user.iduser = post.iduser' +
            ' LEFT JOIN megusta ON megusta.idpost = post.idpost WHERE post.fecha < ? AND post.fecha > ?  AND post.estado = 2 GROUP BY post.idpost ORDER BY post.fecha DESC LIMIT 6',[input.hasta,input.desde],function(err,rows)
        {
            if(err)
                console.log("Error Selecting : %s ",err );
            res.render('posts/cdd_index',{data:rows,usr:req.session.user, obs: req.session.idobs, stream: "archives", helper: input.desde});

            //console.log(query.sql);
        });
    });

};

// Buscar por tag
exports.b_tag = function(req, res){

    req.getConnection(function(err,connection){
        var input = JSON.parse(JSON.stringify(req.body));
        input.busqueda = input.busqueda.replace(/\s/g,'').split(",");
        connection.query('SELECT post.*, GROUP_CONCAT(DISTINCT megusta.iduser) as laiktoken,user.avatar_pat AS iconouser,user.username,GROUP_CONCAT(DISTINCT tags.tag,"@", tags.idtag ORDER BY tags.tag) AS tagz, COUNT(DISTINCT megusta.iduser) as likes, GROUP_CONCAT(DISTINCT megusta.iduser) as laiktoken FROM' +
            ' post LEFT JOIN tagpost ON post.idpost = tagpost.idpost LEFT JOIN tags ON tagpost.idtag = tags.idtag INNER JOIN user ON user.iduser = post.iduser' +
            ' LEFT JOIN megusta ON megusta.idpost = post.idpost WHERE post.idpost IN (SELECT post.idpost FROM post LEFT JOIN tagpost ON tagpost.idpost = post.idpost LEFT JOIN tags ON tags.idtag = tagpost.idtag WHERE tags.tag = ?) AND post.estado = 2 GROUP BY post.idpost ORDER BY post.fecha DESC LIMIT 6',input.busqueda,function(err,rows)
        {
            if(err)
                console.log("Error Selecting : %s ",err );
            res.render('posts/cdd_index',{data:rows,usr:req.session.user, obs: req.session.idobs, stream: "btag", helper: input.busqueda});

            //console.log(query.sql);
        });
    });

};

exports.post_obs = function(req, res){
    if(req.session.isUserLogged && req.session.user.tipo == 3){
        req.getConnection(function(err,connection){

            connection.query('SELECT post.*, GROUP_CONCAT(DISTINCT megusta.iduser) as laiktoken,user.username,user.avatar_pat AS iconouser,GROUP_CONCAT(DISTINCT tags.tag,"@", tags.idtag ORDER BY tags.tag) AS tagz, COUNT(DISTINCT megusta.iduser) as likes FROM' +
                ' post LEFT JOIN tagpost ON post.idpost = tagpost.idpost LEFT JOIN tags ON tagpost.idtag = tags.idtag INNER JOIN user ON user.iduser = post.iduser' +
                ' LEFT JOIN megusta ON megusta.idpost = post.idpost WHERE post.estado = 2 AND post.idobs = ? GROUP BY post.idpost ORDER BY post.fecha DESC LIMIT 6',req.session.idobs[0].idobservatorio,function(err,rows)
            {
                if(err)
                    console.log("Error Selecting : %s ",err );
                res.render('posts/cdd_index',{data :rows, usr:req.session.user, obs: req.session.idobs, stream: "miobs", helper: req.session.idobs[0].idobservatorio});

                //console.log(query.sql);
            });
        });
    } else res.redirect('/bad_login');
};

exports.p_edit = function(req, res){
    if(req.session.isUserLogged && req.session.user.tipo == 3){
        var input = JSON.parse(JSON.stringify(req.body));
        if(input.tipo == "4"){
            input.tit = input.tit.split("=")[1];
        } else if (input.tipo == "1" && input.tags == "") input.tags = "idea";
        var data = {
            estado : 1,
            t_principal : input.tit,
            tags : input.tags.replace(/\s/g,''),
            fecha: new Date()
        };
        if(parseInt(input.tipo) > 1 && input.texto != ""){
            data.contenido = input.texto;
        }
        req.getConnection(function(err,connection){
            connection.query('UPDATE post SET ? WHERE post.estado = 3 AND post.iduser = ? AND idpost = ?',[data,req.session.user.iduser,req.params.idpost],function(err,rows)
            {
                if(err)
                    console.log("Error Selecting : %s ",err );
                res.redirect('/usr_post');

                //console.log(query.sql);
            });
        });
    } else res.redirect('/bad_login');
};

exports.usr_post = function(req, res){
    if(req.session.isUserLogged){
        req.getConnection(function(err,connection){

            connection.query('SELECT post.*,user.username,user.avatar_pat AS iconouser,'
                + ' GROUP_CONCAT(DISTINCT tags.tag,"@", tags.idtag ORDER BY tags.tag) AS tagz,'
                + ' GROUP_CONCAT(DISTINCT megusta.iduser) as laiktoken, COUNT(DISTINCT megusta.iduser) as likes, observatorio.nom FROM post'
                + ' LEFT JOIN observatorio ON post.idobs=observatorio.idobservatorio'
                + ' LEFT JOIN tagpost ON post.idpost = tagpost.idpost'
                + ' LEFT JOIN tags ON tagpost.idtag = tags.idtag'
                + ' INNER JOIN user ON user.iduser = post.iduser'
                + ' LEFT JOIN megusta ON megusta.idpost = post.idpost WHERE post.iduser = ? GROUP BY post.idpost ORDER BY post.fecha DESC LIMIT 6',req.session.user.iduser,function(err,rows)
            {
                if(err)
                    console.log("Error Selecting : %s ",err );
                res.render('posts/cdd_post',{data :rows, usr:req.session.user, obs: req.session.idobs, pat:"usrpost",helper: req.session.user.iduser});
                //console.log(query.sql);
            });
        });
    } else res.redirect('/bad_login');
};

exports.rm_post = function (req, res) {
    if(req.session.isUserLogged){
        req.getConnection(function (err, connection) {
            connection.query("DELETE FROM tagpost WHERE idpost = ?",req.params.idpost,function(err,rows){
                if (err)
                    console.log("Error deleting : %s ",err );
                connection.query("DELETE FROM megusta WHERE idpost = ?",req.params.idpost,function(err,rows){
                    if (err)
                        console.log("Error deleting : %s ",err );
                    connection.query("DELETE FROM comentario WHERE idpost = ?",req.params.idpost,function(err,rows){
                        if (err)
                            console.log("Error deleting : %s ",err );
                        connection.query("DELETE FROM post WHERE idpost = ? AND iduser = ?",[req.params.idpost,req.session.user.iduser], function(err, rows)
                        {
                            if (err)
                                console.log("Error inserting : %s ",err );
                            res.redirect("/usr_post");
                        });
                    });

                });
            });
        });
    } else res.send("no");
};
exports.get_cat = function(req, res){

    req.getConnection(function(err,connection){
        connection.query('SELECT post.*,user.username,user.avatar_pat AS iconouser,GROUP_CONCAT(DISTINCT tags.tag,"@",tags.idtag ORDER BY tags.tag) AS tagz, COUNT(DISTINCT megusta.iduser) as likes, GROUP_CONCAT(DISTINCT megusta.iduser) as laiktoken FROM' +
            ' post LEFT JOIN tagpost ON post.idpost = tagpost.idpost LEFT JOIN tags ON tagpost.idtag = tags.idtag INNER JOIN user ON user.iduser = post.iduser' +
            ' LEFT JOIN megusta ON megusta.idpost = post.idpost WHERE post.idpost IN (SELECT post.idpost FROM post LEFT JOIN tagpost ON tagpost.idpost = post.idpost LEFT JOIN tags ON tags.idtag = tagpost.idtag WHERE tags.idtag = ?) AND post.estado = 2 GROUP BY post.idpost ORDER BY post.fecha DESC LIMIT 6',req.params.id,function(err,rows)
        {
            if(err)
                console.log("Error Selecting : %s ",err );
            res.render('posts/cdd_index',{data:rows,usr:req.session.user, obs: req.session.idobs, stream: "getcat", helper: req.params.id});

            //console.log(query.sql);
        });
    });

};