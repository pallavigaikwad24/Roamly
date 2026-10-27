const { Strategy } = require("passport-local");
const CustomeStrategy = require("passport-custom").Strategy;
const { Op } = require("sequelize");
const getModelInfo = require("../services/getModelInfo");
const { validErrorMessage } = require("../services/staticMessage");
const bcrypt = require("bcrypt");

const initializationPassport = (passport) => {
    passport.use(
        new Strategy(async (username, password, done) => {
            try {
                const params = parseInt(username) ? { phone_number: username } : { email: username };
                const argument = { modelName: 'User', methodType: "findOne", args: { where: [params] } };
                const user = await getModelInfo(argument);
                if (!user)
                    return done(null, false, { message: validErrorMessage("Phone Number or Email ID") });

                const isValidPass = bcrypt.compareSync(password, user.password);

                if (!isValidPass)
                    return done(null, false, { message: validErrorMessage("Password") });

                return done(null, user);
            } catch (error) {
                console.log(error)
                return done(error, false);
            }
        })
    );

    passport.use('otpLogin', new CustomeStrategy(async (req, done) => {
        try {
            const username = req.params.email;
            const argument = { modelName: 'User', methodType: "findOne", args: { where: { email: username } } }
            const user = await getModelInfo(argument);
            if (!user)
                return done(null, false, { message: validErrorMessage("Email ID") });

            return done(null, user);
        } catch (error) {
            console.log(error)
            return done(error, false);
        }
    })
    );

    passport.serializeUser(function (user, done) {
        try {
            done(null, user.id);
        } catch (error) {
            console.log(error);
            done(error, null);
        }
    });

    passport.deserializeUser(async function (id, done) {
        try {
            const arguments = {
                modelName: 'User',
                methodType: 'findOne',
                args: { where: { id: Number(id) } }
            }
            const user = await getModelInfo(arguments);
            done(null, user);
        } catch (error) {
            console.error("Error during deserialization:", error);
            done(error, null);
        }
    });
}

module.exports = { initializationPassport };