const userSession = (req, res, next) => {
    if (req.session.userid && req.session.account_type === 'user') {
      next();
    } else {
      res.redirect('/user/login');
    }
  };
  
  const adminSession = (req, res, next) => {
    if (req.session.userid && req.session.account_type === 'admin') {
      next();
    } else {
      res.redirect('/admin/login');
    }
  };
  
  module.exports = {
    userSession,
    adminSession,
  };