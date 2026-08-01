import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import process from "node:process";
import { test } from "node:test";

test("loads configuration without database credentials by default", () => {
  const result = spawnSync(
    process.execPath,
    [
      "--input-type=module",
      "--eval",
      'import("./dist/core/config/env.js").then(({ env }) => console.log(env.DATABASE_ENABLED))',
    ],
    {
      cwd: process.cwd(),
      encoding: "utf8",
      env: {
        PATH: process.env.PATH,
        DISCORD_TOKEN: "test-token",
        CLIENT_ID: "12345678901234567",
      },
    }
  );

  assert.equal(result.status, 0, result.stderr);
  assert.equal(result.stdout.trim(), "false");
});
