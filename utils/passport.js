import LocalStrategy from "passport-local";
import { sql } from "./db.js";
import bcrypt from "bcrypt";
import GoogleStrategy from "passport-google-oauth20";

export default function (passport) {
  passport.use(
    new LocalStrategy(
      { usernameField: "email" },
      async (email, password, done) => {
        try {
          const user = await sql.user.findUnique({
            where: {
              email: email,
            },
          });
          if (!user) {
            return done(null, false, { message: "No user with that email" });
          }
          const isMatch = await bcrypt.compare(password, user.password);
          if (isMatch) {
            return done(null, user);
          }
        } catch (error) {
          done(err);
        }
      }
    )
  );
  passport.use(
    new GoogleStrategy.Strategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:5000/auth/google/callback",
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          let user = await sql.user.findUnique({
            where: {
              googleId: profile.id,
            },
          });
          if (!user) {
            user = await sql.user.create({
              data: {
                name: profile.displayName,
                email: profile.emails[0].value || "",
                image: profile.photos[0].value || "",
                googleId: profile.id,
                password: "",
              },
            });
          }
          return done(null, user);
        } catch (error) {
          return done(error, null);
        }
      }
    )
  );

  passport.serializeUser((user, done) => done(null, user.id));

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await sql.user.findUnique({
        where: {
          id,
        },
      });
      if (!user) return done(null, false);
      return done(null, user);
    } catch (error) {
      done(error, null);
    }
  });
}
