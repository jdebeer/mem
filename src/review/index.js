const QuestionAnswerCycle = require('./questionAnswerCycle');

class ReviewProgram {
  constructor(memoryStore) {
    this.retentionThreshold = 0.95; // A+
    this.memoryStore = memoryStore;
  }
  getNextQuestion() {
    let nextQuestion;
    const nodeWithLowestR = this.memoryStore.getNodeWithLowestRetrievability();
    if (nodeWithLowestR.retrievability > this.retentionThreshold) {
      nextQuestion = this.memoryStore.getNewMemoryUnit();
      if (!nextQuestion) {
        return console.log('out of new memory units');
      }
    }
    else nextQuestion = nodeWithLowestR;
  }
  continue() {
    const nextQuestion = this.getNextQuestion();
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
    });
  }
  start() {
    this.continue();
  }
}

module.exports = ReviewProgram;
