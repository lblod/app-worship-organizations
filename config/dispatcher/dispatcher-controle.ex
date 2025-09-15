defmodule Dispatcher do
  use Matcher

  define_accept_types [
    html: ["text/html", "application/xhtml+html"],
    json: ["application/json", "application/vnd.api+json"],
    upload: ["multipart/form-data"],
    sparql_json: ["application/sparql-results+json"],
    any: [ "*/*" ],
  ]

  define_layers [ :api_services, :api, :frontend, :not_found ]


  ###############################################################
  # domain.json
  ###############################################################

  match "/people/*path", %{ accept: [:json], layer: :api} do
    Proxy.forward conn, path, "http://cache/people/"
  end

  match "/agents-in-position/*path", %{ accept: [:json], layer: :api} do
    Proxy.forward conn, path, "http://cache/agents-in-position/"
  end

  match "/posts/*path", %{ accept: [:json], layer: :api} do
    Proxy.forward conn, path, "http://cache/posts/"
  end

  match "/mandatories/*path", %{ accept: [:json], layer: :api} do
    Proxy.forward conn, path, "http://cache/mandatories/"
  end

  match "/mandatory-status-codes/*path", %{ accept: [:json], layer: :api} do
    Proxy.forward conn, path, "http://cache/mandatory-status-codes/"
  end

  match "/worship-mandatories/*path", %{ accept: [:json], layer: :api} do
    Proxy.forward conn, path, "http://cache/worship-mandatories/"
  end

  match "/half-elections/*path", %{ accept: [:json], layer: :api} do
    Proxy.forward conn, path, "http://cache/half-elections/"
  end

  match "/contact-points/*path", %{ accept: [:json], layer: :api} do
    Proxy.forward conn, path, "http://cache/contact-points/"
  end

  match "/mandates/*path", %{ accept: [:json], layer: :api} do
    Proxy.forward conn, path, "http://cache/mandates/"
  end

  match "/board-positions/*path", %{ accept: [:json], layer: :api} do
    Proxy.forward conn, path, "http://cache/board-positions/"
  end

  match "/board-position-codes/*path", %{ accept: [:json], layer: :api} do
    Proxy.forward conn, path, "http://cache/board-position-codes/"
  end

  match "/agents/*path", %{ accept: [:json], layer: :api} do
    Proxy.forward conn, path, "http://cache/agents/"
  end

  match "/agent-status-codes/*path", %{ accept: [:json], layer: :api} do
    Proxy.forward conn, path, "http://cache/agent-status-codes/"
  end

  match "/roles/*path", %{ accept: [:json], layer: :api} do
    Proxy.forward conn, path, "http://cache/roles/"
  end

  match "/organizations/*path", %{ accept: [:json], layer: :api} do
    Proxy.forward conn, path, "http://cache/organizations/"
  end

  match "/administrative-units/*path", %{ accept: [:json], layer: :api} do
    Proxy.forward conn, path, "http://cache/administrative-units/"
  end

  match "/administrative-unit-classification-codes/*path", %{ accept: [:json], layer: :api} do
    Proxy.forward conn, path, "http://cache/administrative-unit-classification-codes/"
  end

  match "/worship-administrative-units/*path", %{ accept: [:json], layer: :api} do
    Proxy.forward conn, path, "http://cache/worship-administrative-units/"
  end

  match "/worship-services/*path", %{ accept: [:json], layer: :api} do
    Proxy.forward conn, path, "http://resource/worship-services/" # DISABLE CACHING FOR NOW (BUG OP-1404)
  end

  match "/recognized-worship-types/*path", %{ accept: [:json], layer: :api} do
    Proxy.forward conn, path, "http://cache/recognized-worship-types/"
  end

  match "/central-worship-services/*path", %{ accept: [:json], layer: :api} do
    Proxy.forward conn, path, "http://cache/central-worship-services/"
  end

  match "/representative-bodies/*path", %{ accept: [:json], layer: :api} do
    Proxy.forward conn, path, "http://cache/representative-bodies/"
  end

  match "/governing-bodies/*path", %{ accept: [:json], layer: :api} do
    Proxy.forward conn, path, "http://cache/governing-bodies/"
  end

  match "/governing-body-classification-codes/*path", %{ accept: [:json], layer: :api} do
    Proxy.forward conn, path, "http://cache/governing-body-classification-codes/"
  end

  match "/local-involvements/*path", %{ accept: [:json], layer: :api} do
    Proxy.forward conn, path, "http://cache/local-involvements/"
  end

  match "/identifiers/*path", %{ accept: [:json], layer: :api} do
    Proxy.forward conn, path, "http://cache/identifiers/"
  end

  match "/structured-identifiers/*path", %{ accept: [:json], layer: :api} do
    Proxy.forward conn, path, "http://cache/structured-identifiers/"
  end

  match "/addresses/*path", %{ accept: [:json], layer: :api} do
    Proxy.forward conn, path, "http://cache/addresses/"
  end

  match "/sites/*path", %{ accept: [:json], layer: :api} do
    Proxy.forward conn, path, "http://cache/sites/"
  end

  match "/change-events/*path", %{ accept: [:json], layer: :api} do
    Proxy.forward conn, path, "http://cache/change-events/"
  end

  match "/change-event-types/*path", %{ accept: [:json], layer: :api} do
    Proxy.forward conn, path, "http://cache/change-event-types/"
  end

  match "/change-event-results/*path", %{ accept: [:json], layer: :api} do
    Proxy.forward conn, path, "http://cache/change-event-results/"
  end

  match "/organization-status-codes/*path", %{ accept: [:json], layer: :api} do
    Proxy.forward conn, path, "http://cache/organization-status-codes/"
  end

  match "/locations/*path", %{ accept: [:json], layer: :api} do
    Proxy.forward conn, path, "http://cache/locations/"
  end

  match "/involvement-types/*path", %{ accept: [:json], layer: :api} do
    Proxy.forward conn, path, "http://cache/involvement-types/"
  end

  match "/ministers/*path", %{ accept: [:json], layer: :api} do
    Proxy.forward conn, path, "http://cache/ministers/"
  end

  match "/minister-conditions/*path", %{ accept: [:json], layer: :api} do
    Proxy.forward conn, path, "http://cache/minister-conditions/"
  end

  match "/dates-of-birth/*path", %{ accept: [:json], layer: :api} do
    Proxy.forward conn, path, "http://cache/dates-of-birth/"
  end

  match "/nationalities/*path", %{ accept: [:json], layer: :api} do
    Proxy.forward conn, path, "http://cache/nationalities/"
  end

  match "/gender-codes/*path", %{ accept: [:json], layer: :api} do
    Proxy.forward conn, path, "http://cache/gender-codes/"
  end
  match "/concepts/*path", %{ accept: [:json], layer: :api} do
    Proxy.forward conn, path, "http://cache/concepts/"
  end

  match "/minister-positions/*path", %{ accept: [:json], layer: :api} do
    Proxy.forward conn, path, "http://cache/minister-positions/"
  end

  match "/minister-position-functions/*path", %{ accept: [:json], layer: :api} do
    Proxy.forward conn, path, "http://cache/minister-position-functions/"
  end

  match "/financing-codes/*path", %{ accept: [:json], layer: :api} do
    Proxy.forward conn, path, "http://cache/financing-codes/"
  end

  match "/minister-condition-criterions/*path", %{ accept: [:json], layer: :api} do
    Proxy.forward conn, path, "http://cache/minister-condition-criterions/"
  end

  match "/document-types-criterions/*path", %{ accept: [:json], layer: :api} do
    Proxy.forward conn, path, "http://cache/document-types-criterions/"
  end

  match "/site-types/*path", %{ accept: [:json], layer: :api} do
    Proxy.forward conn, path, "http://cache/site-types/"
  end

  match "/request-reasons/*path", %{ accept: [:json], layer: :api} do
    Proxy.forward conn, path, "http://cache/request-reasons/"
  end

  match "/decisions/*path", %{ accept: [:json], layer: :api} do
    Proxy.forward conn, path, "http://cache/decisions/"
  end

  match "/decision-activities/*path", %{ accept: [:json], layer: :api} do
    Proxy.forward conn, path, "http://cache/decision-activities/"
  end

  match "/request-reasons/*path", %{ accept: [:json], layer: :api} do
    Proxy.forward conn, path, "http://cache/request-reasons/"
  end

  ###############
  # DASHBOARD
  ###############
  match "/jobs/*path", %{accept: [:json], layer: :api} do
    Proxy.forward(conn, path, "http://cache/jobs/")
  end

  match "/tasks/*path", %{accept: [:json], layer: :api} do
    Proxy.forward(conn, path, "http://cache/tasks/")
  end

  match "/job-errors/*path", %{accept: [:json], layer: :api} do
    Proxy.forward(conn, path, "http://cache/job-errors/")
  end

  match "/data-containers/*path", %{accept: [:json], layer: :api} do
    Proxy.forward(conn, path, "http://cache/data-containers/")
  end

  match "/reports/*path", %{accept: [:json], layer: :api} do
    Proxy.forward(conn, path, "http://resource/reports/")
  end

  ###############
  # LOGIN
  ###############

  match "/accounts", %{ accept: [:json], layer: :api} do
    Proxy.forward conn, [], "http://resource/accounts/"
  end
  match "/accounts/*path", %{ accept: [:json], layer: :api} do
    Proxy.forward conn, path, "http://accountdetail/accounts/"
  end
  match "/groups/*path", %{ accept: [:json], layer: :api} do
    Proxy.forward conn, path, "http://resource/groups/"
  end


  match "/mock/sessions/*path", %{ accept: [:any], layer: :api} do
    Proxy.forward conn, path, "http://controle-login-proxied/sessions/"

   end

  match "/sessions/*path", %{ reverse_host: ["dashboard" | _rest] } do
    Proxy.forward conn, path, "http://dashboard-login/sessions/"
  end 

  match "/sessions/*path", %{ accept: [:any], layer: :api} do
    Proxy.forward conn, path, "http://controle-login/sessions/"
  end
 

  ###############################################################
  # API SERVICES
  ###############################################################

  get "/uri-info/*path", %{ layer: :api_services, accept: %{ json: true } } do
    forward conn, path, "http://uri-info/"
  end

  match "/person-information-requests/*path", %{ accept: [:any], layer: :api} do
    forward conn, path, "http://privacy/person-information-requests"
  end

  match "/person-information-ask/*path", %{ accept: [:any], layer: :api}  do
    forward conn, path, "http://privacy/person-information-ask/"
  end
  #################################################################
  # ERROR REPORT
  #################################################################

  match "/error-reports/*path", %{ layer: :api_services, accept: %{ json: true } } do
    forward conn, path, "http://error-report-service/error-reports/"
  end

  #################################################################
  # FILES
  #################################################################

  get "/files/:id/download", %{ accept: [:any], } do
    Proxy.forward conn, [], "http://file/files/" <> id <> "/download"
  end

  get "/files/*path" , %{ layer: :api_services, accept: %{ json: true } } do
    Proxy.forward conn, path, "http://cache/files/"
  end

  #################################################################
  # DCAT
  #################################################################

  get "/datasets/*path", %{ layer: :api_services, accept: %{ json: true } } do
    Proxy.forward conn, path, "http://cache/datasets/"
  end

  get "/distributions/*path", %{ layer: :api_services, accept: %{ json: true } } do
    Proxy.forward conn, path, "http://cache/distributions/"
  end

  ###############################################################
  # frontend layer
  ###############################################################

  get "/assets/*path",  %{ reverse_host: ["dashboard" | _rest], layer: :api }  do
    forward conn, path, "http://frontend-dashboard/assets/"
  end

  get "/@appuniversum/*path", %{ reverse_host: ["dashboard" | _rest], layer: :api} do
    forward conn, path, "http://frontend-dashboard/@appuniversum/"
  end

  match "/*_path", %{ reverse_host: ["dashboard" | _rest], layer: :api } do
    # *_path allows a path to be supplied, but will not yield
    # an error that we don't use the path variable.
    forward conn, [], "http://frontend-dashboard/index.html"
  end
  
  match "/assets/*path", %{ layer: :api } do
    Proxy.forward conn, path, "http://controle-frontend/assets/"
  end

  match "/@appuniversum/*path", %{ layer: :api } do
    Proxy.forward conn, path, "http://controle-frontend/@appuniversum/"
  end

  match "/*path", %{ accept: [:html], layer: :api } do
    Proxy.forward conn, [], "http://controle-frontend/index.html"
  end

  match "/*_path", %{ layer: :frontend } do
    Proxy.forward conn, [], "http://controle-frontend/index.html"
  end

  ###############################################################
  # sparql endpoint
  ###############################################################

  post "/sparql/*path", %{ layer: :api_services, accept: %{ sparql_json: true } } do
    forward conn, path, "http://db:8890/sparql/"
  end

  ###############################################################
  # errors
  ###############################################################

  match "/*_path", %{ accept: [:any], layer: :not_found} do
    send_resp( conn, 404, "{\"error\": {\"code\": 404}")
  end


end
