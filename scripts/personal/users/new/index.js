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

const email = getFlag("e", "email");
const password = getFlag("p", "password");
const firstName = getFlag("fn", "first-name") ?? "";
const lastName = getFlag("ln", "last-name") ?? "";
const role = getFlag("r", "role") ?? "user";

const logger = createLogger(import.meta.url, `new-user_${email || "unknown"}`);

if (!email || !password) {
  console.error("Usage: node scripts/personal/users/new/index.js -e=<email> -p=<password> -fn=<first> -ln=<last> -r=<role>");
  process.exit(1);
}

// Create auth user
const { data: { user }, error: authError } = await supabase.auth.admin.createUser({
  email,
  password,
  email_confirm: true,
});

if (authError) {
  console.error("Failed to create user:", authError.message);
  process.exit(1);
}

console.log(`Auth user created: ${user.id} (${user.email})`);

// Create profile
const { error: profileError } = await supabase
  .schema("jg_account")
  .from("profiles")
  .insert({
    user_id: user.id,
    first_name: firstName,
    last_name: lastName,
    role,
  });

if (profileError) {
  console.error("User created but profile insert failed:", profileError.message);
  process.exit(1);
}

console.log(`Profile created: ${firstName} ${lastName} (role: ${role})`);

logger.close();
