import { INGEST_GRAPH  } from './config';
import { operationWithRetry } from './util';

export async function dispatchToCorrectGraphs(
  muUpdate,
  extraHeaders,
  endpoint,
  maxAttempts,
  sleepBetweenBatches = 1000,
  sleepTimeOnFail = 1000,
  ) {

  // ------------------------------------------------------------
  // ----------------------- PUBLIC GRAPH -----------------------
  // ------------------------------------------------------------

  const variousPublicInsert = async () => {
    await muUpdate(`
      INSERT {
        GRAPH <http://mu.semte.ch/graphs/public> {

        }
      } WHERE {
        GRAPH <${INGEST_GRAPH}> {
          VALUES ?type {
            <http://lblod.data.gift/vocabularies/organisatie/BestuursorgaanClassificatieCode>
            <http://lblod.data.gift/vocabularies/organisatie/TypeVestiging>
            <http://lblod.data.gift/vocabularies/organisatie/OrganisatieStatusCode>
            <http://lblod.data.gift/vocabularies/organisatie/TypeBetrokkenheid>
            <http://lblod.data.gift/vocabularies/organisatie/TypeEredienst>
            <http://lblod.data.gift/vocabularies/organisatie/BestuursfunctieCode>
            <http://lblod.data.gift/vocabularies/organisatie/EredienstBeroepen>
            <http://mu.semte.ch/vocabularies/ext/GeslachtCode>
            <http://publications.europa.eu/ontology/euvoc#Country>
            <http://data.lblod.info/vocabularies/erediensten/RepresentatiefOrgaan>
            <http://data.lblod.info/vocabularies/erediensten/BetrokkenLokaleBesturen>
            <http://lblod.data.gift/vocabularies/organisatie/BestuurseenheidClassificatieCode>
          }
          ?s a ?type ;
            ?p ?o .
        }
      }`, extraHeaders, endpoint);
  };

  updateWithRetry(variousPublicInsert, maxAttempts, sleepBetweenBatches, sleepTimeOnFail);

  // TODO Donc là pareil, type par type, avec les filters :)

    type: `http://data.vlaanderen.be/ns/besluit#Bestuurseenheid`,
    additionalFilter: `
      ?subject <http://www.w3.org/ns/org#classification> ?bestuurClassification .

      FILTER (?bestuurClassification IN (
          <http://data.vlaanderen.be/id/concept/BestuurseenheidClassificatieCode/5ab0e9b8a3b2ca7c5e000001>,
          <http://data.vlaanderen.be/id/concept/BestuurseenheidClassificatieCode/5ab0e9b8a3b2ca7c5e000000>
        )
      )
    `

    type: `http://data.vlaanderen.be/ns/besluit#Bestuursorgaan`,
    additionalFilter: `
      ?subject (<https://data.vlaanderen.be/ns/generiek#isTijdspecialisatieVan>/<http://data.vlaanderen.be/ns/besluit#bestuurt>)|(<http://data.vlaanderen.be/ns/besluit#bestuurt>) ?administrativeUnit . ?administrativeUnit <http://www.w3.org/ns/org#classification> ?bestuurClassification .
      FILTER (?bestuurClassification IN (
        <http://data.vlaanderen.be/id/concept/BestuurseenheidClassificatieCode/5ab0e9b8a3b2ca7c5e000001>,
        <http://data.vlaanderen.be/id/concept/BestuurseenheidClassificatieCode/5ab0e9b8a3b2ca7c5e000000>
      ))
    `





  // ------------------------------------------------------------
  // ------------------------ ORG GRAPHS ------------------------
  // ------------------------------------------------------------



}


export async function updateWithRetry(call, maxAttempts, sleepBetweenBatches, sleepTimeOnFail) {
  await operationWithRetry(call, 0, maxAttempts, sleepTimeOnFail);
  console.log(`Sleeping before next query execution: ${sleepBetweenBatches}`);
  await new Promise(r => setTimeout(r, sleepBetweenBatches));
}