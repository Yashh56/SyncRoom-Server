import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import userRoutes from "./User/user.routes.js";
import roomRoutes from "./Room/room.routes.js";
import chatsRoutes from "./Chats/chat.routes.js";
import materialsRoutes from "./Materials/materials.routes.js";
import { initWebSocketServer } from "./websocket/index.js";
import passportConfig from "./utils/passport.js";
import passport from "passport";
import session from "express-session";
import { isAuthenticated } from "./middlewares/auth.js";
import { RedisStore } from "connect-redis";
import redis from "./utils/redis.js";
import { mongo, sql } from "./utils/db.js";
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  "https://syncroom-zjox.onrender.com",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// app.options("*", cors()); // Handle preflight requests for all routes
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const isProd = process.env.NODE_ENV === "production";

app.use(
  session({
    name: "syncroom.sid",
    store: new RedisStore({ client: redis }),
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      maxAge: 5000 * 60 * 60 * 24,
    },
  })
);

passportConfig(passport);
app.use(passport.initialize());
app.use(passport.session());

app.use("/auth", userRoutes);
app.use("/room", roomRoutes);
app.use("/chat", chatsRoutes);
app.use("/materials", materialsRoutes);
app.use("/welcome", (req, res) => {
  res.send("Welcome to the SyncRoom API!");
});

app.get("/check", isAuthenticated, (req, res) => {
  console.log("User authenticated:", req.user);
  res.send("Server is running!", {
    user: req.user,
  });
});

const server = http.createServer(app);
const wss = initWebSocketServer();

app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
  "/auth/google/callback",
  (req, res, next) => {
    console.log("Google callback query:", req.query); // 👈 log the code/state
    next();
  },
  passport.authenticate("google", {
    successRedirect: "https://syncroom-zjox.onrender.com/",
    failureRedirect: "/login-failed", // Optional debug route
    failureMessage: true,
  })
);

async function startServer() {
  try {
    await redis.connect();
    sql.$connect().then(() => {
      console.log("Connected to the SQL database");
    });
    mongo.$connect().then(() => {
      console.log("Connected to the MongoDB database");
    });

    server.on("upgrade", (request, socket, head) => {
      // Handle token parsing in WebSocket connection later
      wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit("connection", ws, request);
      });
    });
    server.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error("Error starting server:", error);
  }
}

startServer();
