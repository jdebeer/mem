
const reviews = require('./.reviews.json');
const memoryUnits = require('./.memoryUnits.json');

const config = {
  // 0.4% per second
  initialMemoryDecayRate: 0.004
};




module.exports = MemoryStore;
