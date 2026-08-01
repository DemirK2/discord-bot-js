import assert from "node:assert/strict";
import { beforeEach, test } from "node:test";
import {
  clearCooldowns,
  getCooldownRemaining,
} from "../dist/core/managers/cooldownManager.js";

beforeEach(() => clearCooldowns());

test("allows the first command use", () => {
  assert.equal(getCooldownRemaining("user-1", "ping", 10), 0);
});

test("blocks a repeated command during its cooldown", () => {
  getCooldownRemaining("user-1", "ping", 10);
  assert.equal(getCooldownRemaining("user-1", "ping", 10), 10);
});

test("tracks commands and users independently", () => {
  getCooldownRemaining("user-1", "ping", 10);

  assert.equal(getCooldownRemaining("user-1", "help", 10), 0);
  assert.equal(getCooldownRemaining("user-2", "ping", 10), 0);
});
