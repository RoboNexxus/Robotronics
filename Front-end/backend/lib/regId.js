const CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no 0/O/1/I

function generateRegId() {
  let code = "";
  for (let i = 0; i < 5; i++) code += CHARS[Math.floor(Math.random() * CHARS.length)];
  return `RN26-${code}`;
}

module.exports = { generateRegId };
