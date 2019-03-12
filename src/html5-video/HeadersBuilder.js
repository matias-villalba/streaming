module.exports = class HeadersBuilder{

  constructor (){
    this.headers = {
      'Content-Type': 'video/mp4',
    }
  }

  addStart(start){
    this.start = start
    return this
  }
  addEnd(end){
    this.end = end
    return this
  }
  addTotalVideoSize(totalVideoSize){
    this.totalVideoSize = totalVideoSize
    return this
 }


  build(){
    if(this.start != undefined && this.end != undefined){
      this.headers['Content-Range'] = `bytes ${this.start}-${this.end}/${this.totalVideoSize}`
      this.headers['Accept-Ranges'] = 'bytes'
      this.headers['Content-Length'] = (this.end-this.start)+1
    }
    else {
      this.headers['Content-Length'] = this.totalVideoSize
    }
    return this.headers
  }
}