let currentPage = 1;
const pagesContainer = $(".pages").children("ul");

$(document).ready(() => {
  sendQuery(currentPage);
  buildPageNavigation(pagesContainer);
});

let indexEl = {
  'id': 0, 'title': 1, 'title_full': 2, 'rating': 3, 'inn': 4, 'kpp': 5, 'address': 6, 'address_legal': 8,
  'anno_short': 9, 'anno': 10, 'phone': 11, 'fax': 12, 'site': 13,
  'type_name': 14, 'seller_type_name': 15, 'ogrn': 16
};

function insertData(data) {
  let tableContainer = $(".container-table").find("tbody");
  tableContainer.empty();
  data.forEach(function(item, index, array) {
    let row = insertTableRow(tableContainer);
    let countryHtml = "";

    for(var name in item) {
      if(item[name])
        switch(name) {
          case 'country_id':
            row.children("td").eq(7).html("ID" + item[name]);
            break;
          case 'country_name':
            countryHtml = row.children("td").eq(7).html();
            if(countryHtml.length > 0) countryHtml += ": ";
            row.children("td").eq(7).html(countryHtml + item[name]);
            break;
          default:
            if(name in indexEl) {
              row.children("td").eq(indexEl[name]).html(item[name]);
            }
            break;
        }
    }
  });
}

function insertTableRow(el) {
  let row = $("<tr></tr>");
  row.appendTo(el);
  let cellCounter = $(".container-table").find("thead").children("tr").children("th").length;
  while (cellCounter) {
    row.append("<td></td>");
    cellCounter--;
  }
  return row;
}

function buildPageNavigation(pagesContainer) {
  pagesContainer.empty();
  let limit = 9, currentPageTemp = currentPage > 4 ? currentPage - 4 : 1;

  navQuery();
  function navQuery() {
    $.ajax({
      url: "http://www.tender.pro/api/_info.companylist_by_set.json",
      dataType: "json",
      data: {
        '_key': '6dea68e23416b21d201571d4c9263a57',
        'set_type_id': 7,
        'set_id': 2,
        'max_rows': 10,
        'offset': 10 * (currentPageTemp - 1)
      }
    }).done(function(data) {
      if('success' in data)
        if(data.result.data.length > 0) {
          let currentClass = (currentPage==currentPageTemp) ? 'current' :'';
          let el = $('<li><a href="#' + currentPageTemp + '" class="' + currentClass + '">' + currentPageTemp + "</a></li>");
          pagesContainer.append(el);
          currentPageTemp++;
          limit--;
          if(limit > 0) {
            navQuery();
          }
          el.bind("click", (e) => {
            e.preventDefault();
            currentPage = $(e.target).text();
            sendQuery($(e.target).text());
            buildPageNavigation(pagesContainer);
          });
        }
    });
  }
}

function sendQuery(page) {
  $.ajax({
    url: "http://www.tender.pro/api/_info.companylist_by_set.json",
    dataType: "json",
    data: {
      '_key': '6dea68e23416b21d201571d4c9263a57',
      'set_type_id': 7,
      'set_id': 2,
      'max_rows': 10,
      'offset': 10 * (page - 1)
    }
  }).done(function(data) {
    if('success' in data)
      if(data.result.data.length > 0)
        insertData(data.result.data);
  });
}
