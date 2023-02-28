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
          ?s ?p ?o .
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

  const bestuurseenheidPublicInsert = async () => {
    await muUpdate(`
      INSERT {
        GRAPH <http://mu.semte.ch/graphs/public> {
          ?s ?p ?o .
        }
      } WHERE {
        GRAPH <${INGEST_GRAPH}> {
          VALUES ?type {
            <http://data.vlaanderen.be/ns/besluit#Bestuurseenheid>
          }
          ?s a ?type ;
            <http://www.w3.org/ns/org#classification> ?bestuurClassification .
            ?p ?o .

          FILTER (?bestuurClassification IN (
              <http://data.vlaanderen.be/id/concept/BestuurseenheidClassificatieCode/5ab0e9b8a3b2ca7c5e000001>,
              <http://data.vlaanderen.be/id/concept/BestuurseenheidClassificatieCode/5ab0e9b8a3b2ca7c5e000000>
            )
          )
        }
      }`, extraHeaders, endpoint);
  };

  updateWithRetry(bestuurseenheidPublicInsert, maxAttempts, sleepBetweenBatches, sleepTimeOnFail);

  const bestuursorgaanPublicInsert = async () => {
    await muUpdate(`
      INSERT {
        GRAPH <http://mu.semte.ch/graphs/public> {
          ?s ?p ?o .
        }
      } WHERE {
        GRAPH <${INGEST_GRAPH}> {
          VALUES ?type {
            <http://data.vlaanderen.be/ns/besluit#Bestuursorgaan>
          }
          ?s a ?type ;
            ?p ?o .

          ?s (<https://data.vlaanderen.be/ns/generiek#isTijdspecialisatieVan>/<http://data.vlaanderen.be/ns/besluit#bestuurt>) |
              (<http://data.vlaanderen.be/ns/besluit#bestuurt>) ?administrativeUnit .

          ?administrativeUnit <http://www.w3.org/ns/org#classification> ?bestuurClassification .

          FILTER (?bestuurClassification IN (
            <http://data.vlaanderen.be/id/concept/BestuurseenheidClassificatieCode/5ab0e9b8a3b2ca7c5e000001>,
            <http://data.vlaanderen.be/id/concept/BestuurseenheidClassificatieCode/5ab0e9b8a3b2ca7c5e000000>
          ))
        }
      }`, extraHeaders, endpoint);
  };

  updateWithRetry(bestuursorgaanPublicInsert, maxAttempts, sleepBetweenBatches, sleepTimeOnFail);

  // ------------------------------------------------------------
  // ------------------------ ORG GRAPHS ------------------------
  // ------------------------------------------------------------

  // Dispatch worship admin units linked to ROs



  // Dispatch worship admin units linked to municipalities




  // Dispatch worship admin units linked to provinces




  // Dispatch bestuursorganen




  // Dispatch (etc)





  # RULE ONE
# Representative organs can see data from organizations they are mother organization of

PREFIX ere: <http://data.lblod.info/vocabularies/erediensten/>
PREFIX org: <http://www.w3.org/ns/org#>
PREFIX mu: <http://mu.semte.ch/vocabularies/core/>
PREFIX organisatie: <https://data.vlaanderen.be/ns/organisatie#>
PREFIX besluit: <http://data.vlaanderen.be/ns/besluit#>
PREFIX generiek: <https://data.vlaanderen.be/ns/generiek#>

INSERT {
  GRAPH ?orgGraph {
    ?worshipAdminUnit ?pworshipAdminUnit ?oworshipAdminUnit .
  }
} WHERE {
  GRAPH ?g {
    ?s a ere:RepresentatiefOrgaan ;
      mu:uuid ?uuidRO ;
      org:linkedTo ?worshipAdminUnit .

    ?worshipAdminUnit ?pworshipAdminUnit ?oworshipAdminUnit .

    BIND(IRI(CONCAT("http://mu.semte.ch/graphs/organizations/", ?uuidRO, "/LoketLB-eredienstOrganisatiesGebruiker")) AS ?orgGraph)
  }
}


# RULE TWO
# Municipalities can see worship services they have relations to via the module
# 'betrokken lokale besturen'

PREFIX ere: <http://data.lblod.info/vocabularies/erediensten/>
PREFIX org: <http://www.w3.org/ns/org#>
PREFIX mu: <http://mu.semte.ch/vocabularies/core/>
PREFIX organisatie: <https://data.vlaanderen.be/ns/organisatie#>
PREFIX besluit: <http://data.vlaanderen.be/ns/besluit#>
PREFIX generiek: <https://data.vlaanderen.be/ns/generiek#>

INSERT {
  GRAPH ?orgGraph {
    ?worshipAdminUnit ?pworshipAdminUnit ?oworshipAdminUnit .
  }
} WHERE {
  GRAPH ?g {
    ?s a besluit:Bestuurseenheid ;
      mu:uuid ?uuidBestuurseenheid ;
      org:classification <http://data.vlaanderen.be/id/concept/BestuurseenheidClassificatieCode/5ab0e9b8a3b2ca7c5e000001> ; # Gemeente
      ere:betrokkenBestuur ?betrokke .
      
    ?betrokke org:organization ?worshipAdminUnit ;
      ?pbetrokke ?obetrokke .

    ?worshipAdminUnit ?pworshipAdminUnit ?oworshipAdminUnit .

    BIND(IRI(CONCAT("http://mu.semte.ch/graphs/organizations/", ?uuidBestuurseenheid, "/LoketLB-eredienstOrganisatiesGebruiker")) AS ?orgGraph)
  }
}



# RULE THREE
# Provinces will see the worship services which they have a link
# (any link) to in the module 'betrokken lokale besturen'

PREFIX ere: <http://data.lblod.info/vocabularies/erediensten/>
PREFIX org: <http://www.w3.org/ns/org#>
PREFIX mu: <http://mu.semte.ch/vocabularies/core/>
PREFIX organisatie: <https://data.vlaanderen.be/ns/organisatie#>
PREFIX besluit: <http://data.vlaanderen.be/ns/besluit#>
PREFIX generiek: <https://data.vlaanderen.be/ns/generiek#>

INSERT {
  GRAPH ?orgGraph {
    ?worshipAdminUnit ?pworshipAdminUnit ?oworshipAdminUnit .
  }
} WHERE {
  GRAPH <http://mu.semte.ch/graphs/tmp-graph-to-import-services> {
    ?s a besluit:Bestuurseenheid ;
      mu:uuid ?uuidBestuurseenheid ;
      org:classification <http://data.vlaanderen.be/id/concept/BestuurseenheidClassificatieCode/5ab0e9b8a3b2ca7c5e000000> ; # Provincie
      ere:betrokkenBestuur ?betrokke .

    ?betrokke org:organization ?worshipAdminUnit ;
      ?pbetrokke ?obetrokke .

    ?worshipAdminUnit ?pworshipAdminUnit ?oworshipAdminUnit .

    BIND(IRI(CONCAT("http://mu.semte.ch/graphs/organizations/", ?uuidBestuurseenheid, "/LoketLB-eredienstOrganisatiesGebruiker")) AS ?orgGraph)
  }
}



Puis on décale le reste dans les graphs des bestuuren


}


export async function updateWithRetry(call, maxAttempts, sleepBetweenBatches, sleepTimeOnFail) {
  await operationWithRetry(call, 0, maxAttempts, sleepTimeOnFail);
  console.log(`Sleeping before next query execution: ${sleepBetweenBatches}`);
  await new Promise(r => setTimeout(r, sleepBetweenBatches));
}