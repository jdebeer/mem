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

  getState() {
    const table = Object.values(this.nodes).map(node => {
      console.log(node.score(), node.represents, node.activations.length);
    });
  }

  getNextQuestion() {
    // check memory store for weakest
    let nodeWithLowestScore;
    let lowestScore;

    let nodeWithLowestScoreWithActivations;
    let lowestScoreWithActivations = 10000;
    for (const id in this.nodes) {
      const score = this.nodes[id].score();
      console.log('score for id', id, score);
      if (score < lowestScore || typeof lowestScore === 'undefined') {
        lowestScore = score;
        nodeWithLowestScore = id;
      }
      if (score < lowestScoreWithActivations && this.nodes[id].activations.length) {
        lowestScoreWithActivations = score;
        nodeWithLowestScoreWithActivations = id;
      }
    }

    let nextQuestionId = nodeWithLowestScore;
    let nextQuestionCurrentScore = lowestScore;
    if (lowestScoreWithActivations < 0.8) {
      nextQuestionId = nodeWithLowestScoreWithActivations;
      nextQuestionCurrentScore = lowestScoreWithActivations;
    }

    console.log('next question id', nextQuestionId);
    console.log('score of node of next question', nextQuestionCurrentScore);
    const nextQuestion = this.memoryUnits.find(unit => +unit.id === +nextQuestionId);
    // console.log('memory units', this.memoryUnits);
    // console.log('node witih lowest score', nodeWithLowestScore);
    // console.log('next question', nextQuestion);
    return nextQuestion;
  }
}

module.exports = MemoryStore;