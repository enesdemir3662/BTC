let historyTable = [];
let profitLossTable = [];
let coins = [
  {
    name: "Bitcoin",
    symbol: "BTC",
    id: "",
    img: "",
    url: "",
    piece: "",
    latestPrice: "",
  },
  {
    name: "Etherium",
    symbol: "ETC",
    id: "",
    img: "",
    url: "",
    piece: "",
    latestPrice: "",
  },
  {
    name: "Doge",
    symbol: "DOGE",
    id: "",
    img: "",
    url: "",
    piece: "",
    latestPrice: "",
  },
  {
    name: "Busd",
    symbol: "BUSD",
    id: "",
    img: "",
    url: "",
    piece: "",
    latestPrice: "",
  },
  {
    name: "Bnb",
    symbol: "BNB",
    id: "",
    img: "",
    url: "",
    piece: "",
    latestPrice: "",
  },
  {
    name: "Ada",
    symbol: "ADA",
    id: "",
    img: "",
    url: "",
    piece: "",
    latestPrice: "",
  },
];
let variables = {
  controlId: 0,
  controlSellModal: false,
  priceInputChangeControl: false,
  pieceInputChangeControl: false,
};

//start loading
window.onload = function () {
  //  localStorage.clear();

  if (JSON.parse(localStorage.getItem("coins") != null)) {
    coins = JSON.parse(localStorage.getItem("coins"));
  }
  if (JSON.parse(localStorage.getItem("wallet-price") != null)) {
    document.getElementById("wallet-price").innerHTML = JSON.parse(
      localStorage.getItem("wallet-price")
    );
  }
  if (JSON.parse(localStorage.getItem("historyTable") != null)) {
    historyTable = JSON.parse(localStorage.getItem("historyTable"));
  }
  if (JSON.parse(localStorage.getItem("profitLossTable") != null)) {
    profitLossTable = JSON.parse(localStorage.getItem("profitLossTable"));
  }

  coins.forEach((val, ind) => {
    const home = document.createElement("option");
    const home_ = `${val.name}
    `;
    home.innerHTML = home_;
    document.getElementById("select-option").appendChild(home);
    home.setAttribute("value", `${ind}`);
  });
  document
    .getElementById("select-option")
    .setAttribute("onchange", "price_pull_data(value)");
  coins_url_img_id_add();
  home_page();
};

//add data
function coins_url_img_id_add() {
  coins.forEach((val, ind) => {
    val.url = `https://rest.coinapi.io/v1/exchangerate/${val.symbol}/USD?apikey=B5DE97E7-74E4-432F-8257-F34923CF5F87 `;
    val.img = `img/${val.symbol}.png`;
    val.id = ind + 1;
  });
}

//home loading
function home_page() {
  document.getElementById("home").classList.remove("d-none");
  document.getElementById("tables").classList.add("d-none");
  //6 dan fazla veri olursa for ile gelmemsini sağladım
  for (var i = 0; i < 6; i++) {
    document
      .getElementById(`card-${i + 1}-img`)
      .setAttribute("src", `${coins[i].img}`);
    document.getElementById(`card-${i + 1}-name`).innerHTML = coins[i].name;
    document.getElementById(`card-${i + 1}-price`).innerHTML =
      "<br>En Son Değer<br>" + coins[i].latestPrice;
    document.getElementById(`card-${i + 1}-piece`).innerHTML =
      coins[i].piece == "" ? 0 : coins[i].piece;
  }
  localStorage.setItem(`coins`, JSON.stringify(coins));
  localStorage.setItem(
    `wallet-price`,
    JSON.stringify(document.getElementById("wallet-price").innerHTML)
  );
  localStorage.setItem(`profitLossTable`, JSON.stringify(profitLossTable));
  localStorage.setItem(`historyTable`, JSON.stringify(historyTable));
}

//history and profit loss table add data
function history_and_profit_loss_page(page) {
  document.getElementById("tables").classList.remove("d-none");
  document.getElementById("home").classList.add("d-none");
  document.getElementById("mytable").innerHTML = "";
  let number;
  if (page == "profit_and_loss") {
    number = 1;
    document.getElementById("th-3").innerHTML = "Coin Satış Fiyat";
    document.getElementById("th-5").innerHTML = "Kâr Zarar";
  } else {
    number = 0;
    document.getElementById("th-3").innerHTML = "Kalan Para";
    document.getElementById("th-5").innerHTML = "Tür";
  }
  (number == 0 ? historyTable : profitLossTable).forEach((val, ind) => {
    const el = document.createElement("tr");
    const tdEl = `
      <td>${ind}</td>
      <td>${val.name}</td>
      <td>${val.buyPrice}</td>
      <td>${val.remainingMoney}</td>
      <td>${val.piece}</td>
      <td id="${ind}">${val.type}</td>
      `;
    (el.innerHTML = tdEl), document.getElementById("mytable").appendChild(el);
    if (page == "profit_and_loss") {
      if (parseFloat(val.type) > 0) {
        document.getElementById(`${ind}`).style.color = "green";
      } else if (parseFloat(val.type) < 0) {
        document.getElementById(`${ind}`).style.color = "red";
      } else {
        document.getElementById(`${ind}`).style.color = "white";
      }
    }
  });
}

//fetch
function price_pull_data(ind) {
  fetch(coins[ind].url)
    .then((response) => response.json())
    .then((responseJson) => {
      coins[ind].latestPrice = responseJson.rate;
      document.getElementById("coin-sell-price").value = responseJson.rate;
      variables.controlId = parseInt(ind);
    });
  // document.getElementById("coin-sell-price").value = 1
  // coins[ind].latestPrice = 1
  // variables.controlId = parseInt(ind)
}

