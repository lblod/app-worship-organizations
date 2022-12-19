const {
  MAX_REASONING_RETRY_ATTEMPTS,
  SLEEP_TIME_AFTER_FAILED_REASONING_OPERATION
} = require('./config');

async function batchedDbUpdate(muUpdate,
  graph,
  triples,
  extraHeaders,
  endpoint,
  batchSize,
  maxAttempts,
  sleepBetweenBatches = 1000,
  sleepTimeOnFail = 1000,
  operation = 'INSERT'
) {

  for (let i = 0; i < triples.length; i += batchSize) {
    console.log(`Inserting triples in batch: ${i}-${i + batchSize}`);

    const batch = triples.slice(i, i + batchSize).join('\n');

    const insertCall = async () => {
      await muUpdate(`
${operation} DATA {
GRAPH <${graph}> {
${batch}
}
}
`, extraHeaders, endpoint);
    };

    await operationWithRetry(insertCall, 0, maxAttempts, sleepTimeOnFail);

    console.log(`Sleeping before next query execution: ${sleepBetweenBatches}`);
    await new Promise(r => setTimeout(r, sleepBetweenBatches));
  }
}

async function operationWithRetry(
  callback,
  attempt,
  maxAttempts,
  sleepTimeOnFail) {
  try {
    if (typeof callback === "function")
      return await callback();
    else // Catch error from promise - not how I would do it normally, but allows re use of existing code.
      return await callback;
  }
  catch (e) {
    console.log(`Operation failed for ${callback.toString()}, attempt: ${attempt} of ${maxAttempts}`);
    console.log(`Error: ${e}`);
    console.log(`Sleeping ${sleepTimeOnFail} ms`);

    if (attempt >= maxAttempts) {
      console.log(`Max attempts reached for ${callback.toString()}, giving up`);
      throw e;
    }

    await new Promise(r => setTimeout(r, sleepTimeOnFail));
    return operationWithRetry(callback, ++attempt, maxAttempts, sleepTimeOnFail);
  }
}

/**
 * Send triples to reasoning service for conversion
 *
 */
async function transformTriples(fetch, triples) {
  const processFlowCall = async () => {
    return await processFlow(fetch, triples)
  };

  return await operationWithRetry(
    processFlowCall,
    0,
    MAX_REASONING_RETRY_ATTEMPTS,
    SLEEP_TIME_AFTER_FAILED_REASONING_OPERATION
  );
}

async function processFlow(fetch, triples) {
  const preProcessedTriples = await preProcess(fetch, triples);
  const processedTriples = await mainConversion(fetch, preProcessedTriples);
  return processedTriples;
}

async function preProcess(fetch, triples) {
  let formdata = new URLSearchParams();
  formdata.append("data", triples);

  let requestOptions = {
    method: 'POST',
    body: formdata,
    redirect: 'follow'
  };

  const response = await fetch("http://reasoner/reason/dl2op/preprocess", requestOptions);

  if (response.ok) {
    return response.text();
  } else {
    throw `Error while reasoning (pre-processing): ${response.status} ${response.statusText}`;
  }
}

async function mainConversion(fetch, triples) {
  let formdata = new URLSearchParams();
  formdata.append("data", triples);

  let requestOptions = {
    method: 'POST',
    body: formdata,
    redirect: 'follow'
  };

  const response = await fetch("http://reasoner/reason/dl2op/main", requestOptions);

  if (response.ok) {
    return response.text();
  } else {
    throw `Error while reasoning (pre-processing): ${response.status} ${response.statusText}`;
  }
}

async function transformStatements(fetch, triples) {
  const transformedTriples = await transformTriples(fetch, triples.join('\n'));
  console.log('ALORS ?', transformedTriples);
  statements = transformedTriples.replace(/\n{2,}/g, '').split('\n');
  console.log(`CONVERSION: FROM ${triples.length} triples to ${statements.length}`);
  return statements;
}

module.exports = {
  batchedDbUpdate,
  transformStatements
};
