var library = require("module-library")(require)

module.exports = library.export(
  "eriks-payment-log",
  ["./check-book"],
  function(checkBook) {
    return function(bridge) {
      var erik = checkBook({balance: 0}, "January paid")

      erik.paid("Checking account", "$669.29", "2/3/2017")
      erik.paid("Square", "$1611.00", "2/4/2017")
      erik.paid("Feburary rent", "-$2085.00", "2/6/2017")
      erik.paid("Mom", "$100.00", "2/6/2017")
      erik.paid("Teensy house gutter", "-7.63", "2/7/2017")
      erik.paid("Sandwich & Coffee", "-17.18", "2/6/2017")
      erik.paid("Lyft to Marie", "-9.29", "2/6/2016")
      erik.paid("Landscaping", "$1250.00")

      erik.sendTo(bridge)
    }
  }
)