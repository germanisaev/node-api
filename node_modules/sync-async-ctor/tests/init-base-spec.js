var expect = require('chai').expect;
var assert = require('chai').assert;
var sinon = require('sinon');
var sandbox = sinon.sandbox.create();
var path = require('path');
var sbItems = {};

var initBase = require('../lib/init-base');

const mysql = {
  create: function(err, db) {}
};

let mysqlMock = {
  getConnection: function() {},
  connectAndExec: function() {}
};

let ib;

describe('initBase ::', function () {
  beforeEach(function(done) {
    sbItems.mysqlMockGetConnection = sandbox.stub(mysqlMock, 'getConnection');
    sbItems.mysqlMockConnectAndExec = sandbox.stub(mysqlMock, 'connectAndExec').callsArgWithAsync(1, null, true);
    sbItems.spMysqlCreate = sandbox.stub(mysql, 'create').callsArgWithAsync(0, null, mysqlMock);
    ib = new initBase(mysql.create);
    sbItems.spInit = sandbox.spy(ib, 'init');
    sbItems.spFlushInitQueue = sandbox.spy(ib, '_flushInitQueue');
    sbItems.addToInitQueue = sandbox.spy(ib, '_addToInitQueue');

    done();
  });

  describe('init ::', function () {
    it('should queue additional init calls and flush when complete', function(done) {
      let base;

      base = new initBase(mysql.create);
      sbItems.addToInitQueue = sandbox.spy(base, '_addToInitQueue');
      sbItems.spFlushInitQueue = sandbox.spy(base, '_flushInitQueue');

      let cbHit = false;

      base.init(function() {
        cbHit = true;
      });

      base.init(function() {
        assert(sbItems.addToInitQueue.calledTwice);
        assert(base._initialized);
        assert(!base._initializing);
        assert(sbItems.spFlushInitQueue.calledOnce);
      });

      expect(base._initQueue.length).equals(2);
      assert(base._initializing);

      setTimeout(() => {
        assert(cbHit);

        done();
      }, 10)
    });

    it('should cb immediatedly if initialized', function(done) {
      assert(ib._initialized);
      assert(!ib._initializing);

      ib.init(() => {
        assert(sbItems.addToInitQueue.notCalled);
      assert(sbItems.spMysqlCreate.calledOnce);
    });

      done();
    });
  });

  afterEach(function () {
    sandbox.restore();
  });
});
