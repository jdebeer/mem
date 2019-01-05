const Activation = require('./activation');

class MemoryNode {
  constructor({ activations = [], unitId, type, value, represents }, config) {

    this.represents = represents;
    this.value = value;
    this.type = type;
    this.unitId = unitId;

    this.initialDecayPerSecond = config.initialMemoryDecayRate;
    this.activations = activations.map(activation => {
      return new Activation(activation);
    })
  }
  newActivation(activation) {
    this.activations.push(new Activation(activation));
  }
  score() {
    // here's the crux of it:
    // https://en.wikipedia.org/wiki/Forgetting_curve


    // look at all the activations and determine how primed this node is
    // console.log('getting score for activations', this.activations);

    // basic time interval based decay equation
    if (!this.activations.length) {
      return 0;
    }
    else {
      // console.log('generating score based on activations', this.activations);
      function getBaseLog(x, y) {
        return Math.log(y) / Math.log(x);
      }
      this.activations.sort((a, b) => {
        return a.startTime < b.endTime;
      });

      const timeNow = Date.now();

      const adjustedDecayRate = this.activations.reduce((adjustedDecayRate, activation) => {
        if (!activation.successful) return adjustedDecayRate;
        const { startTime, endTime } = activation;
        return adjustedDecayRate*((timeNow - startTime)/1000)/getBaseLog(1-adjustedDecayRate, 0.8);
      }, this.initialDecayPerSecond);

      const mostRecentActivation = this.activations[this.activations.length - 1];
      const { startTime: mostRecentStartTime, endTime: mostRecentEndTime } = mostRecentActivation;
      const mostRecentTimeInterval = (timeNow - mostRecentStartTime)/1000;

      // console.log('calculating score. most recent time interval', mostRecentTimeInterval);
      // console.log('remaining after period', (1 - adjustedDecayRate));
      // console.log('number of periods', mostRecentTimeInterval);

      let score = Math.pow(1 - adjustedDecayRate, mostRecentTimeInterval);
      if (this.activations.length === 1) {
        // console.log('decay rate is', this.initialDecayPerSecond);
        score = Math.pow(1 - this.initialDecayPerSecond, mostRecentTimeInterval);
      }
      else {
        // console.log('decay rate is', adjustedDecayRate);
      }

      // console.log('score', score)
      return score;
    }

    // // basic binary ticker scoring method
    // return this.activations.reduce((score, activation) => {
    //   return activation.successful ? score+1 : score-1;
    // }, 0);
  }
}

module.exports = MemoryNode;