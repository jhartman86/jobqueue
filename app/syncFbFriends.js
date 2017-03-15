const Queue = require('rethinkdb-job-queue');
const qDefault = new Queue(require('../config'), {name: 'email'});

module.exports = setupQueue;

/**
 * This will loop through the facebook API to find friends in common
 * that are using this app.
 * @param  {Queue} [q=qDefault]      RethinkDB Job Queue
 * @param  {Object} [logger=console] Logger (defaults to console)
 * @return {void}
 */
function setupQueue( q = qDefault, logger = console ) {
  q.process((job, next) => {
    logger.log('SYNCFBFRIENDS INVOKED');
    // const payload = job._data;
    // payload.accountId, payload.facebookId, payload.facebookAccessToken
    // use ^ that information for the query and have RethinkDB issue it
    // via r.http() and pagination through results/save automatically
  });
}

// Facebook API direct request
// r.http('https://graph.facebook.com/v2.8/YXBwbGljYXRpb25fY29udGV4dDoyNDY0Mjk2NzU3OTk3NzUZD/friends_using_app?limit=1', {
//   header: {'Authorization':'Bearer EAADgIGFJxN8BAMIkFbsBeZC4qrbIf3f1hrXWnekciAwzanZC4LufHzpfTcLubGoPLJB8BUpxh31UzutPhalbsruq5qjItU8XxRyDpN6l5yJL2g6rB2wa5bNdiisZA3dkwx2z9U0b7fa7eNK2Xz5zsZBm91s5P1kmo8dohcrk7gZDZD'},
//   page: function(info) { return info('body')('paging')('next').default(null); },
//   pageLimit: -1
//   }
// )('data');
