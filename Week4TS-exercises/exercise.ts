// Task: parseUserConfig (TypeScript + runtime validation) 

// Goal: Implement a function that takes a JSON string and returns either a valid User object or a friendly error.

// Starter types (do not change)
type Role = "intern" | "mentor" | "admin";

export type User = {
  id: string;
  email: string;
  role: Role;
};

export type Result<T> =
  | { ok: true; value: T }
  | { ok: false; error: string };

// [1] Implement
export function parseUserConfig(input: string): Result<User> {
  try {
    const obj = JSON.parse(input);

    if (typeof obj !== 'object' || obj === null) {
      return { ok: false, error: "Invalid User shape" };
    }

    const { id, email, role } = obj;

    if (typeof id !== 'string') {
      return { ok: false, error: "Invalid User shape" };
    }

    if (typeof email !== 'string') {
      return { ok: false, error: "Invalid User shape" };
    }

    if (role !== 'intern' && role !== 'mentor' && role !== 'admin') {
      return { ok: false, error: "Invalid User shape" };
    }

    const user: User = { id, email, role };
    return { ok: true, value: user };

  } catch {
    return { ok: false, error: "Invalid JSON" };
  }
}
// It must:
// 1. Return { ok:false, error: "Invalid JSON" } if the string is not valid JSON
// 2. Return { ok:false, error: "Invalid User shape" } if if JSON is valid but not a valid User
// 3. Return { ok:true, value: user } if everything is valid

// Rules:
// Don’t use any
// Don’t use as User / as any to force the type
// The result must be correct based on runtime checks

// Sample input (for testing)
const inputs = [
  `{"id":"u1","email":"a@b.com","role":"intern"}`, // ok
  `{"id":"u2","email":"a@b.com","role":"boss"}`,   // shape error
  `{"id":123,"email":"a@b.com","role":"intern"}`,  // shape error
];

for (const input of inputs) {
  console.log(`Example 1`);
  console.log(parseUserConfig(input));
}
  
// [2] Parse list of users
// Implement
export function parseUsersConfig(input: string): Result<User[]> {
  try {
    const arr = JSON.parse(input);

    if (!Array.isArray(arr)) {
      return { ok: false, error: "Invalid Users shape" };
    }

    const users: User[] = [];

    for (const item of arr) {
      const result = parseUserConfig(JSON.stringify(item));
      if (!result.ok) {
        return { ok: false, error: "Invalid Users shape" };
      }
      users.push(result.value);
    }

    return { ok: true, value: users };

  } catch {
    return { ok: false, error: "Invalid JSON" };
  }
}

console.log(`Example 2`);
console.log(parseUsersConfig(` [ 
  {"id":"u1","email":"a@b.com","role":"intern"}, 
  {"id":"u3","email":"x@y.com","role":"mentor"}
  ] `));

// Rules:
// JSON must be an array
// Every element must be a valid User
// If JSON is invalid -> "Invalid JSON"
// If JSON is valid but not an array or any element is invalid -> "Invalid Users shape"

// [3] Better error messages (advanced)
// Improve errors so they are more specific than "Invalid User shape".
// Examples:
// "Missing field: id"
// "Invalid type for id (expected string)"
// "Invalid role (expected intern|mentor|admin)"

// What to submit:
// * exercise.ts with your implementations
// * A short console.log demo that shows outputs for the sample inputs
