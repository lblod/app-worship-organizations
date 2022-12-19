const { transformStatements, batchedDbUpdate } = require('./util');
const {
  MU_CALL_SCOPE_ID_INITIAL_SYNC,
  BATCH_SIZE,
  MAX_DB_RETRY_ATTEMPTS,
  SLEEP_BETWEEN_BATCHES,
  SLEEP_TIME_AFTER_FAILED_DB_OPERATION,
  INGEST_GRAPH
} = require('./config');
const endpoint = process.env.MU_SPARQL_ENDPOINT;

/**
* Dispatch the fetched information to a target graph.
* @param { mu, muAuthSudo } lib - The provided libraries from the host service.
* @param { termObjects } data - The fetched quad information, which objects of serialized Terms
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
  const { termObjects } = data;

  console.log(`Using ${endpoint} to insert triples`);

  if (termObjects.length) {
    originalInsertTriples = termObjects.map(o => `${o.subject} ${o.predicate} ${o.object}.`)

    const transformedInsertTriples = await transformStatements(fetch, originalRegularInsertTriples);
    await batchedDbUpdate(
      muAuthSudo.updateSudo,
      INGEST_GRAPH,
      transformedInsertTriples,
      { 'mu-call-scope-id': MU_CALL_SCOPE_ID_INITIAL_SYNC },
      endpoint,
      BATCH_SIZE,
      MAX_DB_RETRY_ATTEMPTS,
      SLEEP_BETWEEN_BATCHES,
      SLEEP_TIME_AFTER_FAILED_DB_OPERATION
    )
  }
}

module.exports = {
  dispatch
};