//coin buy and sell
function buy_sell() {
  if (document.getElementById("select-option").value != -1) {
    if (
      variables.priceInputChangeControl == true ||
      variables.pieceInputChangeControl == true
    ) {
      price_pull_data(parseInt(variables.controlId));
      if (variables.controlSellModal == true) {
        variables.controlSellModal = false;
        let price_ =
          parseFloat(document.getElementById("wallet-price").innerHTML) +
          parseFloat(document.getElementById("coin-sell-price").value) *
            parseFloat(document.getElementById("coin-piece").value);
        if (
          parseFloat(coins[parseInt(variables.controlId)].piece) >=
          parseFloat(document.getElementById("coin-piece").value)
        ) {
          document.getElementById("wallet-price").innerHTML = price_;
          coins[parseInt(variables.controlId)].piece =
            (coins[parseInt(variables.controlId)].piece == ""
              ? 0
              : parseFloat(coins[parseInt(variables.controlId)].piece)) -
            parseFloat(document.getElementById("coin-piece").value);
          historyTable.push({
            name: `${coins[parseInt(variables.controlId)].name}`,
            buyPrice: `${parseFloat(
              document.getElementById("coin-sell-price").value
            )}`,
            remainingMoney: `${price_}`,
            piece: `${parseFloat(document.getElementById("coin-piece").value)}`,
            type: "Satış",
          });
          let NewList = { buy: [], sell: [] };
          historyTable.forEach((val, ind) => {
            if (
              val.type == "Satış" &&
              val.name == coins[parseInt(variables.controlId)].name
            ) {
              NewList.sell.push(ind);
            } else if (
              val.type == "Alış" &&
              val.name == coins[parseInt(variables.controlId)].name
            ) {
              NewList.buy.push(ind);
            }
          });
          profitLossTable.push({
            name: `${coins[parseInt(variables.controlId)].name}`,
            buyPrice: `${historyTable[NewList.buy.length - 1].buyPrice}`,
            remainingMoney: `${parseFloat(
              document.getElementById("coin-sell-price").value
            )}`,
            piece: `${parseFloat(document.getElementById("coin-piece").value)}`,
            type: `${
              parseFloat(document.getElementById("coin-sell-price").value) -
              parseFloat(historyTable[NewList.buy.length - 1].buyPrice)
            }`,
          });
          home_page();
        } else {
          alert("Elinizde istenilenden az coin mevcut!");
        }
      } else {
        let price_ =
          parseFloat(document.getElementById("wallet-price").innerHTML) -
          parseFloat(document.getElementById("coin-sell-price").value) *
            parseFloat(document.getElementById("coin-piece").value);
        if (price_ >= 0) {
          document.getElementById("wallet-price").innerHTML = price_;
          coins[parseInt(variables.controlId)].piece =
            (coins[parseInt(variables.controlId)].piece == ""
              ? 0
              : parseFloat(coins[parseInt(variables.controlId)].piece)) +
            parseFloat(document.getElementById("coin-piece").value);
          historyTable.push({
            name: `${coins[parseInt(variables.controlId)].name}`,
            buyPrice: `${document.getElementById("coin-sell-price").value}`,
            remainingMoney: `${price_}`,
            piece: `${parseFloat(document.getElementById("coin-piece").value)}`,
            type: "Alış",
          });
          home_page();
        } else {
          alert("Bakiyeniz Yetersiz.");
        }
      }
    } else {
      alert("Adet veya fiyat girin.");
    }
  } else {
    alert("Coin Seçiniz");
  }
}

//modal show
function modal(control) {
  variables.controlId = control;
  document.getElementById("coin-piece").readOnly = false;
  document.getElementById("coin-buy-price").readOnly = false;
  document.getElementById("coin-piece").value = "";
  document.getElementById("coin-buy-price").value = "";
  document.getElementById("select-option").value = -1;
  document.getElementById("coin-sell-price").value = "";

  if (control != 0) {
    document.getElementById("staticBackdropLabel").innerHTML = "COIN SATIM";
    document.getElementById("buy-coin").innerHTML = "Sat";
    document.getElementById("select-option").value = control - 1;
    price_pull_data(control - 1);
    variables.controlSellModal = true;
  } else {
    document.getElementById("buy-coin").innerHTML = "Satın Al";
    document.getElementById("staticBackdropLabel").innerHTML = "COIN ALIM";
  }

  var directory = new bootstrap.Modal(document.getElementById("exampleModal"), {
    keyboard: false,
  });
  directory.show();
}

//piece and price input change
function change_textbox(element) {
  let object = [
    document.getElementById("coin-piece"),
    document.getElementById("coin-buy-price"),
  ];
  if (document.getElementById("select-option").value == -1) {
    alert("Coin Seçiniz");
    object[0].value = "";
    object[1].value = "";
  } else {
    if (element == "piece") {
      if (object[0].value != "") {
        variables.pieceInputChangeControl = true;
        object[1].readOnly = true;
        object[1].value =
          parseFloat(document.getElementById("coin-sell-price").value) *
          parseFloat(object[0].value);
      } else {
        variables.pieceInputChangeControl = false;
        object[1].readOnly = false;
        object[1].value = "";
      }
    } else {
      if (object[1].value != "") {
        variables.priceInputChangeControl = true;
        object[0].readOnly = true;
        object[0].value =
          parseFloat(object[1].value) /
          parseFloat(document.getElementById("coin-sell-price").value);
      } else {
        variables.priceInputChangeControl = false;
        object[0].readOnly = false;
        object[0].value = "";
      }
    }
  }
}
