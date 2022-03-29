import { Router } from "express";
import { v4 as uuidv4 } from "uuid";
import { User } from "../models/user";
import HttpStatusCode from "http-status-codes";
import { generateCookie } from "../helpers/helpers";
import passport from "passport";

export const userRouter = Router();
import { initPassportUserStrategy } from "../passport-strategies/user";
initPassportUserStrategy(passport);

userRouter.post("/user/register", async (req, res) => {
  const username = req.body.username;

  const { key, name, params } = generateCookie(username);
  res.cookie(name, key, params);

  const user = new User({
    ...req.body,
    username,
    token: key,
  });

  try {
    const savedUser = await user.save();
    res.send(savedUser.toJSON());
  } catch (error) {
    console.error(error);
    res.status(HttpStatusCode.BAD_REQUEST);
    res.send(error);
  }
});

userRouter.post("/user/login", passport.authenticate("local"), (req, res) => {
  console.log(req.user);
  const user = req.user;
  if (!user)
    return res.status(HttpStatusCode.NOT_FOUND).send({ error: "no such user" });
    
  req.login(user, (error) => {
    if (error) return res.status(HttpStatusCode.UNAUTHORIZED).send({error: 'wrong password'});

    return res.status(HttpStatusCode.OK).send(user);
  })
  
});

// userRouter.post("/user/login", async (req, res) => {
//   console.log("got a request", req.body);
//   try {
//     const user = await User.findOne({
//       username: req.body.username,
//     });
//
//     if (!!user) {
//       user.comparePasswords(req.body.password, (err: any, match: boolean) => {
//         console.log(user, req.body, err);
//
//         if (err) throw err;
//
//         if (match) {
//           if (!req.cookies.cookieName) {
//             const cookie = generateCookie(user.get("username"));
//             res.cookie(cookie.name, cookie.key, cookie.params);
//             console.log(cookie);
//           }
//
//           res.send(user);
//         } else {
//           res.status(HttpStatusCode.UNAUTHORIZED);
//           res.send("wrong password");
//         }
//       });
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(HttpStatusCode.BAD_REQUEST);
//     res.send(error);
//   }
// });
