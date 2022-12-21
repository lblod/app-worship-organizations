const { transformStatements, batchedDbUpdate, partition } = require('./util');
const { BYPASS_MU_AUTH_FOR_EXPENSIVE_QUERIES,
  DIRECT_DATABASE_ENDPOINT,
  MU_CALL_SCOPE_ID_INITIAL_SYNC,
  BATCH_SIZE,
  MAX_DB_RETRY_ATTEMPTS,
  SLEEP_BETWEEN_BATCHES,
  SLEEP_TIME_AFTER_FAILED_DB_OPERATION,
  INGEST_GRAPH,
  FILE_SYNC_GRAPH
} = require('./config');
const endpoint = BYPASS_MU_AUTH_FOR_EXPENSIVE_QUERIES ? DIRECT_DATABASE_ENDPOINT : process.env.MU_SPARQL_ENDPOINT;

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

  const partitions = partition(termObjects, o => o.subject.startsWith('<share://'));
  const regularInserts = partitions.fails;
  const fileInserts = partitions.passes;

  if (BYPASS_MU_AUTH_FOR_EXPENSIVE_QUERIES) {
    console.warn(`Service configured to skip MU_AUTH!`);
  }
  console.log(`Using ${endpoint} to insert triples`);

  if (regularInserts.length) {
    originalRegularInsertTriples = regularInserts.map(o => `${o.subject} ${o.predicate} ${o.object}.`)

    await transformStatements(fetch, originalRegularInsertTriples).then(
      transformedRegularInsertTriples => {
        // console.log(transformedRegularInsertTriples);
        batchedDbUpdate(
          muAuthSudo.updateSudo,
          INGEST_GRAPH,
          transformedRegularInsertTriples,
          { 'mu-call-scope-id': MU_CALL_SCOPE_ID_INITIAL_SYNC },
          endpoint,
          BATCH_SIZE,
          MAX_DB_RETRY_ATTEMPTS,
          SLEEP_BETWEEN_BATCHES,
          SLEEP_TIME_AFTER_FAILED_DB_OPERATION
        )
      }
    )
  }

  if (fileInserts.length) {
    originalFileInsertTriples = fileInserts.map(o => `${o.subject} ${o.predicate} ${o.object}.`)
    await transformStatements(fetch, originalFileInsertTriples).then(
      transformedFileInsertTriples => {
        // console.log(transformedFileInsertTriples);
        batchedDbUpdate(
          muAuthSudo.updateSudo,
          FILE_SYNC_GRAPH,
          transformedFileInsertTriples,
          { 'mu-call-scope-id': MU_CALL_SCOPE_ID_INITIAL_SYNC },
          endpoint,
          BATCH_SIZE,
          MAX_DB_RETRY_ATTEMPTS,
          SLEEP_BETWEEN_BATCHES,
          SLEEP_TIME_AFTER_FAILED_DB_OPERATION
        )
      }
    )
  }
}

module.exports = {
  dispatch
};