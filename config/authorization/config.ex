alias Acl.Accessibility.Always, as: AlwaysAccessible
alias Acl.GraphSpec.Constraint.Resource, as: ResourceConstraint
alias Acl.GraphSpec.Constraint.ResourceFormat, as: ResourceFormatConstraint
alias Acl.Accessibility.ByQuery, as: AccessByQuery
alias Acl.GraphSpec, as: GraphSpec
alias Acl.GroupSpec, as: GroupSpec
alias Acl.GroupSpec.GraphCleanup, as: GraphCleanup

defmodule Acl.UserGroups.Config do
  @protected_resource_type [
    "http://www.w3.org/ns/org#Organization",
    "http://data.vlaanderen.be/ns/besluit#Besluit",
    "https://data.vlaanderen.be/ns/besluitvorming#Beslissingsactiviteit",
    "http://data.vlaanderen.be/ns/besluit#Bestuurseenheid",
    "http://data.lblod.info/vocabularies/erediensten/BestuurVanDeEredienst",
    "http://data.vlaanderen.be/ns/besluit#Bestuursorgaan",
    "http://data.lblod.info/vocabularies/erediensten/RolBedienaar",
    "http://data.lblod.info/vocabularies/erediensten/VoorwaardenBedienaar",
    "https://data.vlaanderen.be/ns/persoon#Geboorte",
    "http://data.lblod.info/vocabularies/erediensten/PositieBedienaar",
    "http://www.w3.org/ns/adms#Identifier",
    "https://data.vlaanderen.be/ns/generiek#GestructureerdeIdentificator",
    "http://www.w3.org/ns/org#ChangeEvent",
    "http://www.w3.org/ns/prov#Location",
    "http://www.w3.org/ns/org#Site",
    "http://www.w3.org/ns/locn#Address",
    "http://www.w3.org/ns/person#Person",
    "http://data.vlaanderen.be/ns/mandaat#Mandaat",
    "http://data.vlaanderen.be/ns/mandaat#Mandataris",
    "http://data.lblod.info/vocabularies/leidinggevenden/FunctionarisStatusCode",
    "http://data.lblod.info/vocabularies/leidinggevenden/Functionaris",
    "http://data.lblod.info/vocabularies/erediensten/EredienstMandataris",
    "http://schema.org/ContactPoint",
    "http://data.lblod.info/vocabularies/leidinggevenden/Bestuursfunctie",
    "http://data.lblod.info/vocabularies/erediensten/CentraalBestuurVanDeEredienst",
    "http://data.lblod.info/vocabularies/erediensten/RepresentatiefOrgaan",
    "http://www.w3.org/ns/org#Role",
    "http://www.w3.org/ns/org#Post",
    "http://data.lblod.info/vocabularies/contacthub/AgentInPositie",
    "http://lblod.data.gift/vocabularies/organisatie/TypeEredienst",
    "http://lblod.data.gift/vocabularies/organisatie/EredienstBeroepen",
    "http://xmlns.com/foaf/0.1/Image",
    "http://www.semanticdesktop.org/ontologies/2007/03/22/nfo#FileDataObject",
    "http://publications.europa.eu/ontology/euvoc#Country"
  ]

  defp access_by_role( group_string ) do
    %AccessByQuery{
      vars: ["session_group","session_role"],
      query: sparql_query_for_access_role( group_string ) }
  end

  defp sparql_query_for_access_role( group_string ) do
    "PREFIX ext: <http://mu.semte.ch/vocabularies/ext/>
    PREFIX mu: <http://mu.semte.ch/vocabularies/core/>
    SELECT distinct ?session_group ?session_role WHERE {
      <SESSION_ID> ext:sessionGroup/mu:uuid ?session_group;
        ext:sessionRole ?session_role.
      FILTER( ?session_role = \"#{group_string}\" )
    }"
  end

  defp can_access_dashboard() do
    %AccessByQuery{
      vars: [],
      query: "PREFIX ext: <http://mu.semte.ch/vocabularies/ext/>
        SELECT DISTINCT ?session WHERE {
          VALUES ?session { <SESSION_ID> }
          ?session ext:sessionRole \"LoketLB-AdminDashboardContactOrganisatiegegevensGebruiker\" .
        }"
    }
  end
  
  def user_groups do
    [
      # // PUBLIC
      %GroupSpec{
        name: "public",
        useage: [:read],
        access: %AlwaysAccessible{}, # Needed for mock-login
        graphs: [ %GraphSpec{
                    graph: "http://mu.semte.ch/graphs/public",
                    constraint: %ResourceConstraint{
                      resource_types: [
                        "http://xmlns.com/foaf/0.1/Person",
                        "http://xmlns.com/foaf/0.1/OnlineAccount",
                        "http://www.w3.org/ns/adms#Identifier",
                        "http://lblod.data.gift/vocabularies/organisatie/BestuurseenheidClassificatieCode",
                        "http://mu.semte.ch/vocabularies/ext/GeslachtCode",
                        "http://mu.semte.ch/vocabularies/ext/ReasonCode",
                        "http://lblod.data.gift/vocabularies/organisatie/BedienaarFinanceringCode",
                        "http://lblod.data.gift/vocabularies/organisatie/OrganisatieStatusCode",
                        "http://lblod.data.gift/vocabularies/organisatie/BestuursfunctieCode",
                        "http://lblod.data.gift/vocabularies/organisatie/BestuursorgaanClassificatieCode",
                        "http://lblod.data.gift/vocabularies/organisatie/MandatarisStatusCode",
                        "http://www.w3.org/2004/02/skos/core#ConceptScheme",
                        "http://www.w3.org/2004/02/skos/core#Concept",
                      ] } } ] },
      %GroupSpec{
        name: "org",
        useage: [:read],
        access: %AccessByQuery{
          vars: ["session_group"],
          query: "PREFIX ext: <http://mu.semte.ch/vocabularies/ext/>
                  PREFIX mu: <http://mu.semte.ch/vocabularies/core/>
                  SELECT ?session_group ?session_role WHERE {
                    <SESSION_ID> ext:sessionGroup/mu:uuid ?session_group.
                    }" },
        graphs: [ %GraphSpec{
                    graph: "http://mu.semte.ch/graphs/organizations/",
                    constraint: %ResourceConstraint{
                      resource_types: [
                        "http://xmlns.com/foaf/0.1/Person",
                        "http://xmlns.com/foaf/0.1/OnlineAccount",
                        "http://www.w3.org/ns/adms#Identifier",
                      ] } } ] },
      # // Logged in users
      %GroupSpec{
        name: "readers",
        useage: [:read],
        # **Explanations on the chosen role**
        # - We reuse scopes firstly defined in Loket to handle worship data. Hence the LoketLB- prefix
        access: access_by_role( "LoketLB-eredienstOrganisatiesGebruiker" ),
        graphs: [ %GraphSpec{
                    graph: "http://mu.semte.ch/graphs/organizations/",
                    constraint: %ResourceConstraint{
                      resource_types: @protected_resource_type
                    } } ] },
      # // dashboard users
      %GroupSpec{
        name: "o-admin-rwf",
        useage: [:read, :write, :read_for_write],
        access: can_access_dashboard(),
        graphs: [
          %GraphSpec{
            graph: "http://mu.semte.ch/graphs/reports",
            constraint: %ResourceConstraint{
              resource_types: [
                "http://lblod.data.gift/vocabularies/reporting/Report",
                "http://open-services.net/ns/core#Error",
                "http://www.semanticdesktop.org/ontologies/2007/03/22/nfo#DataContainer",
                "http://www.semanticdesktop.org/ontologies/2007/03/22/nfo#FileDataObject"
              ]
            }
          },
          %GraphSpec{
            graph: "http://mu.semte.ch/graphs/system/jobs",
            constraint: %ResourceConstraint{
              resource_types: [
                "http://vocab.deri.ie/cogs#Job",
                "http://www.semanticdesktop.org/ontologies/2007/03/22/nfo#DataContainer",
                "http://www.semanticdesktop.org/ontologies/2007/03/22/nfo#FileDataObject"
              ]
            }
          },
        ]
      },
      # // CLEANUP
      #
      %GraphCleanup{
        originating_graph: "http://mu.semte.ch/application",
        useage: [:read, :write],
        name: "clean"
      }
    ]
  end
end
