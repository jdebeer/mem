const MemoryNode = require('./node');
const fs = require('fs');

class MemoryStore {
  constructor({
    strategy,
    memoryFolderPath,
    initialMemoryDecayRate = 0.004
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

  getNextQuestion() {
    // check memory store for weakest
    let nodeWithLowestScore;
    let lowestScore;
    for (const id in this.nodes) {
      const score = this.nodes[id].score();
      console.log('score for id', id, score);
      if (score < lowestScore || typeof lowestScore === 'undefined') {
        lowestScore = score;
        nodeWithLowestScore = id;
      }
    }
    console.log('node with lowest score', nodeWithLowestScore);
    console.log('lowest score', lowestScore);
    const nextQuestion = this.memoryUnits.find(unit => +unit.id === +nodeWithLowestScore);
    // console.log('memory units', this.memoryUnits);
    // console.log('node witih lowest score', nodeWithLowestScore);
    // console.log('next question', nextQuestion);
    return nextQuestion;
  }
}

module.exports = MemoryStore;