const MemoryNode = require('./node');
const fs = require('fs');

class MemoryStore {
  constructor({
    strategy,
    memoryFolderPath,
    initialMemoryDecayRate = 0.0008
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
        }, {
          initialMemoryDecayRate
        });
        return nodes;
      }
    }, {});
  }

  newActivation(activation) {
    const { unitId } = activation;
    // update the in-memory review store
    console.log('saving new activation', activation);
    this.nodes[unitId].newActivation(activation);
    this.reviews.push(activation);
    // update the persistent review store
    if (this.strategy === 'local') {
      fs.writeFileSync(this.memoryFolderPath+'.reviews.json', JSON.stringify(this.reviews, null, 4));
    }
  }

  getState() {
    const table = Object.values(this.nodes).map(node => {
      console.log(node.score(), node.represents, node.activations.length);
    });
  }

  getNodeWithLowestRetrievability() {
    let nodeWithLowestRetrievability;
    let lowestRetrievability;
    for (const id in this.nodes) {
      const retrievability = this.nodes[id].retrievability();
      if (typeof lowestRetrievability === 'undefined'
        || retrievability < lowestRetrievability
      )
      {
        lowestRetrievability = retrievability;
        nodeWithLowestRetrievability = node
      }
    };
    return this.nodes[nodeWithLowestRetrievability];
  }

  getNewMemoryUnit() {
    // get a unit that hasn't been reviewed before
    this.memoryUnits.find(unit => {
      return !this.reviews.find(review => review.unitId === unit.id);
    });
  }
}

module.exports = MemoryStore;