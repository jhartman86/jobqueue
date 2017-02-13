require('mocha');
const _ = require('lodash');
const snsTextMessage = require('../app/snsTextMessage');
const { expect, should, assert } = require('chai');

describe('snsTextMessage', () => {

  const mockJobData = {
    _data: {
      phone: '`1234567890`',
      message: 'Lorem ipsum'
    }
  };

  /**
   * Since a lot of this is callback driven, but dependencies are being
   * mocked out, the "test" part of this is to ensure ordering/invocation
   * effectively - not the implementation details of whats being passed
   * to the SNS API.
   * @type {Function}
   */
  it('should issue HTTP request to AWS SNS service', (done) => {
    const invocations = [];

    snsTextMessage(
      { // mocked queue details
        process(callback) {
          callback(mockJobData, function nextHandler(err, results) {
            invocations.push('q.process');
            console.log(invocations);
            done();
            // console.log('nexter invoked with', err, results);
          });
        }
      },
      { // mocked sns dependency
        publish(data, callback) {
          invocations.push('sns.publish');
          expect(false).to.be(true);
          // expect(_.get(data, 'Message')).to.contain('Nope');
          console.log(data);
          callback(null, {mock:'job details'});
        }
      },
      {
        log() {},
        error() {}
      }
    );
  });

  it("should handle SNS errors properly", () => {
    console.log('todo');
  });

});
