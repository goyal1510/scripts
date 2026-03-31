import { supabase } from "../../../../lib/supabase-client.js";
import { createLogger } from "../../../../lib/logger.js";

const args = process.argv.slice(2);

function getFlag(...names) {
  for (const name of names) {
    const arg = args.find((a) => a.startsWith(`-${name}=`) || a.startsWith(`--${name}=`));
    if (arg) return arg.split("=").slice(1).join("=");
  }
  return undefined;
}

let userId = getFlag("id", "user-id");
const lookupEmail = getFlag("le", "lookup-email");

const logger = createLogger(import.meta.url, `update-user_${lookupEmail || userId || "unknown"}`);

if (!userId && !lookupEmail) {
  console.error(
    "Usage: node scripts/personal/users/update/index.js -id=<uuid> | -le=<email> -e=<email> -p=<password> -fn=<first> -ln=<last> -r=<role> -av=<avatar-url>"
  );
  process.exit(1);
}

// Resolve email to user ID
if (!userId) {
  let match;
  let page = 1;
  const perPage = 50;

  while (!match) {
    const { data: { users }, error } = await supabase.auth.admin.listUsers({ page, perPage });
    if (error) {
      console.error("Failed to list users:", error.message);
      process.exit(1);
    }
    match = users.find((u) => u.email === lookupEmail);
    if (match || users.length < perPage) break;
    page++;
  }

  if (!match) {
    console.error(`No user found with email: ${lookupEmail}`);
    process.exit(1);
  }
  userId = match.id;
  console.log(`Resolved ${lookupEmail} → ${userId}`);
}

const email = getFlag("e", "email");
const password = getFlag("p", "password");
const firstName = getFlag("fn", "first-name");
const lastName = getFlag("ln", "last-name");
const role = getFlag("r", "role");
const avatarUrl = getFlag("av", "avatar-url");

// Update auth user (email / password)
const authUpdates = {};
if (email) authUpdates.email = email;
if (password) authUpdates.password = password;

if (Object.keys(authUpdates).length > 0) {
  const { error: authError } = await supabase.auth.admin.updateUserById(userId, authUpdates);
  if (authError) {
    console.error("Failed to update auth user:", authError.message);
    process.exit(1);
  }
  console.log("Auth user updated:", Object.keys(authUpdates).join(", "));
}

// Update profile
const profileUpdates = {};
if (firstName !== undefined) profileUpdates.first_name = firstName;
if (lastName !== undefined) profileUpdates.last_name = lastName;
if (role !== undefined) profileUpdates.role = role;
if (avatarUrl !== undefined) profileUpdates.avatar_url = avatarUrl;

if (Object.keys(profileUpdates).length > 0) {
  const { error: profileError } = await supabase
    .schema("jg_account")
    .from("profiles")
    .update(profileUpdates)
    .eq("user_id", userId);

  if (profileError) {
    console.error("Failed to update profile:", profileError.message);
    process.exit(1);
  }
  console.log("Profile updated:", Object.keys(profileUpdates).join(", "));
}

if (Object.keys(authUpdates).length === 0 && Object.keys(profileUpdates).length === 0) {
  console.log("Nothing to update. Pass -e, -p, -fn, -ln, -r, or -av.");
}

logger.close();
