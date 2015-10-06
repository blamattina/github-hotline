function Issue(params) {
}

Issue.prototype = {
  createComment: function (body) {
    console.log('send message');

  }
}

module.exports = Issue;
