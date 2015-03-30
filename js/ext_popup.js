$(document).ready(function ($) {

    $("#stext_setting_icon").off("click");
    $("#stext_setting_icon").on("click", function (e) {
        $("#stext_main_div").hide();
        $("#stext_setting_div").show();
        $("#stext_location_div").html("");
        $("#stext_more_details").hide();
    });

    $("#stext_close_setting").off("click");
    $("#stext_close_setting").on("click", function (e) {
        $("#stext_main_div").show();
        $("#stext_setting_div").hide();
        $("#stext_location_div").html("");
        $("#stext_more_details").hide();
    });

    $("#stext_back_1").off("click");
    $("#stext_back_1").on("click", function (e) {
        $("#stext_main_div").show();
        $("#stext_setting_div").hide();
        $("#stext_location_div").html("");
        $("#stext_more_details").hide();
    });

    $("#stext_search_btn").off("click");
    $("#stext_search_btn").on("click", function (e) {
        var locval = $.trim($("#stext_search").val());
        if (locval == "") {
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

    $("#stext_setting_div").hide();
    $("#stext_more_details").hide();
    $("#StockMainBody").block({
        message: '<span style="font-size:20px;font-family: lucida grande,tahoma,verdana,arial,sans-serif;">Loading ...</span></h1>',
    });
    setTimeout(function () {
        $("#stext_main_div").show();
        stockExtGetDetails(false);
    }, 1000);    
});

function wextSearchStock() {
    $("#stext_location_div").html("");
    $('<p>', {
        html: "<b>Searching.Please wait...</b>",
    }).appendTo("#stext_location_div");
    var searchurl = "http://d.yimg.com/aq/autoc?query=" + $.trim($("#stext_search").val()) + "&region=US&lang=en-US&callback=YAHOO.util.ScriptNodeDataSource.callbacks";
    var xhr = typeof XMLHttpRequest != 'undefined' ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
    xhr.open("GET", searchurl, true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            var result = xhr.responseText.replace("YAHOO.util.ScriptNodeDataSource.callbacks(", "");
            result = result.replace("})", "}]");
            result = result.substring(0, result.length - 1);
            result = JSON.parse(result);
            if (result != undefined && result.ResultSet != undefined && result.ResultSet.Result != undefined && result.ResultSet.Result.length > 0) {
                $("#stext_location_div").html("");
                var tbl = $("<table cellspacing=0>");

                $.each(result.ResultSet.Result, function (index, item) {
                    var tr = $("<tr>");

                    //Symbol td
                    var td = $("<td>");
                    td.text(item.symbol != null ? item.symbol : "n/a");
                    td.appendTo(tr);

                    //Name Td
                    var td = $("<td>");
                    td.text(item.name != null ? item.name : "n/a");
                    td.appendTo(tr);

                    //Type
                    var td = $("<td>");
                    td.html(
                        (item.typeDisp != null ? item.typeDisp : "n/a")
                        + "-" +
                        (item.exchDisp != null ? item.exchDisp : "n/a")
                        );

                    td.appendTo(tr);
                    tr.off("click").on("click", function () {
                        getNewStextDetails(item.symbol);
                    });
                    tr.appendTo(tbl);

                    var td = $("<td>");
                    var img = '<img src="image/add.png" title="Add" />';
                    td.html(img);
                    td.appendTo(tr);
                });
                tbl.appendTo("#stext_location_div");
            } else {
                $("#stext_location_div").html("");
                $('<p>', {
                    html: "<b>Not Found.</b>",
                }).appendTo("#stext_location_div");
            }
            $("#stext_search").val("");
        } else {
            $("#stext_location_div").html("");
            $('<p>', {
                html: "<b>Not Found.</b>",
            }).appendTo("#stext_location_div");
        }
    }
    xhr.send();
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
    stockExtGetDetails(true);
}

function createStextTable() {

    //Get Stock Details From Back Ground Process
    var stextMainArryCreateTable = new Array();
    if (localStorage.getItem('stext_details') == undefined) {
        stextMainArryCreateTable = new Array();
    } else {
        stextMainArryCreateTable = JSON.parse(localStorage.getItem('stext_details'));
    }

    //Stock Name Check
    var extStockNameCreateTable = new Array();
    if (localStorage.getItem('stext_name') == undefined) {
        extStockNameCreateTable = new Array();
    } else {
        extStockNameCreateTable = JSON.parse(localStorage.getItem('stext_name'));
    }

    //Update Counter
    $("#stext_counter").html(stextMainArryCreateTable.length + "/10");

    $("#StockMainTable").html("");
    if (extStockNameCreateTable.length == 0) {
        $("#stext_main_div").hide();
        $("#stext_setting_div").show();
        $("#stext_more_details").hide();
    }

    if (stextMainArryCreateTable.length == 0) {
        $("#StockMainBody").block({
            message: '<span style="font-size:20px;font-family: lucida grande,tahoma,verdana,arial,sans-serif;">No response from Yahoo server. Try again later.</span></h1>',
        });
    }

    if (stextMainArryCreateTable.length > 0) {
        var tr = $("<tr id='StockExtHeaderRow'>");

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
        td.text("");
        td.appendTo(tr);

        tr.appendTo("#StockMainTable");
    }

    $.each(stextMainArryCreateTable, function (index, item) {

        var tr = $("<tr>");

        //Symbol
        if (item.symbol != null) {
            var prdimg = '<img src="http://chart.finance.yahoo.com/t?s=' + item.symbol + '&amp;lang=en-US&amp;region=US&amp;width=300&amp;height=180" width="1" height="1">';
            $("#stext_preloaded_div").append(prdimg);
        }

        //Name Td
        var td = $("<td>");
        td.html(
            (item.Name != null ? item.Name : "n/a")
            +
            "<br/>"
            +
            "<b>"
            +
            (item.symbol != null ? item.symbol : "n/a")
            + " - " +
            (item.StockExchange != null ? item.StockExchange : "n/a")
            +
            "</b>"
            );
        td.appendTo(tr);

        //Last Trade
        var td = $("<td>");
        td.html(
            (item.LastTradeDate != null ? item.LastTradeDate : "n/a")
            + " " +
            (item.LastTradeTime != null ? item.LastTradeTime : "n/a")
            + "<br/> <b>" +
            (item.LastTradePriceOnly != null ? item.LastTradePriceOnly : "n/a")
            + "</b>"
            );
        td.appendTo(tr);

        //Change
        if (item.Change != null) {
            var img = ""
            var changeNum = parseFloat(item.Change);
            var td_class = "indexup";
            if (changeNum < 0) {
                img = '<img src="image/IndexDown.png" />';
                td_class = "indexdown";
            }
            else {
                img = '<img src="image/IndexUp.png" />';
                td_class = "indexup";
            }

            var Change = item.Change.replace("+", "");
            Change = Change.replace("-", "");

            var PercentChange = (item.PercentChange != null ? item.PercentChange.replace("+", "") : "n/a");
            PercentChange = PercentChange.replace("-", "");

            var td = $("<td>");
            td.html(img + Change + "<br/>(" + PercentChange + ")");
            td.addClass(td_class);
        } else {
            var td = $("<td>");
            td.html("n/a");
        }
        td.appendTo(tr);

        //Volume
        var td = $("<td>");
        td.html(item.Volume != null ? item.Volume.replace(/(\d)(?=(\d{3})+(?!\d))/g, "1,") : "n/a");
        td.appendTo(tr);

        //Delete
        var td = $("<td align='center'>");
        td.html('<span class="span_a" id="span_stext_info_' + index + '"><img src="image/info.png" title="More Info" /></span>&nbsp;<span class="span_a" id="span_delete_' + index + '"><img src="image/delete.png" title="Delete" /></span>');
        td.appendTo(tr);

        //Add To Main Table
        tr.appendTo("#StockMainTable");

        $("#span_delete_" + index).off("click");
        $("#span_delete_" + index).on("click", function (e) {
            deleteStck(item.symbol);
        });

        $("#span_stext_info_" + index).off("click");
        $("#span_stext_info_" + index).on("click", function (e) {
            showStextDetail(index);
        });
    });

    $("#StockMainBody").unblock();
}

function stockExtGetDetails(isNewExtPush) {
    $("#StockMainBody").block({
        message: '<span style="font-size:20px;font-family: lucida grande,tahoma,verdana,arial,sans-serif;">Loading ...</span></h1>',
    });
    $("#stext_preloaded_div").html("");

    //Stock Name Check
    var extStockName = ["FB", "GOOG", "EBAY", "YHOO", "AAPL"];
    if (localStorage.getItem('stext_name') == undefined) {
        localStorage.setItem('stext_name', JSON.stringify(extStockName));
    } else {
        extStockName = JSON.parse(localStorage.getItem('stext_name'));
    }

    //Get Stock Details From Back Ground Process
    var stextMainArry = new Array();
    if (localStorage.getItem('stext_details') == undefined) {
        stextMainArry = new Array();
    } else {
        stextMainArry = JSON.parse(localStorage.getItem('stext_details'));
    }

    //If BackGround Data Not Ther
    if (stextMainArry.length == 0) {
        var stockURL = "http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.quotes%20where%20symbol%20in%20('" + extStockName.join("'%2C%20'") + "')&env=http://datatables.org/alltables.env&format=json&diagnostics=true&callback=";
        $.ajax({
            type: 'GET',
            url: stockURL,
            dataType: 'json',
            success: function (data) {
                stextMainArry = new Array();

                if (data.query.count == 1) {
                    stextMainArry.push(data.query.results.quote);
                }

                if (data.query.count > 1) {
                    $.each(data.query.results.quote, function (index, item) {
                        stextMainArry.push(item);
                    });
                }

                localStorage.setItem('stext_details', JSON.stringify(stextMainArry));
                createStextTable();
            },
            error: function (e) {
                $("#StockMainBody").block({
                    message: '<span style="font-size:20px;font-family: lucida grande,tahoma,verdana,arial,sans-serif;">No response from Yahoo server. Try again later.</span></h1>',
                });
            }
        });
    } else if (stextMainArry.length > 0 && isNewExtPush == true){
        var stockURL = "http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.quotes%20where%20symbol%20in%20('" + extStockName.join("'%2C%20'") + "')&env=http://datatables.org/alltables.env&format=json&diagnostics=true&callback=";
        $.ajax({
            type: 'GET',
            url: stockURL,
            dataType: 'json',
            success: function (data) {
                stextMainArry = new Array();

                if (data.query.count == 1) {
                    stextMainArry.push(data.query.results.quote);
                }

                if (data.query.count > 1) {
                    $.each(data.query.results.quote, function (index, item) {
                        stextMainArry.push(item);
                    });
                }

                localStorage.setItem('stext_details', JSON.stringify(stextMainArry));
                createStextTable();
            },
            error: function (e) {
                $("#StockMainBody").block({
                    message: '<span style="font-size:20px;font-family: lucida grande,tahoma,verdana,arial,sans-serif;">No response from Yahoo server. Try again later.</span></h1>',
                });
            }
        });
    } else {
        createStextTable();
    }
}

function showStextDetail(pos) {
    //Get Stock Details From Back Ground Process
    var stextMainArryShowDetails = new Array();
    if (localStorage.getItem('stext_details') == undefined) {
        stextMainArryShowDetails = new Array();
    } else {
        stextMainArryShowDetails = JSON.parse(localStorage.getItem('stext_details'));
    }

    if (stextMainArryShowDetails.length == 0) {
        return;
    }

    $("#stext_main_div").hide();
    $("#stext_setting_div").hide();
    $("#stext_more_details").show();

    var stextdetail = stextMainArryShowDetails[pos];

    $("#stext_lt").html(
        ((stextdetail.LastTradeDate != null) ? stextdetail.LastTradeDate : "n/a")
        + " " +
        ((stextdetail.LastTradeTime != null) ? stextdetail.LastTradeTime : "n/a")
        + "<br/> <b>" +
        ((stextdetail.LastTradePriceOnly != null) ? stextdetail.LastTradePriceOnly : "n/a")
        + "</b>"
        );

    if (stextdetail.Change != null) {
        var img = ""
        var changeValSymbol = stextdetail.Change.substring(0, 1);        
        var td_class = "indexup";
        if (changeValSymbol == "+") {
            img = '<img src="image/IndexUp.png" />';
            td_class = "indexup";
        } else {
            img = '<img src="image/IndexDown.png" />';
            td_class = "indexdown";
        }

        var Change = stextdetail.Change.replace("+", "");
        Change = Change.replace("-", "");

        var PercentChange = (stextdetail.PercentChange != null ? stextdetail.PercentChange.replace("+", "") : "n/a");
        PercentChange = PercentChange.replace("-", "");

        $("#stext_chaneg").html(img + Change + "<br/>(" + PercentChange + ")");
        $("#stext_chaneg").removeClass("indexup");
        $("#stext_chaneg").removeClass("indexdown");
        $("#stext_chaneg").addClass(td_class);
    } else {
        $("#stext_chaneg").html("n/a");
        $("#stext_chaneg").removeClass("indexup");
        $("#stext_chaneg").removeClass("indexdown");
    }

    $("#stext_more_detail_title").html(
        (stextdetail.symbol != null ? stextdetail.symbol : "n/a")
        + ' - ' +
        (stextdetail.Name != null ? stextdetail.Name : "n/a")
        + ' - ' +
        (stextdetail.StockExchange != null ? stextdetail.StockExchange : "n/a")
        );

    $("#stext_prev_close").html(
        stextdetail.PreviousClose != null ? stextdetail.PreviousClose : "n/a"
        );

    $("#stext_day_range").html(
        stextdetail.DaysRange != null ? stextdetail.DaysRange : "n/a"
        );

    $("#stext_open").html(
        stextdetail.Open != null ? stextdetail.Open : "n/a"
        );

    $("#stext_52wk").html(
        stextdetail.YearRange != null ? stextdetail.YearRange : "n/a"
        );

    $("#stext_bid").html(
        stextdetail.BidRealtime != null ? stextdetail.BidRealtime : (stextdetail.Bid != null ? stextdetail.Bid : "n/a")
        );

    $("#stext_vol").html(
        stextdetail.Volume != null ? stextdetail.Volume.replace(/(\d)(?=(\d{3})+(?!\d))/g, "1,") : "n/a"
        );

    $("#stext_ask").html(
        stextdetail.AskRealtime != null ? stextdetail.AskRealtime : (stextdetail.Ask != null ? stextdetail.Ask : "n/a")
        );

    $("#stext_avgvol").html(
        stextdetail.AverageDailyVolume != null ? stextdetail.AverageDailyVolume.replace(/(\d)(?=(\d{3})+(?!\d))/g, "1,") : "n/a"
        );

    $("#stext_1te").html(
        stextdetail.OneyrTargetPrice != null ? stextdetail.OneyrTargetPrice : "n/a"
        );

    $("#stext_mcap").html(
        stextdetail.MarketCapitalization != null ? stextdetail.MarketCapitalization : "n/a"
        );
    
    $("#stext_beta").html(
        stextdetail.MarketCapitalization != null ? stextdetail.MarketCapitalization : "n/a"
        );

    $("#stext_chart").html("");
    $("#download_all").html("");
    if(stextdetail.symbol != null){
        $("#stext_chart").html(
            '<img src="http://chart.finance.yahoo.com/t?s='+stextdetail.symbol+'&amp;lang=en-US&amp;region=US&amp;width=300&amp;height=180" width="300" height="180">'
            );

        $("#download_all").html(
            "<a href='http://finance.yahoo.com/q;_ylt=AgdFA39Qay1LC9Zbu8E1oJaiuYdG;_ylu=X3oDMTBwdm1qNzVjBHNlYwNVSCAzIERlc2t0b3AgU2VhcmNoIDI-;_ylg=X3oDMTBucmRhZWhqBGxhbmcDZW4tVVMEcHQDcG1oBHRlc3QD;_ylv=3?uhb=uhb2&fr=uh3_finance_vert&type=2button&s=" + stextdetail.symbol + "' target='_blank'>More Details</a>"
            );
    }


}

function deleteStck(stckName) {
    var extStockNameDelete = JSON.parse(localStorage.getItem('stext_name'));
    var tempStockName = new Array();
    $.each(extStockNameDelete, function (index, item) {
        if (item != stckName) {
            tempStockName.push(item);
        }
    });
    localStorage.setItem('stext_name', JSON.stringify(tempStockName));

    var deleteStockDetailsArry = new Array();
    var deleteStockDetailsArryTemp = new Array();
    if (localStorage.getItem('stext_details') == undefined) {
        deleteStockDetailsArry = new Array();
    } else {
        deleteStockDetailsArry = JSON.parse(localStorage.getItem('stext_details'));
    }

    if (deleteStockDetailsArry.length > 0) {
        $.each(deleteStockDetailsArry, function (index, item) {
            if (item.symbol != stckName) {
                deleteStockDetailsArryTemp.push(item);
            }
        });        
    }

    localStorage.setItem('stext_details', JSON.stringify(deleteStockDetailsArryTemp));
    stockExtGetDetails(false);
}
