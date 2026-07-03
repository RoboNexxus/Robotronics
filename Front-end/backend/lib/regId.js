function generateRegId(count) {
  return `RN-${String(count + 1).padStart(3, "0")}`;
}

module.exports = { generateRegId };
