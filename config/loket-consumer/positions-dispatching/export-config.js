/*
 * This file is used as helper for fetching subjects related to a worship administrative unit
 * (ere:BestuurVanDeEredienst or ere:CentraalBestuurVanDeEredienst).
 * It provides some path template queries as a shorthand to fetch the related subject.
 * See code to check how it is used.
 */
export default [
  {
    type: `http://data.vlaanderen.be/ns/mandaat#Mandaat`,
    pathToSubmission: `
      ?orgaanInTime <http://www.w3.org/ns/org#hasPost> ?subject ;
        <https://data.vlaanderen.be/ns/generiek#isTijdspecialisatieVan> ?orgaan .
      ?orgaan <http://data.vlaanderen.be/ns/besluit#bestuurt> ?worshipAdministrativeUnit .
    `
  },
  {
    type: `http://data.lblod.info/vocabularies/erediensten/PositieBedienaar`,
    pathToSubmission: `
      ?worshipAdministrativeUnit <http://data.lblod.info/vocabularies/erediensten/wordtBediendDoor> ?subject .
    `
  },
  {
    type: `http://data.lblod.info/vocabularies/erediensten/EredienstMandataris`,
    pathToSubmission: `
      ?subject <http://www.w3.org/ns/org#holds> ?mandate .
      ?orgaanInTime <http://www.w3.org/ns/org#hasPost> ?mandate ;
        <https://data.vlaanderen.be/ns/generiek#isTijdspecialisatieVan> ?orgaan .
      ?orgaan <http://data.vlaanderen.be/ns/besluit#bestuurt> ?worshipAdministrativeUnit .
    `
  },
  {
    type: `http://data.lblod.info/vocabularies/erediensten/RolBedienaar`,
    pathToSubmission: `
      ?subject <http://www.w3.org/ns/org#holds> ?position .
      ?worshipAdministrativeUnit <http://data.lblod.info/vocabularies/erediensten/wordtBediendDoor> ?position .
    `
  },
  {
    type: `http://www.w3.org/ns/person#Person`, // Person linked to a EredienstMandataris
    pathToSubmission: `
      ?mandataris <http://data.vlaanderen.be/ns/mandaat#isBestuurlijkeAliasVan> ?subject ;
        <http://www.w3.org/ns/org#holds> ?mandate .
      ?orgaanInTime <http://www.w3.org/ns/org#hasPost> ?mandate ;
        <https://data.vlaanderen.be/ns/generiek#isTijdspecialisatieVan> ?orgaan .
      ?orgaan <http://data.vlaanderen.be/ns/besluit#bestuurt> ?worshipAdministrativeUnit .
    `
  },
  {
    type: `http://www.w3.org/ns/person#Person`, // Person linked to a RolBedienaar
    pathToSubmission: `
      ?minister <http://www.w3.org/ns/org#heldBy> ?subject ;
        <http://www.w3.org/ns/org#holds> ?position .
      ?worshipAdministrativeUnit <http://data.lblod.info/vocabularies/erediensten/wordtBediendDoor> ?position .
    `
  },
  {
    type: `http://data.vlaanderen.be/ns/persoon#Geboorte`, // Birthdate of person linked to a EredienstMandataris
    pathToSubmission: `
      ?person <https://data.vlaanderen.be/ns/persoon#heeftGeboorte> ?subject .
      ?mandataris <http://data.vlaanderen.be/ns/mandaat#isBestuurlijkeAliasVan> ?person ;
        <http://www.w3.org/ns/org#holds> ?mandate .
      ?orgaanInTime <http://www.w3.org/ns/org#hasPost> ?mandate ;
        <https://data.vlaanderen.be/ns/generiek#isTijdspecialisatieVan> ?orgaan .
      ?orgaan <http://data.vlaanderen.be/ns/besluit#bestuurt> ?worshipAdministrativeUnit .
    `
  },
  {
    type: `http://data.vlaanderen.be/ns/persoon#Geboorte`, // Birthdate of person linked to a RolBedienaar
    pathToSubmission: `
      ?person <https://data.vlaanderen.be/ns/persoon#heeftGeboorte> ?subject .
      ?minister <http://www.w3.org/ns/org#heldBy> ?person ;
        <http://www.w3.org/ns/org#holds> ?position .
      ?worshipAdministrativeUnit <http://data.lblod.info/vocabularies/erediensten/wordtBediendDoor> ?position .
    `
  },
  {
    type: `http://www.w3.org/ns/adms#Identifier`, // Id of person linked to a EredienstMandataris
    pathToSubmission: `
      ?person <https://data.vlaanderen.be/ns/persoon#registratie> ?subject .
      ?mandataris <http://data.vlaanderen.be/ns/mandaat#isBestuurlijkeAliasVan> ?person ;
        <http://www.w3.org/ns/org#holds> ?mandate .
      ?orgaanInTime <http://www.w3.org/ns/org#hasPost> ?mandate ;
        <https://data.vlaanderen.be/ns/generiek#isTijdspecialisatieVan> ?orgaan .
      ?orgaan <http://data.vlaanderen.be/ns/besluit#bestuurt> ?worshipAdministrativeUnit .
    `
  },
  {
    type: `http://www.w3.org/ns/adms#Identifier`, // Id of person linked to a RolBedienaar
    pathToSubmission: `
      ?person <https://data.vlaanderen.be/ns/persoon#registratie> ?subject .
      ?minister <http://www.w3.org/ns/org#heldBy> ?person ;
        <http://www.w3.org/ns/org#holds> ?position .
      ?worshipAdministrativeUnit <http://data.lblod.info/vocabularies/erediensten/wordtBediendDoor> ?position .
    `
  },
  {
    type: `https://data.vlaanderen.be/ns/generiek#GestructureerdeIdentificator`, // Structured id of person linked to a EredienstMandataris
    pathToSubmission: `
      ?id <https://data.vlaanderen.be/ns/generiek#gestructureerdeIdentificator> ?subject .
      ?person <https://data.vlaanderen.be/ns/persoon#registratie> ?id .
      ?mandataris <http://data.vlaanderen.be/ns/mandaat#isBestuurlijkeAliasVan> ?person ;
        <http://www.w3.org/ns/org#holds> ?mandate .
      ?orgaanInTime <http://www.w3.org/ns/org#hasPost> ?mandate ;
        <https://data.vlaanderen.be/ns/generiek#isTijdspecialisatieVan> ?orgaan .
      ?orgaan <http://data.vlaanderen.be/ns/besluit#bestuurt> ?worshipAdministrativeUnit .
    `
  },
  {
    type: `https://data.vlaanderen.be/ns/generiek#GestructureerdeIdentificator`, // Structured id of person linked to a RolBedienaar
    pathToSubmission: `
      ?id <https://data.vlaanderen.be/ns/generiek#gestructureerdeIdentificator> ?subject .
      ?person <https://data.vlaanderen.be/ns/persoon#registratie> ?id .
      ?minister <http://www.w3.org/ns/org#heldBy> ?person ;
        <http://www.w3.org/ns/org#holds> ?position .
      ?worshipAdministrativeUnit <http://data.lblod.info/vocabularies/erediensten/wordtBediendDoor> ?position .
    `
  },
  {
    type: `http://schema.org/ContactPoint`, // Contact point linked to a EredienstMandataris
    pathToSubmission: `
      ?mandataris <http://schema.org/contactPoint> ?subject ;
        <http://www.w3.org/ns/org#holds> ?mandate .
      ?orgaanInTime <http://www.w3.org/ns/org#hasPost> ?mandate ;
        <https://data.vlaanderen.be/ns/generiek#isTijdspecialisatieVan> ?orgaan .
      ?orgaan <http://data.vlaanderen.be/ns/besluit#bestuurt> ?worshipAdministrativeUnit .
    `
  },
  {
    type: `http://schema.org/ContactPoint`, // Contact point linked to a RolBedienaar
    pathToSubmission: `
      ?minister <http://schema.org/contactPoint> ?subject ;
        <http://www.w3.org/ns/org#holds> ?position .
      ?worshipAdministrativeUnit <http://data.lblod.info/vocabularies/erediensten/wordtBediendDoor> ?position .
    `
  },
  {
    type: `http://www.w3.org/ns/locn#Address`, // Address linked to a EredienstMandataris
    pathToSubmission: `
      ?address <http://www.w3.org/ns/locn#address> ?subject .
      ?mandataris <http://schema.org/contactPoint> ?address ;
        <http://www.w3.org/ns/org#holds> ?mandate .
      ?orgaanInTime <http://www.w3.org/ns/org#hasPost> ?mandate ;
        <https://data.vlaanderen.be/ns/generiek#isTijdspecialisatieVan> ?orgaan .
      ?orgaan <http://data.vlaanderen.be/ns/besluit#bestuurt> ?worshipAdministrativeUnit .
    `
  },
  {
    type: `http://www.w3.org/ns/locn#Address`, // Address linked to a RolBedienaar
    pathToSubmission: `
    ?address <http://www.w3.org/ns/locn#address> ?subject .
      ?minister <http://schema.org/contactPoint> ?address ;
        <http://www.w3.org/ns/org#holds> ?position .
      ?worshipAdministrativeUnit <http://data.lblod.info/vocabularies/erediensten/wordtBediendDoor> ?position .
    `
  }
];
