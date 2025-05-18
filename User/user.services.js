import { mongo, sql } from "../utils/db.js";
import bcrypt from "bcrypt";
import { generateToken, verifyToken } from "../utils/jwt.js";

export async function createUser(name, email, password) {
  const existingUser = await sql.user.findUnique({
    where: {
      email: email,
    },
  });

  if (existingUser) {
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await sql.user.create({
    data: {
      name: name,
      email: email,
      password: hashedPassword,
    },
  });

  const token = generateToken({ id: user.id, email: user.email });
  return {
    user,
    token,
  };
}

export async function loginUser(email, password) {
  const user = await sql.user.findUnique({
    where: {
      email: email,
    },
  });

  if (!user) {
    throw new Error("Invalid email or password");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error("Invalid email or password");
  }

  const token = generateToken({ id: user.id, email: user.email });
  return {
    user,
    token,
  };
}

export async function currentUser(authHeader) {
  if (!authHeader) {
    throw new Error("No token provided");
  }
  const token = authHeader.split(" ")[1];

  const payload = verifyToken(token);
  const user = await sql.user.findUnique({
    where: {
      id: payload.id,
    },
    include:{
      rooms:true,
    }
  });
  if (!user) {
    throw new Error("User not found");
  }
  console.log(user);
  return user;
}
