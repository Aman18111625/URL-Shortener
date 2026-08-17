const User = require('../models/user')

console.log('User-->', User);

async function handleUserSignUp(req, res) {
   const {name, email, password} = req.body;
   await User.create({
     name,
     email,
     password
   })
   return res.send('homes')
}

module.exports = {
    handleUserSignUp
}