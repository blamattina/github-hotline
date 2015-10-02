function DestinationParser(destination) {
  var destinationRegex = /^([a-zA-Z\d]+-?[a-zA-Z\d]+)\/([\w_-]+)#(\d+)$/;

  if (destinationRegex.test(destination)) {
    var result = destinationRegex.exec(destination);
    this._user = result[1];
    this._repo = result[2];
    this._number = result[3];
  } else {
    throw new Error('Invalid destination: ' + destination);
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
