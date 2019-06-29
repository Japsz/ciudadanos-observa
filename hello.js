var express = require('express');
var routes = require('./routes/index');
var http = require('http');
var proxy = require('http-proxy').createProxyServer({});
var path = require('path');

var app = express(), mailer = require("express-mailer");
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var cookieSession = require('cookie-session');
var bodyParser = require('body-parser');
var formidable =require('formidable');

var users = require('./routes/users');
var observ = require('./routes/observatorio');
var event = require('./routes/eventos');
var cdd = require('./routes/ciudadano');
var monitor = require('./routes/monitor');
var posts = require('./routes/posts');
var admin = require('./routes/admin');

mailer.extend(app, {
    from: 'no-reply@example.com',
    host: 'smtp.gmail.com', // hostname
    secureConnection: true, // use SSL
    port: 465, // port for secure SMTP
    transportMethod: 'SMTP', // default is SMTP. Accepts anything that nodemailer accepts
    auth: {
        user: 'observaciudadania17@gmail.com',
        pass: 'proyectaobserva'
    }
});

// view engine setup
app.set('port', process.env.PORT || 8080);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser("usuarios"));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieSession({
    name: 'session',
    keys: ['usuarios']
}));

var connection  = require('express-myconnection');
var mysql = require('mysql');

var expressFU = require('express-fileupload');

app.use(expressFU({
    preserveExtension: true,
    safeFileNames: true
}));

app.use(

    connection(mysql,{

        host: '127.0.0.1',
        user: 'root',
        password : 'observaproyecta',
        port : 3306,
        database:'Observapp'

    },'pool')

);

app.get('/', routes.index);

//Observatorios e Instituciones

app.get('/instit', observ.list);
app.post('/instit_edit', observ.inst_edit);
app.get('/add_inst', observ.add_inst);
app.post('/inst/add', observ.save);
app.get('/obs/:id', observ.obs_list);
app.get('/show_obs/:idobs', observ.admin_obs);
app.post('/obs/add', observ.obs_save);
app.post("/csv_cdd",admin.g_csv_cdd);
app.post("/csv_proy",admin.g_csv_proy);

// Eventos

app.get('/event', event.list);
app.get('/add_event', event.add_evnt);
app.post('/edit_event', event.edit_event);
app.post('/evnt/add', event.save_event);
app.get('/evnt/:id', event.obs_list);
app.post('/obs_stream', event.obstream);
app.post('/addto_evnt', event.addto_evnt);

// Monitor y Moderador

app.get('/obs_monit', monitor.obs_monit);
app.get('/obs_usr/:idobs', monitor.get_obs);
app.post('/add_cdd', monitor.save_cdd);
app.post('/drop_cdd', monitor.drop_cdd);
app.post('/approve', monitor.approve_p);
app.post('/rmm', monitor.remove_p);
app.get('/app_post/:idobs', monitor.get_prepost);
app.get('/mod_indx', monitor.get_modpost);
app.post('/rmm_comm', monitor.del_comment);
app.post('/approve_comm', monitor.approve_comment);
app.post('/upd_medal', monitor.upd_medal);

//Ciudadano

app.post('/m_post', cdd.m_post);
app.post('/cdd/edit', cdd.save_edit);
app.get('/cdd_edit',cdd.edit);
app.get('/cdd_cedit',cdd.commitedit);
app.get('/f_login/:idobs/:iduser',cdd.edit_f);
app.post('/cdd/edit_f', cdd.save_edit_f);
app.post('/comment/add_s', cdd.save_comment_single);
app.post('/comment/add', cdd.save_comment);
app.post('/check_usr',cdd.check_usr);

//Posts

app.get('/indx', posts.indx);
app.post('/b_fecha', posts.b_fecha);
app.get('/post/:idpost', posts.getpost);
app.post('/post/add', posts.save);
app.post('/pstcomment_stream',posts.getcomments);
app.post('/post_stream', posts.indx_stream);
app.get('/delete_pst/:idpost', posts.rm_post);
app.post('/tags/bsq',posts.b_tag);
app.get('/tagbsq/:id',posts.get_cat);
app.post('/send_laik',cdd.add_laik);
app.get('/usr_post',posts.usr_post);
app.get('/post_obs',posts.post_obs);
app.post('/post/edit/:idpost', posts.p_edit);

