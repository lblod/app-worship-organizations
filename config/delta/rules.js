export default [
  {
    match: {
      graph: {
        type: "uri",
        value: "http://mu.semte.ch/graphs/organisatieportaal"
      }
    },
    callback: {
      url: 'http://resource/.mu/delta',
      method: 'POST'
    },
    options: {
      resourceFormat: "v0.0.1",
      gracePeriod: 250,
      ignoreFromSelf: true
    }
  }
]
