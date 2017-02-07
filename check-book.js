var library = require("module-library")(require)

library.using(
  ["web-host", "web-element", "basic-styles"],
  function(host, element, basicStyles) {


    host.onRequest(function(getPartial) {
      var bridge = getPartial()
      checkbook(bridge)
    })


    function checkbook(bridge) {

      basicStyles.addTo(bridge)

      bridge.addToHead(element.stylesheet(cellStyle, emptyCell, cellOnMobile, lastCellOnMobile, emptyCellComputed, emptyLastCell, computedStyle, rowStyle, firstRowStyle, negativeStyle))

      bridge.addToHead("<title>Check book</title>")
      
      var erik = {balance: 0}

      var page = [
        paid(erik, "January paid", [
          ["USAA balance", "$669.29", "2/3/2017"],
          ["Square", "$1,611.00", "2/4/2017"],
          ["Feburary rent", "-$2,085.00", "2/6/2017"],
          ["Mom", "$100.00", "2/6/2017"],
          ["Teensy house gutter", "-7.63", "2/7/2017"],
          // ["Clipper", "-20", "2/6/2017"],
          ["Sandwich & Coffee", "-17.18", "2/6/2017"],
          ["Lyft to Marie", "-9.29", "2/6/2016"],
          ["Lyft to Marie", "-8.75", "1/31/2017"],
          ["Wes", "$291.61", "2/7/2017"],
        ]),
        out(erik, [
          ["Testing administration", "$1,250.00"],
        ]),
      ]

      bridge.send(page)

    }

    function out(account, array) {
      var rows = array.map(renderRow.bind(null, account))

      rows.push(blankRow())

      rows.unshift(element("h1", "Pending"))

      return rows
    }

    function paid(account, label, array) {
      var rows = array.map(renderRow.bind(null, account))

      rows.push(blankRow())

      rows.unshift(element("h1", label))

      return rows
        
    }

    function renderRow(account, entry) {
      var description = entry[0]
      var amount = parseMoney(entry[1])
      var ledgerDate = entry[2]

      var row = element(".row", [
        label(description),
        input(toDollarString(amount), amount > 0),
      ])

      if (ledgerDate) {
        row.addChild(input(ledgerDate))
      } else {
        row.addChild(empty(input()))
      }

      account.balance += amount

      var computedBalance = element(".text-input.computed", toDollarString(account.balance))

      row.addChild(computedBalance)

      return row
    }

    function parseMoney(string) {
      if (typeof string != "string") {
        throw new Error("Expected "+string+" to be a string representing money")
      }
      var trimmed = string.replace(/[^0-9.-]*/g, "")
      var amount = parseFloat(trimmed)
      var dollars = Math.floor(amount)
      var remainder = amount - dollars
      var cents = Math.floor(remainder*100)

      return dollars*100 + cents
    }

    function toDollarString(cents) {

      if (cents < 0) {
        var negative = true
        cents = Math.abs(cents)
      }

      cents = Math.ceil(cents)

      var dollars = Math.floor(cents / 100)
      var remainder = cents - dollars*100
      if (remainder < 10) {
        remainder = "0"+remainder
      }

      var string = "$"+dollars+"."+remainder

      if (negative) {
        string = "-"+string
      }

      return string
    }

    var rowStyle = element.style(".row", {"margin-top": "0.5em"})

    var firstRowStyle = element.style(".row:first-of-type", {"margin-top": "-9px"}) // same as .text-input padding-top

    var computedStyle = element.style(".computed.text-input", {
      "color": "#7bbaf5",
    })

    var cellStyle = element.style(".text-input", {
      "display": "inline-block",
      "width": "5em",
      "margin": "0",
      "border-bottom-color": "#aeecf3",
    })

    var lastCellOnMobile = element.template(
      ".text-input:last-of-type",
      element.style({
        "@media (max-width: 600px)": {
          "border-bottom-color": "#555",
        }
      })
    )

    var cellOnMobile = element.template(
      ".text-input",
      element.style({
        "@media (max-width: 600px)": {
          "border-bottom-color": "transparent",
        }
      })
    )

    var emptyCell = element.style(".empty-cell", {
      "background-color": "#e7fffc",
      "border-bottom-color": "transparent",
      "color": "transparent",
    })

    var emptyCellComputed = element.style(".text-input.empty-cell.computed", {
      "background-color": "#feffff",
      "border-bottom": "2px solid #aeecf3",
      "color": "transparent",
    })

    var emptyCellUnderline = element.style(".empty-cell-underline")

    var emptyLastCell = element.template(
      ".empty-cell:last-of-type",
      element.style({
        "@media (max-width: 600px)": {
          "border-bottom-color": "transparent",
        }
      })
    )

    var negativeStyle = element.style(".credit", {"color": "#66ef51"})


    function input(text, positive) {
      var el = element(".text-input", text||"")
      if (positive) {
        el.addSelector(".credit")
      }
      return el
    }

    function label(text) {
      var el = element(".text-input", text||"")
      el.appendStyles({
        "width": "10em",
      })
      return el
    }

    function blankRow() {
      return element(".row", [
        empty(label()),
        empty(input()),
        empty(input()),
        empty(element(".text-input.computed")),
      ])
    }

    function empty(el) {
      el.addSelector(".empty-cell")
      el.addChild(
        "--")
      el.appendStyles({"text-align": "center"})
      return el
    }

  }
)
