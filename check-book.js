var library = require("module-library")(require)

module.exports = library.export(
  "check-book",
  ["web-element", "basic-styles"],
  function(element, basicStyles) {


    function checkBook(label, balance) {
      return new Account(label, 0)
    }

    function prepareBridge(bridge) {
      if (bridge.remember("check-book")) { return }

      basicStyles.addTo(bridge)

      bridge.addToHead(element.stylesheet(cellStyle, emptyCell, cellOnMobile, lastCellOnMobile, emptyCellComputed, emptyLastCell, computedStyle, negativeStyle))

      bridge.addToHead("<title>Check book</title>")

      bridge.see("check-book")
    }

    function Account(label, balance) {
      this.label = label
      this.balance = balance
      this.ledger = []
      this.upcoming = []
    }

    Account.prototype.paid = 
      function(description, amount, ledgerDate) {
        this.ledger.push(this.renderRow(description, amount, ledgerDate))
      }

    Account.prototype.out = 
      function(description, amount) {
        this.upcoming.push(this.renderRow(description, amount))
      }

    Account.prototype.sendTo =   
      function(bridge) {
        prepareBridge(bridge)

        var page = element([
          element("h1", this.label),
          this.ledger,
          element("h1", "Out"),
          this.upcoming,
        ])

        page.appendStyles({"margin-bottom": "5em"})

        bridge.send(page)
      }

    Account.prototype.renderRow =
      function(description, amount, ledgerDate) {

        amount = parseMoney(amount)

        var row = element(".row", [
          label(description),
          input(toDollarString(amount), amount > 0),
        ])

        if (ledgerDate) {
          row.addChild(input(ledgerDate))
        } else {
          row.addChild(empty(input()))
        }

        this.balance += amount

        var computedBalance = element(".text-input.computed", toDollarString(this.balance))

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

      if (!cents) {
        throw new Error(cents+" is not pennies")
      } else {
        console.log("pennies:", cents)
      }

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

      console.log({cents: cents, dollars: dollars, remainder: remainder, negative: negative, string: string})

      if (negative) {
        string = "-"+string
      }

      return string
    }

    var computedStyle = element.style(".computed.text-input", {
      "color": "#7bbaf5",
    })

    var cellStyle = element.style(".text-input", {
      "display": "inline-block",
      "width": "5em",
      "border-bottom-color": "#aeecf3",
    })

    var lastCellOnMobile = element.template(
      ".row",
      element.style({
        "@media (max-width: 600px)": {
          "border-bottom": "2px dotted #ccc",
        }
      })
    )

    var cellOnMobile = element.template(
      ".text-input",
      element.style({
        "@media (max-width: 600px)": {
          "margin-top": "0",
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

    return checkBook
  }
)
