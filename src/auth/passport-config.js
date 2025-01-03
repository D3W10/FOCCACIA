import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";

export default function (service) {
    passport.use(new LocalStrategy(async (username, password, done) => {
        try {
            const user = await service.login(username, password);
            return done(null, user);
        }
        catch (e) {
            return done(null, false);
        }
    }));

    passport.serializeUser((user, done) => done(null, user));
    passport.deserializeUser((user, done) => done(null, user));
}