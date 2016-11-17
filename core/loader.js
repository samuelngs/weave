'use strict';

var _cluster = require('cluster');

var _cluster2 = _interopRequireDefault(_cluster);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function StartServerPlugin(entry) {
  _classCallCheck(this, StartServerPlugin);
  this.entry = entry;
  this.afterEmit = this.afterEmit.bind(this);
  this.apply = this.apply.bind(this);
  this.startServer = this.startServer.bind(this);
  this.worker = null;
}

StartServerPlugin.prototype.afterEmit = function afterEmit(compilation, callback) {
  if (this.worker && this.worker.isConnected()) {
    return callback();
  }
  this.startServer(compilation, callback);
};

StartServerPlugin.prototype.apply = function apply(compiler) {
  compiler.plugin('after-emit', this.afterEmit);
};

StartServerPlugin.prototype.startServer = function startServer(compilation, callback) {
  var _this = this;
  var entry = void 0;
  var entries = Object.keys(compilation.assets);
  if (this.entry) {
    entry = this.entry;
    if (!compilation.assets[entry]) {
      console.error('Entry ' + entry + ' not found. Try one of: ' + entries.join(' '));
    }
  } else {
    entry = entries[0];
    if (entries.length > 1) {
      console.log('More than one entry built, selected ' + entry + '. All entries: ' + entries.join(' '));
    }
  }
  var existsAt = compilation.assets[entry].existsAt;
  _cluster2.default.setupMaster({ exec: existsAt });
  _cluster2.default.on('online', function (worker) {
    _this.worker = worker;
    callback();
  });
  _cluster2.default.fork();
};

module.exports = StartServerPlugin;
