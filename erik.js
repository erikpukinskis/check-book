var library = require("module-library")(require)

library.using(
  ["web-host", "./"],
  function(host, checkBook) {

    host.onRequest(function(getPartial) {
      var bridge = getPartial()
      checkBook(bridge, ledger)
    })

    var erik = {balance: 0}

    function ledger(paid, out) {
      paid(erik, "January paid", [
        ["Checking account", "$669.29", "2/3/2017"],
        ["Square", "$1,611.00", "2/4/2017"],
        ["Feburary rent", "-$2,085.00", "2/6/2017"],
        ["Mom", "$100.00", "2/6/2017"],
        ["Teensy house gutter", "-7.63", "2/7/2017"],
        ["Sandwich & Coffee", "-17.18", "2/6/2017"],
        ["Lyft to Marie", "-9.29", "2/6/2016"],
      ])

      out(erik, [
        ["Landscaping", "$1,250.00"],
      ])
    }

  }
)
