const Queue       = require('rethinkdb-job-queue');
const qDefault    = new Queue(require('../config'), {name: 'snsTextMessage'});
const AWS         = require('aws-sdk');
AWS.config.region = 'us-east-1';
const snsDefault  = new AWS.SNS();

/**
 * Inject dependencies as defaults in order to allow for easier stubbing/mocking
 * during testing.
 */
module.exports = function setupQueue(
  q = qDefault,
  sns = snsDefault,
  logger = console
) {
  q.process((job, next) => {
    try {
      const phone = getNumber(job._data.phone);

      sns.publish({
        Message: job._data.message,
        MessageStructure: 'string',
        PhoneNumber: `+1${phone}`
      }, (err, data) => {
        if (err) {
          return logger.log(`jobQueue(snsTextMessage) SNS ERROR: `, err, err.stack);
        }
        logger.log(`jobQueue(snsTextMessage) OK: `, job);
        next(null, data);
      });
    } catch (err) {
      logger.error(`jobQueue(snsTextMessage) ERROR: `, err);
      next(err);
    }
  });
};

/**
 * Returns the phone # as a string, prefixed with +1, or false.
 * @return {string|false} Validate it or return false.
 */
function getNumber( phone ) {
  const numericsOnly = phone.replace(/\D/g, '');
  if (numericsOnly.length !== 10) {
    throw new Error(`Invalid phone number submitted to job: ${phone}`);
  }
  return numericsOnly;
}
