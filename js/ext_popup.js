var stextMainArry = new Array();
$(document).ready(function ($) {
    $("#stext_main_div").show();
    $("#stext_setting_div").hide();

    stockExtGetDetails();

    $("#stext_setting_icon").off("click");
    $("#stext_setting_icon").on("click", function (e) {
        $("#stext_main_div").hide();
        $("#stext_setting_div").show();
        $("#stext_location_div").html("");
    });

    $("#stext_close_setting").off("click");
    $("#stext_close_setting").on("click", function (e) {
        $("#stext_main_div").show();
        $("#stext_setting_div").hide();
        $("#stext_location_div").html("");
    });

    $("#stext_search_btn").off("click");
    $("#stext_search_btn").on("click", function (e) {
        var locval = $.trim($("#stext_search").val());
        if (locval == "") {
            http://openweathermap.org/login
                $("#stext_search").css("border", "1px solid red");
        } else {
            $("#stext_search").css("border", "1px solid #000000");
            wextSearchStock();
        }
    });

    $("#stext_search").off("keypress");
    $("#stext_search").on("keypress", function (e) {
        $("#stext_search").css("border", "1px solid #000000");
        if (e.which == 13) {
            var locval = $.trim($("#stext_search").val());
            if (locval == "") {
                $("#stext_search").css("border", "1px solid red");
            } else {
                $("#stext_search").css("border", "1px solid #000000");
                wextSearchStock();
            }
        }
    });
});

function wextSearchStock() {
    $("#stext_location_div").html("");
    $('<p>', {
        html: "<b>Searching.Please wait...</b>",
    }).appendTo("#stext_location_div");
    //var searchurl = "http://d.yimg.com/aq/autoc?query=&lang=en-US&callback=YAHOO.util.ScriptNodeDataSource.callbacks"
    var searchurl = "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%3D'http%3A%2F%2Fd.yimg.com%2Faq%2Fautoc%3Fquery%3D" + $.trim($("#stext_search").val()) + "%26region%3DUS%26lang%3Den-US%26callback%3DYAHOO.util.ScriptNodeDataSource.callbacks'&format=json&diagnostics=true&callback=";
    $.ajax({
        type: 'GET',
        url: searchurl,
        dataType: 'json',
        success: function (data) {
            var result = data.query.results.body.p.replace("YAHOO.util.ScriptNodeDataSource.callbacks(", "");
            result = result.replace("})", "}]");
            result = result.substring(0, result.length - 1);
            result = JSON.parse(result);
            if (result != undefined && result.ResultSet != undefined) {
                $("#stext_location_div").html("");
                var tbl = $("<table cellspacing=0>");

                $.each(result.ResultSet.Result, function (index, item) {

                    var tr = $("<tr>");

                    //Symbol td
                    var td = $("<td>");
                    td.text(item.symbol);
                    td.appendTo(tr);

                    //Name Td
                    var td = $("<td>");
                    td.text(item.name);
                    td.appendTo(tr);

                    //Last Trade
                    var td = $("<td>");
                    td.html(item.typeDisp + "-" + item.exchDisp);
                    td.appendTo(tr);
                    tr.off("click").on("click", function () {
                        getNewStextDetails(item.symbol);
                    });
                    tr.appendTo(tbl);
                });

                tbl.appendTo("#stext_location_div");
            } else {
                $("#stext_location_div").html("");
                $('<p>', {
                    html: "<b>Not Found.</b>",
                }).appendTo("#stext_location_div");
            }
            $("#stext_search").val("");
        }
    });
}

function getNewStextDetails(stname) {
    var tempstockName = new Array();
    tempstockName.push(stname);

    var extStockName = JSON.parse(localStorage.getItem('stext_name'));
    $.each(extStockName, function (index, item) {
        if (tempstockName.length < 10) {
            if (item != stname) {
                tempstockName.push(item);
            }
        }
    });
    localStorage.setItem('stext_name', JSON.stringify(tempstockName));
    $("#stext_main_div").show();
    $("#stext_setting_div").hide();
    stockExtGetDetails();
}

