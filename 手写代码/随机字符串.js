function generateRandomAlphaNum(len) {
  var rdmString = "";
  for (; rdmString.length < len; rdmString += Math.random().toString(36).substr(2));
  // console.log(rdmString)
  return rdmString.substr(0, len);
}
