// only to serve index.html. This gulpfile doesn't start api server
"use strict"
const {parallel, task, src} = require('gulp')
const connect = require('gulp-connect')
const open = require('gulp-open')
const connectConfig = {
  root: ['./'],
  port: 9005,
  base: 'http://localhost',
  livereload: true
}
task('connect', ()=>{ //run a local server
  connect.server(connectConfig)
})
task('open', ()=>{  //open browser
  src(connectConfig.root[0]).pipe(open({uri:  `${connectConfig.base}:${connectConfig.port}/`}))
})
task('default', parallel('connect', 'open'))
