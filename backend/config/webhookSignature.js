const crypto = require("crypto");

exports.verifySignature = (payload, signature, secret) => {
  const hash = crypto
    .createHmac("sha256", secret)
    .update(JSON.stringify(payload))
    .digest("hex");

  return hash === signature;
};
