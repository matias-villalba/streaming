module.exports.retrieveStatusCode = (requestHeaders) =>{
  return (requestHeaders.range)? 206 : 200
}

module.exports.extractStartAndEndFromHeaders = (requestHeaders, fileLastBytePosition) => {
  if(!requestHeaders.range){
    return {};
  }
  const parts = requestHeaders.range.replace(/bytes=/, "").split("-")
  const start = parseInt(parts[0], 10)
  const end = parts[1]
    ? parseInt(parts[1], 10)
    : fileLastBytePosition

  return {start, end}
}

module.exports.HeadersBuilder = require('./HeadersBuilder')
