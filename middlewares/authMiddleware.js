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

function restrictTo(roles) {
  return async (req, res, next) => {
    if (!req.user) {
      return res.redirect("/login");
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: "Forbidden - Access denied" });
    }
    next();
  };
}

module.exports = {
  restrictToLoggedInUserOnly,
  restrictTo,
};
