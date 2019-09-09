// import JwtStrategies and ExtractJwt
const JwtStrategy = require('passport-jwt').Strategy,
ExtractJwt = require('passport-jwt').ExtractJwt

// import mongoose and its model
const mongoose = require('mongoose'),
User = mongoose.model('users')

// import secret keys
const keys = process.env.JWT_KEYS

const opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()
opts.secretOrKey = keys

module.exports = passport => {
    passport.use(
        new JwtStrategy(opts, async (jwt_payload, done) => {
            console.log(jwt_payload)
            try{
                const user = await User.findById(jwt_payload.id)
                if(user){
                    return done(null, user)
                }
                return done(null, false)

            }catch(err){
                console.log(err)
            }
        })
    )
}