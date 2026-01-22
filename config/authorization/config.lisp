;;;;;;;;;;;;;;;;;;;
;;; delta messenger
(in-package :delta-messenger)

(add-delta-logger)
(add-delta-messenger "http://deltanotifier/")

;;;;;;;;;;;;;;;;;
;;; configuration
(in-package :client)
(setf *log-sparql-query-roundtrip* t)
(setf *backend* "http://triplestore:8890/sparql")

(in-package :server)
(setf *log-incoming-requests-p* nil)

;;;;;;;;;;;;;;;;;
;;; access rights
(in-package :acl)

(defparameter *access-specifications* nil
  "All known ACCESS specifications.")

(defparameter *graphs* nil
  "All known GRAPH-SPECIFICATION instances.")

(defparameter *rights* nil
  "All known GRANT instances connecting ACCESS-SPECIFICATION to GRAPH.")

;; Prefixes used in the constraints below (not in the SPARQL queries)
(define-prefixes
  :besluit "http://data.vlaanderen.be/ns/besluit#"
  :besluitvorming "http://data.vlaanderen.be/ns/besluitvorming#"
  :adms "http://www.w3.org/ns/adms#"
  :nfo "http://www.semanticdesktop.org/ontologies/2007/03/22/nfo#"
  :prov "http://www.w3.org/ns/prov#"
  :skos "http://www.w3.org/2004/02/skos/core#"
  :ext "http://mu.semte.ch/vocabularies/ext/"
  :foaf "http://xmlns.com/foaf/0.1/"
  :code "http://lblod.data.gift/vocabularies/organisatie/"
  :org "http://www.w3.org/ns/org#"
  :ere "http://data.lblod.info/vocabularies/erediensten/"
  :persoon "https://data.vlaanderen.be/ns/persoon#"
  :generiek "https://data.vlaanderen.be/ns/generiek#"
  :locn "http://www.w3.org/ns/locn#"
  :person "http://www.w3.org/ns/person#"
  :mandaat "http://data.vlaanderen.be/ns/mandaat#"
  :lblodlg "http://data.lblod.info/vocabularies/leidinggevenden/"
  :schema "http://schema.org/"
  :ch "http://data.lblod.info/vocabularies/contacthub/"
  :euvoc "http://publications.europa.eu/ontology/euvoc#"
  :cogs "http://vocab.deri.ie/cogs#"
  :reporting "http://lblod.data.gift/vocabularies/reporting/"
  :core "http://open-services.net/ns/core#")

(type-cache::add-type-for-prefix "http://mu.semte.ch/sessions/" "http://mu.semte.ch/vocabularies/session/Session")

(define-graph public ("http://mu.semte.ch/graphs/public")
  ("foaf:Person" -> _)
  ("foaf:OnlineAccount" -> _)
  ("adms:Identifier" -> _)
  ("code:BestuurseenheidClassificatieCode" -> _)
  ("ext:GeslachtCode" -> _)
  ("ext:ReasonCode" -> _)
  ("code:BedienaarFinanceringCode" -> _)
  ("code:OrganisatieStatusCode" -> _)
  ("code:BestuursfunctieCode" -> _)
  ("code:BestuursorgaanClassificatieCode" -> _)
  ("code:MandatarisStatusCode" -> _)
  ("skos:ConceptScheme" -> _)
  ("skos:Concept" -> _))

(define-graph org ("http://mu.semte.ch/graphs/organizations/")
  ("foaf:Person" -> _)
  ("foaf:OnlineAccount" -> _)
  ("adms:Identifier" -> _))

(define-graph readers ("http://mu.semte.ch/graphs/organizations/")
  ("org:Organization" -> _)
  ("besluit:Besluit" -> _)
  ("besluitvorming:Beslissingsactiviteit" -> _)
  ("besluit:Bestuurseenheid" -> _)
  ("ere:EredienstBestuurseenheid" -> _)
  ("ere:BestuurVanDeEredienst" -> _)
  ("besluit:Bestuursorgaan" -> _)
  ("ere:RolBedienaar" -> _)
  ("ere:VoorwaardenBedienaar" -> _)
  ("persoon:Geboorte" -> _)
  ("ere:PositieBedienaar" -> _)
  ("adms:Identifier" -> _)
  ("generiek:GestructureerdeIdentificator" -> _)
  ("org:ChangeEvent" -> _)
  ("prov:Location" -> _)
  ("org:Site" -> _)
  ("locn:Address" -> _)
  ("person:Person" -> _)
  ("mandaat:Mandaat" -> _)
  ("mandaat:Mandataris" -> _)
  ("lblodlg:FunctionarisStatusCode" -> _)
  ("lblodlg:Functionaris" -> _)
  ("ere:EredienstMandataris" -> _)
  ("schema:ContactPoint" -> _)
  ("lblodlg:Bestuursfunctie" -> _)
  ("ere:CentraalBestuurVanDeEredienst" -> _)
  ("ere:RepresentatiefOrgaan" -> _)
  ("org:Role" -> _)
  ("org:Post" -> _)
  ("ch:AgentInPositie" -> _)
  ("code:TypeEredienst" -> _)
  ("code:EredienstBeroepen" -> _)
  ("foaf:Image" -> _)
  ("nfo:FileDataObject" -> _)
  ("euvoc:Country" -> _))

(define-graph reports ("http://mu.semte.ch/graphs/reports")
  ("reporting:Report" -> _)
  ("core:Error" -> _)
  ("nfo:DataContainer" -> _)
  ("nfo:FileDataObject" -> _))

(define-graph jobs ("http://mu.semte.ch/graphs/system/jobs")
  ("cogs:Job" -> _)
  ("nfo:DataContainer" -> _)
  ("nfo:FileDataObject" -> _))

(supply-allowed-group "public")

(supply-allowed-group "logged-in-or-impersonating"
  :parameters ("session_group")
  :query "PREFIX ext: <http://mu.semte.ch/vocabularies/ext/>
    PREFIX mu: <http://mu.semte.ch/vocabularies/core/>
    SELECT ?session_group ?session_role WHERE {
      <SESSION_ID> ext:sessionGroup/mu:uuid ?session_group.
    }")

(supply-allowed-group "o-admin-rwf"
  :parameters ()
  :query "PREFIX ext: <http://mu.semte.ch/vocabularies/ext/>
    SELECT DISTINCT ?session WHERE {
      <SESSION_ID> ext:sessionRole \"LoketLB-AdminDashboardWOP\" .
    }")

(supply-allowed-group "LoketLB-eredienstOrganisatiesGebruiker"
  :parameters ("session_group" "session_role")
  :query "PREFIX ext: <http://mu.semte.ch/vocabularies/ext/>
    PREFIX mu: <http://mu.semte.ch/vocabularies/core/>
    SELECT DISTINCT ?session_group ?session_role WHERE {
      <SESSION_ID> ext:sessionGroup/mu:uuid ?session_group;
                   ext:sessionRole ?session_role.
      FILTER( ?session_role = \"LoketLB-eredienstOrganisatiesGebruiker\" )
    }")

(grant (read)
  :to-graph (public)
  :for-allowed-group "public")

(grant (read)
  :to-graph (org)
  :for-allowed-group "logged-in-or-impersonating")

(grant (read)
  :to-graph (readers)
  :for-allowed-group "LoketLB-eredienstOrganisatiesGebruiker")

(grant (read write)
  :to-graph (reports)
  :for-allowed-group "o-admin-rwf")

(grant (read write)
  :to-graph (jobs)
  :for-allowed-group "o-admin-rwf")