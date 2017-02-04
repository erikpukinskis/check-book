var library = require("module-library")(require)

library.using(
  ["web-host", "web-element", "basic-styles"],
  function(host, element, basicStyles) {

    host.onRequest(function(getPartial) {
      var bridge = getPartial()
      checkbook(bridge)
    })

    function checkbook(bridge) {
      var page = [
        element("h1", "Paid:"),
        element(".row", [
          label("USAA balance"),
          input("$669.29"),
          input("$669.29"),
          input("2/3/2017"),
        ]),
        element(".row", [
          label("Square"),
          input("$1,611.00"),
          input("$2,280.29"),
          input("2/4/2017"),
        ]),
        element(".row", [
          label("Feburary rent"),
          input("-$2,085.00"),
          input("$195.29"),
          input("2/6/2017"),
        ]),
        element("h1", "Out:"),
        element(".row", [
          label("Testing administration"),
          input("$1,250.00"),
          input("$1,445.29 "),
        ]),
        element(".row", [
          label("Wes"),
          input("$291.00"),
          input("$1,736.29 "),
        ]),
      ]

      basicStyles.addTo(bridge)

      var cellStyle = element.style(".text-input", {
        "display": "inline-block",
        "width": "5em",
        "margin-bottom": "10px",
      })

      bridge.addToHead(element.stylesheet(cellStyle))

      bridge.send(page)
    }

    function input(text) {
      return element(".text-input", text)
    }

    function label(text) {
      var el = element(".text-input", text)
      el.appendStyles({
        "width": "10em",
      })
      return el
    }

  }
)
