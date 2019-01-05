const QuestionAnswerCycle = require('./questionAnswerCycle');

class ReviewProgram {
  constructor(memoryStore) {
    this.memoryStore = memoryStore;
  }
  continue() {
    const nextQuestion = this.memoryStore.getNextQuestion();
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
