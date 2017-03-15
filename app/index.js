const Queue     = require('rethinkdb-job-queue');
const qDefault  = new Queue(require('../config'), {name: 'jobs'});
const textJob   = require('./text');
module.exports = makeDispatcher();

const TYPES = {
  SYNC_FB_FRIENDS: 'SYNC_FB_FRIENDS',
  SEND_EMAIL: 'SEND_EMAIL',
  SEND_TEXT: 'SEND_TEXT'
};

function makeDispatcher( q = qDefault, logger = console ) {
  q.process((job, next) => {
    switch(job._data.TYPE) {
      case TYPES.SYNC_FB_FRIENDS:
        break;
      case TYPES.SEND_EMAIL:
        break;
      case TYPES.SEND_TEXT:
        textJob(job, next);
        break;
      default:
        logger.log('Invalid job type!', job._data);
        next(new Error('Invalid job type detected'));
    }
    logger.log('GENERIC JOB QUEUE PROCESSED', job._data, TYPES);
    next(null, {});
  });
}

// require('./text')();
// require('./email')();
// require('./syncFbFriends')();
