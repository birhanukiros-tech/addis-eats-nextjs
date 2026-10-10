
import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "node:crypto";
import bcrypt from "bcryptjs";
import { OAuth2Client } from "google-auth-library";

const COOKIE_NAME = "addis-eats-customer";
const SESSION_DURATION = 60 * 60 * 24 * 7;

const globalForAuth = globalThis;

globalForAuth.addisEatsDemoUsers ??= new Map();

const users = globalForAuth.addisEatsDemoUsers;

const googleClient = new OAuth2Client();

// Keep existing environment-configured customer and staff accounts.
function seedUser(username, passwordHash, role) {
  if (username && passwordHash && !users.has(username.toLowerCase())) {
    users.set(username.toLowerCase(), {
      username,
      passwordHash,
      role,
    });
  }
}

seedUser(
  process.env.ADDIS_EATS_CUSTOMER_USERNAME,
  process.env.ADDIS_EATS_CUSTOMER_PASSWORD_HASH,
  "customer"
);

seedUser(
  process.env.ADDIS_EATS_STAFF_USERNAME,
  process.env.ADDIS_EATS_STAFF_PASSWORD_HASH,
  "staff"
);

function getSessionSecret() {
  const secret = process.env.SESSION_SECRET;

  if (!secret || secret.length < 32) {
    throw new Error("SESSION_SECRET must be at least 32 characters.");
  }

  return secret;
}

function sign(payload) {
  return createHmac("sha256", getSessionSecret())
    .update(payload)
    .digest("base64url");
}

function createSessionToken(username) {
  const payload = Buffer.from(
    JSON.stringify({
      username,
      expiresAt: Date.now() + SESSION_DURATION * 1000,
    })
  ).toString("base64url");

  return `${payload}.${sign(payload)}`;
}

export function verifySessionToken(token) {
  if (!token || typeof token !== "string") return null;

  const parts = token.split(".");
  if (parts.length !== 2) return null;

  const [payload, signature] = parts;

  try {
    const expected = Buffer.from(sign(payload));
    const actual = Buffer.from(signature);

    if (
      expected.length !== actual.length ||
      !timingSafeEqual(expected, actual)
    ) {
      return null;
    }

    const session = JSON.parse(
      Buffer.from(payload, "base64url").toString("utf8")
    );

    const user = users.get(session.username?.toLowerCase());

    if (
      !user ||
      !Number.isFinite(session.expiresAt) ||
      session.expiresAt <= Date.now()
    ) {
      return null;
    }

    return {
      username: user.username,
      role: user.role,
      email: user.email,
      name: user.name,
    };
  } catch {
    return null;
  }
}

export async function getCurrentCustomer() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;

  return verifySessionToken(token);
}

async function createLoginSession(user) {
  const cookieStore = await cookies();

  cookieStore.set(
    COOKIE_NAME,
    createSessionToken(user.username),
    {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: SESSION_DURATION,
    }
  );

  return {
    success: true,
    username: user.username,
    role: user.role,
  };
}

export async function registerCustomer(name, email, password) {
  const normalizedEmail = email.trim().toLowerCase();

  if (!name.trim() || !normalizedEmail || !password) {
    return {
      success: false,
      error: "Please complete all fields.",
    };
  }

  if (password.length < 8) {
    return {
      success: false,
      error: "Password must be at least 8 characters.",
    };
  }

  if (users.has(normalizedEmail)) {
    return {
      success: false,
      error: "An account with this email already exists.",
    };
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = {
    username: normalizedEmail,
    email: normalizedEmail,
    name: name.trim(),
    passwordHash,
    role: "customer",
  };

  users.set(normalizedEmail, user);

  return createLoginSession(user);
}

export async function loginCustomer(username, password) {
  const key = username.trim().toLowerCase();
  const user = users.get(key);

  if (!user || !user.passwordHash) {
    return {
      success: false,
      error: "Invalid username/email or password.",
    };
  }

  const passwordMatches = await bcrypt.compare(
    password,
    user.passwordHash
  );

  if (!passwordMatches) {
    return {
      success: false,
      error: "Invalid username/email or password.",
    };
  }

  return createLoginSession(user);
}


export async function googleSignIn(idToken) {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  if (!clientId || !idToken) {
    return {
      success: false,
      error: "Google sign-in is not configured.",
    };
  }

  try {
    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: clientId,
    });

    const payload = ticket.getPayload();

    if (!payload?.email || payload.email_verified !== true) {
      return {
        success: false,
        error: "Google could not verify your email address.",
      };
    }

    const email = payload.email.toLowerCase();
    let user = users.get(email);

    if (user?.role === "staff") {
      return {
        success: false,
        error: "Please use the staff sign-in page.",
      };
    }

    if (!user) {
      user = {
        username: email,
        email,
        name: payload.name || email,
        passwordHash: null,
        role: "customer",
        provider: "google",
      };

      users.set(email, user);
    } else {
      user.email = email;
      user.name = user.name || payload.name || email;
    }

    return createLoginSession(user);
  } catch {
    return {
      success: false,
      error: "Google sign-in failed. Please try again.",
    };
  }
}


export async function logoutCustomer() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}
