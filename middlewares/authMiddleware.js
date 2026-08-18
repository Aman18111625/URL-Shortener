const { getUser } = require("../service/auth");

async function restrictToLoggedInUserOnly(req, res, next) {
  const userId = req.cookies?.uuid;

  if (!userId) {
    return res.redirect("/login");
  }

  try {
    const user = getUser(userId);
    if (!user) {
      return res.redirect("/login");
    }
    req.user = user;
  } catch (error) {
    return res.redirect("/login");
  }
  next();
}

async function checkAuth(req, res, next) {
  const userId = req.cookies?.uuid;
  if(!userId) {
    req.user = null;
    return next();
  }
  try {
    const user = getUser(userId);
    req.user = user;
  } catch (error) {
    req.user = null;
  }
  next();
}

module.exports = {
  restrictToLoggedInUserOnly,
  checkAuth,
};
