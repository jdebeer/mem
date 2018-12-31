const Question = require('./question');
const { prompt } = require('inquirer');

class QuestionAnswerCycle {
  constructor({ question }) {
    this.question = new Question(question);
    this.correct;
    this.finalResultDetermined = false;
  }
  evaluateAnswer({ answer }) {
    const { type } = this.question;

    this.correct = this.question.evaluate(answer);

    return new Promise((resolve, reject) => {

      if (type === 'single') {
        this.finalResultDetermined = true;
        this.finalAnswer = answer;
      }
      else if (type === 'multiple') {
        if (this.correct === false || this.question.complete()) {
          this.finalAnswer = this.question.givenAnswers;
          this.finalResultDetermined = true;
        }
      }
      resolve();
    });
  }
  continue(prompt) {
    return new Promise((resolve, reject) => {
      this.showPrompt(prompt)
        .then((ans) => {
          return this.evaluateAnswer(ans);
        })
        .then(result => {
          if (!this.finalResultDetermined) {
            this.continue('')
              .then(() => resolve({ correct: this.correct, input: this.finalAnswer }));
          }
          else {
            resolve({ correct: this.correct, input: this.finalAnswer });
          }
        });
    });
  }
  showPrompt(message) {
    return new Promise((resolve, reject) => {
      return prompt({
        type: 'input',
        name: 'answer',
        message
      })
      .then(ans => {
        resolve(ans);
      });
    });
  }
  start() {
    const { prompt } = this.question;
    return this.continue(prompt);
  }
}

module.exports = QuestionAnswerCycle;