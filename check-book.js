var library = require("module-library")(require)

library.using(
  ["web-host", "web-element", "basic-styles"],
  function(host, element, basicStyles) {


    host.onRequest(function(getPartial) {
      var bridge = getPartial()
      checkbook(bridge)
    })


    function checkbook(bridge) {

      var balance = 0

      basicStyles.addTo(bridge)

      bridge.addToHead(element.stylesheet(cellStyle, emptyCell, cellOnMobile, lastCellOnMobile, emptyCellComputed, emptyLastCell, computedStyle, rowStyle))

      bridge.addToHead("<title>Check book</title>")
      
      var page = [
        paid([
          ["USAA balance", "$669.29", "2/3/2017"],
          ["Square", "$1,611.00", "2/4/2017"],
          ["Feburary rent", "-$2,085.00", "2/6/2017"],
          ["Mom", "$100.00", "2/6/2017"],
        ]),
        out([
          ["Testing administration", "$1,250.00"],
          ["Wes", "$290.00"],
        ]),
      ]

      bridge.send(page)

    }

    function out(array) {
      var rows = array.map(renderRow)

      rows.push(blankRow())

      rows.unshift(element("h1", "Out:"))

      return rows
    }

    function paid(array) {
      var rows = array.map(renderRow)

      rows.push(blankRow())

      rows.unshift(element("h1", "Paid:"))

      return rows
        
    }

    var balance = 0

    function renderRow(entry) {
      var description = entry[0]
      var amount = entry[1]
      var ledgerDate = entry[2]

      var row = element(".row", [
        label(description),
        input(amount),
      ])

      if (ledgerDate) {
        row.addChild(input(ledgerDate))
      } else {
        row.addChild(empty(input()))
      }

      balance += parseMoney(amount)

      var computedBalance = element(".text-input.computed", "$"+toDollarString(balance))

      row.addChild(computedBalance)

      return row
    }

    function parseMoney(string) {
      var trimmed = string.replace(/[^0-9.-]*/g, "")
      var amount = parseFloat(trimmed)
      var dollars = Math.floor(amount)
      var remainder = amount - dollars
      var cents = Math.floor(remainder*100)

      return dollars*100 + cents
    }

    function toDollarString(cents) {

      cents = Math.ceil(cents)

      var dollars = Math.floor(cents / 100)
      var remainder = cents - dollars*100
      if (remainder < 10) {
        remainder = "0"+remainder
      }

      return dollars+"."+remainder
    }

    var rowStyle = element.style(".row", {"margin-top": "0.5em"})

    var computedStyle = element.style(".computed.text-input", {
      "color": "#7bbaf5",
    })

    var cellStyle = element.style(".text-input", {
      "display": "inline-block",
      "width": "5em",
      "margin-bottom": "10px",
      "min-height": "1em",
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


    function input(text) {
      return element(".text-input", text||"")
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
