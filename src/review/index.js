const QuestionAnswerCycle = require('./questionAnswerCycle');

class ReviewProgram {
  constructor(memoryStore) {
    this.retentionThreshold = 0.95; // A+
    this.memoryStore = memoryStore;
  }
  getNextQuestion() {
    let nextQuestion;
    const nodeWithLowestR = this.memoryStore.getNodeWithLowestRetrievability();
    if (!nodeWithLowestR
      || nodeWithLowestR.retrievability() > this.retentionThreshold
    ) {
      nextQuestion = this.memoryStore.getNewMemoryUnit();
      if (!nextQuestion) {
        console.log('out of new memory units');
        return false;
      }
    }
    else nextQuestion = this.memoryStore.memoryUnits.find(unit =>
      unit.id === nodeWithLowestR.unitId);
    return nextQuestion;
  }
  continue() {
    const nextQuestion = this.getNextQuestion();
    if (!nextQuestion) {
      return console.log('ending program');
    }
    const prompt = new QuestionAnswerCycle({ question: nextQuestion });
    const startTime = Date.now();
    prompt.start().then(activation => {
      this.memoryStore.newActivation({
        successful: activation.correct,
        unitId: nextQuestion.id,
        startTime,
        endTime: Date.now()
      });
      this.continue();
    })
    .catch(err => {
      console.error(err);
    })
  }
  start() {
    this.continue();
  }
}

module.exports = ReviewProgram;
