const { transformStatements, batchedDbUpdate, deleteFromAllGraphs } = require('./util');
const {
  BATCH_SIZE,
  MAX_DB_RETRY_ATTEMPTS,
  SLEEP_BETWEEN_BATCHES,
  SLEEP_TIME_AFTER_FAILED_DB_OPERATION,
  INGEST_GRAPH
} = require('./config');

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

  for (let { deletes, inserts } of termObjectChangeSets) {
    const deleteStatements = deletes.map(o => `${o.subject} ${o.predicate} ${o.object}.`);
    const insertStatements = inserts.map(o => `${o.subject} ${o.predicate} ${o.object}.`);

    if (deleteStatements.length) {
      const transformedStatementsToDelete = await transformStatements(fetch, deleteStatements);

      // Trick that becomes useless if we bump the consumer to v0.0.19 or up
      const filteredTransformedStatementsToDelete = transformedStatementsToDelete.filter(statement => statement != '');

      if (filteredTransformedStatementsToDelete.length) {
        await deleteFromAllGraphs(
          muAuthSudo.updateSudo,
          filteredTransformedStatementsToDelete,
          { 'mu-call-scope-id': 'http://redpencil.data.gift/id/concept/muScope/deltas/write-for-dispatch' },
          process.env.MU_SPARQL_ENDPOINT, //Note: this is the default endpoint through auth
          MAX_DB_RETRY_ATTEMPTS,
          SLEEP_BETWEEN_BATCHES,
          SLEEP_TIME_AFTER_FAILED_DB_OPERATION,
        );
      }
    }

    if (insertStatements.length) {
      const transformedStatementsToInsert = await transformStatements(fetch, insertStatements);

      // Trick that becomes useless if we bump the consumer to v0.0.19 or up
      const filteredTransformedStatementsToInsert = transformedStatementsToInsert.filter(statement => statement != '');

      if (filteredTransformedStatementsToInsert.length) {
        await batchedDbUpdate(
          muAuthSudo.updateSudo,
          INGEST_GRAPH,
          filteredTransformedStatementsToInsert,
          { 'mu-call-scope-id': 'http://redpencil.data.gift/id/concept/muScope/deltas/write-for-dispatch' },
          process.env.MU_SPARQL_ENDPOINT, //Note: this is the default endpoint through auth
          BATCH_SIZE,
          MAX_DB_RETRY_ATTEMPTS,
          SLEEP_BETWEEN_BATCHES,
          SLEEP_TIME_AFTER_FAILED_DB_OPERATION,
          "INSERT"
        );
      }
    }
  }
}

module.exports = {
  dispatch
};
