// const Queue       = require('rethinkdb-job-queue');
// const qDefault    = new Queue(require('../config'), {name: 'jobs'});
const AWS         = require('aws-sdk');
AWS.config.region = 'us-east-1';
const snsDefault  = new AWS.SNS();

module.exports = sendText;

/**
 * Inject dependencies as defaults in order to allow for easier stubbing/mocking
 * during testing.
 */
function sendText(job, next, sns = snsDefault, logger = console) {
  // q.process((job, next) => {
    const phone = getNumber(job._data.phone);
    const snsData = {
      Message: job._data.message,
      MessageStructure: 'string',
      PhoneNumber: `+1${phone}`
    };

    sns.publish(snsData, (err, data) => {
      if (err) {
        logger.log(`jobQueue(snsTextMessage) SNS ERROR: `, err, err.stack);
        return next(err);
      }
      logger.log(`jobQueue(snsTextMessage) OK: `, job.id);
      next(null, data);
    });
  // });
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
