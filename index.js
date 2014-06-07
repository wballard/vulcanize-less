"use strict";

var path = require('path');
var Fiber = require('fibers');
var Future = require('fibers/future');
var less = require('less');

module.exports = function(filename, content) {
  var extensions = ['.less'];
  if (extensions.indexOf(path.extname(filename)) > -1) {
    var options = {
      filename: filename,
      paths: [
        path.dirname(filename),
        process.cwd()
      ]
    }
    var parse = Future.wrap(function(e, cb){
      var parser = new less.Parser(options);
      parser.parse(content, function(e, parsed){
        if (e) {
          console.error(e.message);
          cb(e, undefined);
        } else {
          cb(undefined, parsed.toCSS(options));
        }
      });
    });
    Fiber(function(){
      try {
        content = parse(content).wait();
      } catch(e) {
        content = '';
      }
    }).run();
    return content;
  } else {
    return content;
  }
}
