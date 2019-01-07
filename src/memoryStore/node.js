const Activation = require('./activation');

class MemoryNode {
  constructor({ activations = [], unitId, type, value, represents }, config) {

    this.retentionThreshold = 0.95; // A+

    this.represents = represents;
    this.value = value;
    this.type = type;
    this.unitId = unitId;

    this.initialDecayPerSecond = config.initialMemoryDecayRate;
    this.activations = activations.map(activation => {
      return new Activation(activation);
    })
  }
  pimsTimeInterval(intervalNumber) {
    // https://en.wikipedia.org/wiki/Spaced_repetition
    const intervals = {
      0: 5, // 5 seconds
      1: 25, // 25 seconds
      2: 120, // 2 minutes
      3: 600, // 10 minutes
      4: 3600, // 1 hour
      5: 18000, // 5 hours
      6: 86400, // 1 day
      7: 432000, // 5 days
      8: 2160000, // 25 days
      9: 10368000, // 4 months
      10: 63072000 // 2 years
    };
    if (intervalNumber > 10) {
      return intervals[10];
    }
    return intervals[intervalNumber];
  }
  pimsStabilityInterval(intervalNumber) {
    let interval;
    if (intervalNumber === 0) {
      interval = this.pimsTimeInterval(0);
    }
    else {
      interval = this.pimsTimeInterval(intervalNumber) - this.pimsTimeInterval(intervalNumber-1)
    }
    return -interval/Math.log(this.retentionThreshold);
  }
  newActivation(activation) {
    this.activations.push(new Activation(activation));
  }
  stability(activationIndex) {

    if (typeof activationIndex === undefined) {
      activationIndex = this.activations.length - 1;
    }
    if (activationIndex > this.activations.length-1) {
      throw new Error('critical error. stability requested for nonexistent activation index');
    }
    if (activationIndex === 0) {
      return this.pimsStabilityInterval(0);
    }
    const sPrev = this.stability(activationIndex - 1);
    const sIdeal = this.pimsStabilityInterval(activationIndex);
    const dtIdeal = this.pimsTimeInterval(activationIndex) - this.pimsTimeInterval(activationIndex-1);
    const dtActual = this.activations[activationIndex].endTime - this.activations[activationIndex-1].endTime;

    return sPrev + (sIdeal - sPrev)*dtIdeal/dtActual;
  } 
  retrievability() {
    // https://en.wikipedia.org/wiki/Forgetting_curve
    const timeInterval = Date.now() - this.activations[this.activations.length-1].endTime;
    return Math.E^(-timeInterval/this.stability());
  }
}

module.exports = MemoryNode;