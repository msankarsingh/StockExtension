$(document).ready(function ($) {
    GetStockExtDetails();
    setInterval(function () {
        GetStockExtDetails();
    }, 1200000);
});

function GetStockExtDetails() {

    //Default Stock Names
    var extStockNameBack = ["FB", "GOOG", "EBAY", "YHOO", "AAPL"];
    if (localStorage.getItem('stext_name') == undefined) {
        localStorage.setItem('stext_name', JSON.stringify(extStockNameBack));
    } else {
        extStockNameBack = JSON.parse(localStorage.getItem('stext_name'));
    }    

    //Get Stock Details From Yahoo Server
    var stextBackMainArry = new Array();
    var stockURL = "http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.quotes%20where%20symbol%20in%20('" + extStockNameBack.join("'%2C%20'") + "')&env=http://datatables.org/alltables.env&format=json&diagnostics=true&callback=";
    $.ajax({
        type: 'GET',
        url: stockURL,
        dataType: 'json',
        success: function (data) {

            if (data.query.count == 1) {
                stextBackMainArry.push(data.query.results.quote);
            }

            if (data.query.count > 1) {
                $.each(data.query.results.quote, function (index, item) {
                    stextBackMainArry.push(item);
                });
            }

            localStorage.setItem('stext_details', JSON.stringify(stextBackMainArry));
        }
    });
}