// Proyectos

app.get('/mod_proys',admin.modproy);
app.post('/mod',admin.moderate_p);

// Admin

app.get('/user', admin.list);
app.get('/user_cdd', admin.user_cdd);
app.post('/user_cdd/list', admin.cdd_list);
app.post('/change_cdd', admin.change_obs);
app.get('/user/add', admin.add);
app.post('/user/add', admin.save);
app.post('/admin_add_cdd', admin.save_cdd);
app.get('/send_recovery_mail/:correo', users.send_mail);
app.get('/reset_pass/:recovery', users.reset_pass);
app.get('/user/delete/:iduser', admin.delete_user);
app.get('/user/edit/:username', admin.edit);
app.post('/user/edit/:username',admin.save_edit);

//Users

app.post('/validate_recovery', users.validate_recovery);
app.post('/monit_stream', users.get_monit);
app.post('/obsmonit_stream', users.get_obsmonit);
app.post('/obsmonit_add', users.add_obsmonit);
app.post('/obsmonit_del', users.del_obsmonit);
app.get('/obs_archive/:id', observ.obs_archive);
app.get('/admin_logout', users.admin_logout);
app.get('/user_logout', users.user_logout);
app.get('/user_login', users.user_login);
app.get('/admin_login', users.admin_login);
app.get('/bad_login', users.bad_login);
app.post('/admin_login_handler', users.admin_login_handler);
app.post('/user_login_handler', users.user_login_handler);

app.use('/lab',function(req,res){
    proxy.web(req, res, {
        target: 'http://127.0.0.1:8081'
    });
});
// stats ajax
app.get('/get_stats', function(req,res){
    req.getConnection(function(err,connection){
        connection.query("SELECT COUNT(*) AS user_count FROM user WHERE tipo = 3", function(err,user_count){
            if(err) throw err;
            connection.query("SELECT COUNT(*) AS institucion_count FROM institucion",function(err,institucion_count){
                if(err) throw err;
                connection.query("SELECT COUNT(*) AS comentarios_count FROM comentario",function(err,comentarios_count){
                    if(err) throw err;
                    connection.query("SELECT COUNT(*) AS post_count FROM post",function(err,post_count){
                        if(err) throw err;
                        connection.query("SELECT COUNT(*) FROM post", function(err, inst3){
                            if(err) throw err;
                            var datas = [
                                user_count[0]["user_count"],
                                institucion_count[0]["institucion_count"],
                                comentarios_count[0]["comentarios_count"],
                                post_count[0]["post_count"]
                                ]
                            console.log(user_count);
                            res.send(datas);
                        });
                    });
                });
            });
        });
    });
});

app.post('/subir_pic', function (req,res) {
    var f_gen = new Date();
    var newname = "user" + req.session.user.iduser.toString() + "-" + f_gen.getTime() + ".jpg";
    console.log(req.files);
    var newpath = './public/web-img/' + newname;
    req.files.filetoupload.mv(newpath);
    res.send("/web-img/" + newname);
});
app.post('/subir_file', function (req,res) {
    var f_gen = new Date();
    var newname = "user" + req.session.user.iduser.toString() + "-" + f_gen.getTime() + ".jpg";
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        if (err){
            console.log(err);
            res.send({err:true,errMsg:err});
        } else {
            console.log(files['file-0']);
            var oldpath = files['file-0'].path;
            var newpath = './public/web-img/wena-' + newname;
            fs.rename(oldpath, newpath, function (err) {
                if (err){
                    console.log(err);
                    res.send({err:true,errMsg:err});
                } else {
                    res.send({err:false,savedpath:"/web-img/" + newname});
                }
            });
        }
    });
});
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('bad_login');
});

var server  = http.createServer(app);

server.listen(app.get('port'), function(){
    console.log('The game starts on port ' + app.get('port'));
});

const io = require('socket.io')(server);
