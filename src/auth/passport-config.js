import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcrypt";

export default function (foccacia) {
    passport.use(new LocalStrategy(async (username, password, done) => {
        try {
            const user = await foccacia.getUserByUsername(username);
            if (!user)
                return done(null, false, { message: "Incorrect username" });

            if (!await bcrypt.compare(password, user.password))
                return done(null, false, { message: "Incorrect password" });
            
            return done(null, user);
        }
        catch (e) {
            return done(e);
        }
    }));

    passport.serializeUser((user, done) => done(null, user));
    passport.deserializeUser((id, done) => done(null, id));
}