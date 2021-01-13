const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const FacebookStrategy = require('passport-facebook').Strategy
const bcrypt = require('bcryptjs')

const User = require('../models/user')

module.exports = (app) => {
  //initialize passport and assign session to app
  app.use(passport.initialize())
  app.use(passport.session())

  passport.use(new LocalStrategy({ usernameField: 'email' },
    async (email, password, done) => {
      try {
        const user = await User.findOne({ email })
        if (!user) {
          return done(null, false, { message: '這個信箱還沒被註冊！' })
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
          return done(null, false, { message: '信箱或是密碼錯誤。' })
        }
        return done(null, user)
      } catch (err) {
        return done(err)
      }
    })
  )

  passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_ID,
    clientSecret: process.env.FACEBOOK_SECRET,
    callbackURL: process.env.FACEBOOK_CALLBACK,
    profileFields: ['email', 'displayName']
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      const { name, email } = profile._json
      const user = await User.findOne({ email })
      if (user) return done(null, user)

      const randomPassword = Math.random().toString(36).slice(-8)
      const salt = await bcrypt.genSalt(10)
      const hash = await bcrypt.hash(randomPassword, salt)
      const newUser = await User.create({
        name,
        email,
        password: hash
      })
      return done(null, newUser)
    } catch (err) {
      done(err)
    }

  }

  ))


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