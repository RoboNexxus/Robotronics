// Sequential IDs like RN-001, RN-002 based on total registrations across ALL events
function generateRegId(count) {
  return `RN-${String(count + 1).padStart(3, "0")}`;
}

module.exports = { generateRegId };
