class Activation {
  constructor({ successful = false, input, startTime, endTime }) {

    this.startTime = startTime;
    this.endTime = endTime;
    this.successful = successful;
    this.input = input; // string or array of objects { value, inputDate }
  }
}

module.exports = Activation;