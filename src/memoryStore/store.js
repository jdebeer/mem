const MemoryNode = require('./node');
const fs = require('fs');

class MemoryStore {
  constructor({
    strategy,
    memoryFolderPath
  }) {
    this.strategy = strategy;
    this.memoryFolderPath = memoryFolderPath;

    if (strategy === 'local') {
      this.reviews = require(memoryFolderPath+'.reviews.json');
      this.memoryUnits = require(memoryFolderPath+'.memoryUnits.json');
    }
    else {
      console.log('strategy,',strategy,', not supported')
    }

    // see previous reviews by memory unit id
    this.reviewsByMemoryUnit = this.reviews.reduce((reviews, review) => {
      if (Array.isArray(reviews[review.unitId])) {
        reviews[review.unitId].push(review);
      }
      else {
        reviews[review.unitId] = [review];
      }
      return reviews;
    }, {});

    // load the existing reviews into memory
    this.nodes = this.memoryUnits.reduce((nodes, { id, question, type, correctAnswer }) => {
      if (this.reviewsByMemoryUnit[id]) {
        nodes[id] = new MemoryNode({
          unitId: id,
          type,
          value: correctAnswer,
          represents: question,
          activations: this.reviewsByMemoryUnit[id]
        });
      }
      return nodes;
    }, {}) || {};
  }

  newActivation(activation) {
    const { unitId } = activation;
    const { type, correctAnswer, question } = this.memoryUnits.find(unit => unit.id === unitId);

    if (!this.nodes[unitId]) {
      this.nodes[unitId] = new MemoryNode({
        unitId,
        type,
        value: correctAnswer,
        represents: question,
        activations: []
      });
    }
    this.nodes[unitId].newActivation(activation);
    this.reviews.push(activation);
    // update the persistent review store
    if (this.strategy === 'local') {
      fs.writeFileSync(this.memoryFolderPath+'.reviews.json', JSON.stringify(this.reviews, null, 4));
    }
  }

  getState() {
    const table = Object.values(this.nodes).map(node => {
      console.log(node.retrievability(), node.represents, node.activations.length);
    });
  }

  getNodeWithLowestRetrievability() {
    if (!this.nodes) return null;
    let nodeWithLowestRetrievability;
    let lowestRetrievability;
    for (const id in this.nodes) {
      const retrievability = this.nodes[id].retrievability();
      if (typeof lowestRetrievability === 'undefined'
        || retrievability < lowestRetrievability
      )
      {
        lowestRetrievability = retrievability;
        nodeWithLowestRetrievability = id;
      }
    };
    return this.nodes[nodeWithLowestRetrievability];
  }

  getNewMemoryUnit() {
    // get a unit that hasn't been reviewed before
    return this.memoryUnits.find(unit => {
      return !this.reviews.find(review => review.unitId === unit.id);
    });
  }
}

module.exports = MemoryStore;