/**
 * simple promise
 * @param {[type]} fun [description] 需要执行的任务
 */
function PromiseB(fun) {

  this.succArg = undefined;              // 记录resolve状态值
  this.failArg = undefined;              // 记录reject状态值
  this.succCbs = [];                     // then的执行完成回调队列
  this.failCbs = [];                     // then的执行失败回调队列
  this._status = this.STATUS.PENDING;    // 内部属性_status，表示状态的引用，默认为PENDING状态

  this._execFun(fun);
}

/**
 * Promise的三种状态
 * @type {{PENDING: number, RESOLVE: number, REJECT: number}}
 */
PromiseB.prototype.STATUS = {
  PENDING: 1, //挂起状态
  RESOLVE: 2, //完成状态
  REJECT: 3 //拒绝状态
};

PromiseB.prototype._isFunction = function(f) {
  return Object.prototype.toString.call(f) === '[object Function]';
};

/**
 * Promise需要执行的任务：
 * @param fun 接收两个参数：this.resolve方法 和 this.reject方法
 *            调用resolve方法时,设置_status为RESOLVE，状态值为resolve方法传入的参数
 *            调用reject方法时，设置_status为REJECT，状态值为reject方法传入的参数
 * @private
 */
PromiseB.prototype._execFun = function(fun) {
  var that = this;

  if (this._isFunction(fun)) {
    fun(function() {
      that.succArg = Array.prototype.slice.apply(arguments);
      that._status = that.STATUS.RESOLVE;

      that.resolve.apply(that, arguments);
    }, function() {
      that.failArg = Array.prototype.slice.apply(arguments);
      that._status = that.STATUS.REJECT;

      that.reject.apply(that, arguments);
    });
  } else {
    this.resolve(fun);
  }

};

/**
 * 执行成功resolve方法
 */
PromiseB.prototype.resolve = function() {
  var arg = arguments,
    ret,
    callback = this.succCbs.shift();                 // 取出执行成功的回调队列的第一个函数
  if (this._status === this.STATUS.RESOLVE && callback) {
    ret = callback.apply(callback, arg);
    if (!(ret instanceof PromiseB)) {
      var _ret = ret;
      ret = new PromiseB(function(resolve) {
        setTimeout(function() {
          resolve(_ret);
        });
      });

      ret.succCbs = this.succCbs.slice();
    }
  }
};

/**
 * 执行失败reject方法
 */
PromiseB.prototype.reject = function() {
  var arg = arguments,
    ret,
    callback = this.failCbs.shift();
  if (this._status === this.STATUS.REJECT && callback) {
    ret = callback.apply(callback, arg);
    if (!(ret instanceof PromiseB)) {
      var _ret = ret;
      ret = new PromiseB(function(resolve) {
        setTimeout(function() {
          resolve(_ret);
        }, 200);
      });
      ret.failCbs = this.failCbs.slice();
    }
  }
};

/**
 *
 * @param s 执行成功的回调函数
 * @param f 执行失败的回调函数
 * @return {PromiseB}
 */
PromiseB.prototype.then = function(s, f) {
  this.done(s);
  this.fail(f);
  return this;
};

/**
 * 执行成功时运行done
 * @param fun
 * @return {PromiseB}
 */
PromiseB.prototype.done = function(fun) {
  if (this._isFunction(fun)) {
    if (this._status === this.STATUS.RESOLVE) {
      fun.apply(fun, this.succArg);
    } else {
      this.succCbs.push(fun);
    }
  }
  return this;
};

/**
 * 执行失败时运行fail
 * @param fun
 * @return {PromiseB}
 */
PromiseB.prototype.fail = function(fun) {
  if (this._isFunction(fun)) {
    if (this._status === this.STATUS.REJECT) {
      fun.apply(fun, this.failArg);
    } else {
      this.failCbs.push(fun);
    }
  }
  return this;
};

PromiseB.prototype.always = function(fun) {
  this.done(fun);
  this.fail(fun);
  return this;
};

module.exports = PromiseB;