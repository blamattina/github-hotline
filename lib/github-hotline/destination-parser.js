function DestinationParser(destination) {
  var destinationRegex = /^([a-zA-Z\d]+-?[a-zA-Z\d]+)\/([\w_-]+)#(\d+)$/;
  // First Capture: username: alphanumeric characters or single hyphens,
  // and cannot begin or end with a hyphen
  //
  // Second Capture: repo: word characters, underscores, and hyphens
  //
  // Third Capture: number: digits

  if (destinationRegex.test(destination)) {
    var result = destinationRegex.exec(destination);
    this._user = result[1];
    this._repo = result[2];
    this._number = result[3];
  } else {
    throw new Error(destination + ' is an invalid format!');
  }
}

DestinationParser.prototype = {
  getUser: function() {
    return this._user;
  },

  getRepo: function() {
    return this._repo;
  },

  getNumber: function() {
    return +this._number;
  },
}

module.exports = DestinationParser;
