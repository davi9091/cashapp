import { PassportStatic } from "passport";
import { IUserDoc, User } from "../models/user";
import { Strategy as LocalStrategy } from "passport-local";

export const initPassportUserStrategy = (passport: PassportStatic) => {
  passport.serializeUser((user: any, cb) => {
    return cb(null, user.id);
  });

  passport.deserializeUser(async (id, cb) => {
    try {
      const user = await User.findById(id);
      cb(null, user);
    } catch (error) {
      cb(error);
    }
  });

  passport.use(
    new LocalStrategy((username, password, cb) => {
      User.findOne({ username }, null, null, (error, user) => {
        if (error) return cb(error);
        if (!user) return cb(null, false, { message: "incorrect username" });

        user.comparePasswords(password, (error, match: boolean) => {
          if (error) return cb(error);
          if (!match) return cb(null, false, { message: "incorrect password" });

          return cb(null, user);
        });
      });
    })
  );
};
