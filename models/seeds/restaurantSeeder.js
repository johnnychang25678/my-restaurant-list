const bcrypt = require('bcryptjs')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const db = require('../../config/mongoose')
const Restaurant = require('../restaurant')
const User = require('../user')

const SEED_DATA = require('./restaurant.json')

const SEED_USER = {
  userOne: {
    email: 'user1@example.com',
    password: '12345678'
  },
  userTwo: {
    email: 'user2@example.com',
    password: '12345678'
  }
}

const createUser = async (email, password) => {
  const user = await User.findOne({ email })
  if (user) return user

  const salt = await bcrypt.genSalt(10)
  const hash = await bcrypt.hash(password, salt)
  const newUser = await User.create({
    email,
    password: hash
  })
  console.log(newUser._id)
  return newUser
}

// write seed data to mongodb
db.once('open', async () => {
  const restaurantList = SEED_DATA.results
  // create user one
  const userOne = await createUser(SEED_USER.userOne.email, SEED_USER.userOne.password)
  await Promise.all(Array.from({ length: 3 },
    (_, i) => Restaurant.create({
      ...restaurantList[i], userId: userOne._id
    }))
  )
  const userTwo = await createUser(SEED_USER.userTwo.email, SEED_USER.userTwo.password)
  await Promise.all(Array.from({ length: 3 },
    (_, i) => Restaurant.create({
      ...restaurantList[i + 3], userId: userTwo._id
    }))
  )

  console.log('seed data created in mongodb')
  process.exit()
})


