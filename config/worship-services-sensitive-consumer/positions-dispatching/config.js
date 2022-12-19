// No option to bypass mu auth because the dispatching of the triples aften ending in the tmp graph
// is based on deltas so mu-auth needs to be aware of inserted/delted triples

const BATCH_SIZE = parseInt(process.env.BATCH_SIZE) || 100;
const MU_CALL_SCOPE_ID_INITIAL_SYNC = process.env.MU_CALL_SCOPE_ID_INITIAL_SYNC || 'http://redpencil.data.gift/id/concept/muScope/deltas/consumer/initialSync';
const MAX_DB_RETRY_ATTEMPTS = parseInt(process.env.MAX_DB_RETRY_ATTEMPTS || 5);
const MAX_REASONING_RETRY_ATTEMPTS = parseInt(process.env.MAX_REASONING_RETRY_ATTEMPTS || 5);
const SLEEP_BETWEEN_BATCHES = parseInt(process.env.SLEEP_BETWEEN_BATCHES || 1000);
const SLEEP_TIME_AFTER_FAILED_REASONING_OPERATION = parseInt(process.env.SLEEP_TIME_AFTER_FAILED_REASONING_OPERATION || 10000);
const SLEEP_TIME_AFTER_FAILED_DB_OPERATION = parseInt(process.env.SLEEP_TIME_AFTER_FAILED_DB_OPERATION || 60000);
const INGEST_GRAPH = process.env.INGEST_GRAPH || 'http://mu.semte.ch/graphs/public';

module.exports = {
  BATCH_SIZE,
  MU_CALL_SCOPE_ID_INITIAL_SYNC,
  MAX_DB_RETRY_ATTEMPTS,
  MAX_REASONING_RETRY_ATTEMPTS,
  SLEEP_BETWEEN_BATCHES,
  SLEEP_TIME_AFTER_FAILED_DB_OPERATION,
  SLEEP_TIME_AFTER_FAILED_REASONING_OPERATION,
  INGEST_GRAPH
};
