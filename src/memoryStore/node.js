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
    // look at all the activations and determine how primed this node is
    // console.log('getting score for activations', this.activations);
    return this.activations.reduce((score, activation) => {
      return activation.successful ? score+1 : score-1;
    }, 0);
  }
}

module.exports = MemoryNode;