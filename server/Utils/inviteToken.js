import crypto from "crypto";

export function createInviteToken({ expiresAt = null, maxUses = Infinity }) {
  const token = crypto.randomBytes(16).toString("hex");

  return {
    token,
    expiresAt: expiresAt ? new Date(expiresAt) : null, // ensure it's a Date
    maxUses,
    uses: 0,
  };
}
