const Queue       = require('rethinkdb-job-queue');
const qDefault    = new Queue(require('../config'), {name: 'email'});
const AWS         = require('aws-sdk');
AWS.config.region = 'us-east-1';
const sesDefault  = new AWS.SES();

module.exports = setupQueue;

function setupQueue(q = qDefault, ses = sesDefault, logger = console) {
  q.process((job, next) => {
    const payload = composeMessage(job._data);
    ses.sendEmail(payload, (err, data) => {
      if (err) { logger.log('SES ERROR: ', err, err.trace); return next(err); }
      console.log('AWS SES OK: ', data);
      next(null, data);
    });
  });
}

function composeMessage( jobData ) {
  return {
    Source: jobData.fromAddress,
    Destination: {
      ToAddresses: [jobData.toAddress]
    },
    Message: {
      Subject: {
        Data: jobData.subject
      },
      Body: {
        Html: {
          Data: `
            <!doctype html>
            <html>
              <head><title>${jobData.subject}</title></head>
              <body>
                ${jobData.body}
              </body>
            </html>
          `
        }
      }
    }
  };
}
