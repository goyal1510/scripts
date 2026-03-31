import { supabase } from "../../../../lib/supabase-client.js";
import { createLogger } from "../../../../lib/logger.js";

const logger = createLogger(import.meta.url, "list-users");

// Fetch all auth users with pagination
const users = [];
let page = 1;
const perPage = 1000;

while (true) {
  const { data: { users: batch }, error } = await supabase.auth.admin.listUsers({ page, perPage });
  if (error) {
    console.error("Failed to list users:", error.message);
    process.exit(1);
  }
  users.push(...batch);
  if (batch.length < perPage) break;
  page++;
}

// Fetch all profiles with pagination (Supabase default limit is 1000)
const profiles = [];
let from = 0;
const batchSize = 1000;

while (true) {
  const { data: batch, error } = await supabase
    .schema("jg_account")
    .from("profiles")
    .select("*")
    .range(from, from + batchSize - 1);

  if (error) {
    console.error("Failed to fetch profiles:", error.message);
    process.exit(1);
  }
  profiles.push(...batch);
  if (batch.length < batchSize) break;
  from += batchSize;
}

const profilesByUserId = new Map(profiles.map((p) => [p.user_id, p]));

console.log(`\nFound ${users.length} user(s):\n`);

for (const user of users) {
  const profile = profilesByUserId.get(user.id);

  console.log(`--- ${user.email || user.id} ---`);
  console.log(`  ID:         ${user.id}`);
  console.log(`  Email:      ${user.email ?? "N/A"}`);
  console.log(`  Created:    ${user.created_at}`);

  if (profile) {
    console.log(`  First Name: ${profile.first_name || "(empty)"}`);
    console.log(`  Last Name:  ${profile.last_name || "(empty)"}`);
    console.log(`  Role:       ${profile.role}`);
    console.log(`  Avatar:     ${profile.avatar_url || "(none)"}`);
    console.log(`  Terms:      ${profile.terms_accepted ? `Yes (${profile.terms_accepted_at})` : "No"}`);
  } else {
    console.log(`  Profile:    ⚠ DOES NOT EXIST`);
  }

  console.log();
}

logger.close();
