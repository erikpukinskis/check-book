var library = require("module-library")(require)


library.using(
  ["web-host", "render-module", "./erik"],
  function(host, renderModule, eriksCheckbook) {

    host.onSite(function(site) {
      renderModule.prepareSite(site)
    })

    host.onRequest(function(getBridge) {
      eriksCheckbook(getBridge())

      renderModule(getBridge(), eriksCheckbook)
    })

  }
)