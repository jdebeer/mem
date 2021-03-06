class Question {
  constructor({ question, correctAnswer, type, id }) {
    this.prompt = question;
    this.correctAnswer = correctAnswer;
    this.type = type;
    this.id = id;

    // for multiple questions only
    this.givenAnswers = [];
  }
  complete() {
    if (this.type === 'multiple'
      && !this.correctAnswer.find(ans => !this.givenAnswers.find(an => an === ans))) {
      return true;
    }
    return false;
  }
  evaluate(answer) {

    let correct = false;
    if (this.type === 'single') {
      if (answer === ''+this.correctAnswer) {
        console.log('correct\n');
        correct = true;
      }
      else {
        console.log('incorrect\n');
      }
    }
    else if (this.type === 'multiple') {
      if (this.givenAnswers.includes(answer)) {
        console.log('repeat answer');
      }
      else {
        this.givenAnswers.push(answer);
      }
      if (this.correctAnswer.includes(answer)) {
        if (this.givenAnswers.length === this.correctAnswer.length) {
          console.log("correct\n");
        }
        correct = true;
      }
      else {
        console.log("incorrect\n");
      }
    }
    return correct;
  }
}

module.exports = Question;