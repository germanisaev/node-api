class InitBase {
  constructor(initFn) {
    this._initialized = false;
    this._initializing = false;
    this._initQueue = [];
    this.initFn = initFn;

    this.init();
  }

  init(cb) {
    if (typeof cb !== 'function') cb = () => {};

    if (this._initialized) {
      return cb();
    } else if (this._initializing) {
      this._addToInitQueue(cb);
    } else {
      this._initializing = true;

      this.initFn((err, initBase) => {
        if (err) {
          this.error = err;

          cb(err);
        }

        this.initBase = initBase;
        this._initialized = true;
        this._initializing = false;
        this._flushInitQueue();

        return cb();
      });
    }
  }

  _addToInitQueue(cb) {
    this._initQueue.push(cb);
  }

  _flushInitQueue() {
    this._initQueue.forEach((cb) => {
      cb();
    });

    this._initQueue.length = 0;
  }
}

module.exports = InitBase;
