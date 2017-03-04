var library = require("module-library")(require)


library.using(
  ["web-host", "edit-source", "./test-check-book"],
  function(host, editSource, testCheckBook) {

    host.onSite(function(site) {
      editSource.prepareSite(site, library)
    })

    host.onRequest(function(getBridge) {
      var bridge = getBridge()
      editSource.prepareBridge(bridge)
      testCheckBook(bridge)
    })

  }
)