function stockExtGetDetails() {
    $("#StockMainBody").block({
        message: '<span style="font-size:20px;font-family: lucida grande,tahoma,verdana,arial,sans-serif;">Please Wait...</span></h1>',
    });

    var extStockName = ["FB", "GOOG", "EBAY", "YHOO", "AAPL", "INTC", "F", "C", "BAC", "AMD"];
    if (localStorage.getItem('stext_name') == undefined) {
        localStorage.setItem('stext_name', JSON.stringify(extStockName));
    } else {
        extStockName = JSON.parse(localStorage.getItem('stext_name'));
    }
    stextMainArry = new Array();
    var stockURL = "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.quotes%20where%20symbol%20in%20(" + "%22" + extStockName.join("%22%2C%22") + "%22" + ")%0A%09%09&format=json&diagnostics=true&env=http%3A%2F%2Fdatatables.org%2Falltables.env&callback";
    $.ajax({
        type: 'GET',
        url: stockURL,
        dataType: 'json',
        success: function (data) {
            if (data.query.count == 1) {
                stextMainArry.push(data.query.results.quote);
            }

            if (data.query.count >= 1) {
                $.each(data.query.results.quote, function (index, item) {
                    stextMainArry.push(item);
                });
            }

            $("#StockMainTable").html("");
            if (stextMainArry.length > 0) {
                var tr = $("<tr id='StockExtHeaderRow'>");
                var td = $("<th>");
                td.text("Symbol");
                td.appendTo(tr);

                var td = $("<th>");
                td.text("Name");
                td.appendTo(tr);

                var td = $("<th>");
                td.text("Last Trade");
                td.appendTo(tr);

                var td = $("<th>");
                td.text("Change");
                td.appendTo(tr);

                var td = $("<th>");
                td.text("Volume");
                td.appendTo(tr);

                var td = $("<th>");
                td.text("Options");
                td.appendTo(tr);

                tr.appendTo("#StockMainTable");
            }

            $.each(stextMainArry, function (index, item) {

                var tr = $("<tr>");

                //Symbol td
                var td = $("<td>");
                td.text(item.symbol);
                td.appendTo(tr);

                //Name Td
                var td = $("<td>");
                td.text(item.Name);
                td.appendTo(tr);

                //Last Trade
                var td = $("<td>");
                if (item.LastTradeWithTime != null) {
                    td.html(item.LastTradeWithTime.replace("-", "<br/><b>$</b>"));
                } else {
                    td.html("n/a");
                }
                
                td.appendTo(tr);

                //Change
                var changeValSymbol = item.Change.substring(0, 1);
                var img = ""
                var td_class = "indexup";
                if (changeValSymbol == "+") {
                    img = '<img src="image/IndexUp.png" />';
                } else {
                    img = '<img src="image/IndexDown.png" />';
                    td_class = "indexdown";
                }

                var Change = item.Change.replace("+", "");
                Change = Change.replace("-", "");

                var PercentChange = item.PercentChange.replace("+", "");
                PercentChange = PercentChange.replace("-", "");

                var td = $("<td>");
                td.html(img + Change + "<br/>(" + PercentChange + ")");
                td.addClass(td_class);
                td.appendTo(tr);

                //Volume
                var td = $("<td>");
                if(item.Volume != null){
                    td.html(item.Volume.replace(/(\d)(?=(\d{3})+(?!\d))/g, "1,"));
                } else {
                    td.html("n/a");
                }
                td.appendTo(tr);

                //Volume
                var td = $("<td>");
                td.html('<span class="span_a" id="span_delete_' + item.symbol + '" data_stk_name="' + item.symbol + '">delete</span>');
                td.appendTo(tr);

                tr.appendTo("#StockMainTable");

                $("#span_delete_" + item.symbol).off("click");
                $("#span_delete_" + item.symbol).on("click", function (e) {
                    deleteStck($(this).attr("data_stk_name"));
                });

            });

            $("#StockMainBody").unblock();
        },
        error: function (e) {
            console.log(e.message);
        }
    });
}

function deleteStck(stckName) {
    var extStockName = JSON.parse(localStorage.getItem('stext_name'));
    var tempStockName = new Array();
    $.each(extStockName, function (index, item) {
        if (item != stckName) {
            tempStockName.push(item);
        }
    });
    localStorage.setItem('stext_name', JSON.stringify(tempStockName));
    stockExtGetDetails();
}
