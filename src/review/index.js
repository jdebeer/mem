const QuestionAnswerCycle = require('./questionAnswerCycle');

class ReviewProgram {
  constructor(memoryStore) {
    this.retentionThreshold = 0.95; // A+
    this.memoryStore = memoryStore;
  }
  getNextQuestion() {
    let nextQuestion;
    if (this.presetNextQuestion) {
      nextQuestion = this.memoryStore.memoryUnits.find(unit =>
        unit.id === this.presetNextQuestion);
      delete this.presetNextQuestion;
      return nextQuestion;
    }
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
    if (!this.memoryStore.nodes[nextQuestion.id]) {
      console.log("the answer to this question is", nextQuestion.answer);
    }
    const prompt = new QuestionAnswerCycle({ question: nextQuestion });
    const startTime = Date.now();
    prompt.start().then(activation => {
      if (!activation.correct) {
        this.presetNextQuestion = nextQuestion.id;
      }
      // if this is the first activation and it's not succesful, don't add an activation
      // theoretical basis: for a node to be marked as existing, it must initially be fully formed
      if (!activation.correct && !this.memoryStore.nodes[nextQuestion.id]) {
        return this.continue();
      }
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
