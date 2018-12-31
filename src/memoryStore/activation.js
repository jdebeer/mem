class Activation {
  constructor({ date, timeToActivate, successful = false, input }) {

    this.date = date;
    this.timeToActivate = timeToActivate;  // elapsed time to receive definitive `successful` metric
    this.successful = successful;
    this.input = input; // string or array of objects { value, inputDate }
  }
}

module.exports = Activation;