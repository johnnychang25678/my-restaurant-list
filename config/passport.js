const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcryptjs')

const User = require('../models/user')

module.exports = (app) => {
  //initialize passport and assign session to app
  app.use(passport.initialize())
  app.use(passport.session())

  passport.use(new LocalStrategy({ usernameField: 'email' },
    async (email, password, done) => {
      try {
        if (!email || !password) {
          return done(null, false, { message: '請輸入信箱及密碼。' })
        }
        const user = await User.findOne({ email })
        if (!user) {
          return done(null, false, { message: '這個信箱還沒被註冊！' })
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
          return done(null, false, { message: '信箱或是密碼錯誤。' })
        }
        console.log('successful login!')
        return done(null, user)
      } catch (err) {
        return done(err)
      }
    })
  )

  passport.serializeUser((user, done) => {
    done(null, user.id)
  })
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id).lean()
      done(null, user)
    } catch (err) {
      done(err)
    }
  })
}