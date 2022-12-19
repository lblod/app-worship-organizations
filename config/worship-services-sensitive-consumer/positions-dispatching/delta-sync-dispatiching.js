const { transformStatements, batchedDbUpdate } = require('./util');
const {
  BATCH_SIZE,
  MAX_DB_RETRY_ATTEMPTS,
  SLEEP_BETWEEN_BATCHES,
  SLEEP_TIME_AFTER_FAILED_DB_OPERATION,
  INGEST_GRAPH
} = require('./config');

const endpoint = process.env.MU_SPARQL_ENDPOINT;

/**
* Dispatch the fetched information to a target graph.
* Note: <share://file/data> will be ADDED to it's own graph.
*   We take only care of adding them, not updating triples, this is a TODO
* @param { mu, muAuthSudo } lib - The provided libraries from the host service.
* @param { termObjectChangeSets: { deletes, inserts } } data - The fetched changes sets, which objects of serialized Terms
*          [ {
*              graph: "<http://foo>",
*              subject: "<http://bar>",
*              predicate: "<http://baz>",
*              object: "<http://boom>^^<http://datatype>"
*            }
*         ]
* @return {void} Nothing
*/
async function dispatch(lib, data) {
  const { mu, muAuthSudo, fetch } = lib;
  const { termObjectChangeSets } = data;

  console.log(`Using ${endpoint} to insert triples`);

  for (let { deletes, inserts } of termObjectChangeSets) {
    const deleteStatements = deletes.map(o => `${o.subject} ${o.predicate} ${o.object}.`);

    if (deleteStatements.length) {
      let transformedDeleteTriples;
      try {
        transformedDeleteTriples = await transformStatements(fetch, deleteStatements);
      } catch (e) {
        console.log('Something went wrong during the reasoning:', e);
        throw e;
      }

      await batchedDbUpdate(
        muAuthSudo.updateSudo,
        INGEST_GRAPH,
        transformedDeleteTriples,
        { 'mu-call-scope-id': 'http://redpencil.data.gift/id/concept/muScope/deltas/write-for-dispatch' },
        endpoint,
        BATCH_SIZE,
        MAX_DB_RETRY_ATTEMPTS,
        SLEEP_BETWEEN_BATCHES,
        SLEEP_TIME_AFTER_FAILED_DB_OPERATION,
        "DELETE"
      );
    }

    const insertStatements = inserts.map(o => `${o.subject} ${o.predicate} ${o.object}.`);
    if (insertStatements.length) {
      let transformedInsertTriples;
      try {
        transformedInsertTriples = await transformStatements(fetch, insertStatements);
      } catch (e) {
        console.log('Something went wrong during the reasoning:', e);
        throw e;
      }

      await batchedDbUpdate(
        muAuthSudo.updateSudo,
        INGEST_GRAPH,
        transformedInsertTriples,
        { 'mu-call-scope-id': 'http://redpencil.data.gift/id/concept/muScope/deltas/write-for-dispatch' },
        endpoint,
        BATCH_SIZE,
        MAX_DB_RETRY_ATTEMPTS,
        SLEEP_BETWEEN_BATCHES,
        SLEEP_TIME_AFTER_FAILED_DB_OPERATION,
        "INSERT"
      );
    }
  }
}

module.exports = {
  dispatch
};
