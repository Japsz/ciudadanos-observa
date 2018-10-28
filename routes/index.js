exports.index = function(req, res){
  if(req.session.isUserLogged){
    res.redirect('/indx');
  } else if (req.session.isAdminLogged){
    res.redirect('/instit');
  } else
  res.render('index', { title: 'Call Service' });
};