$(document).ready(function() {
    $("#item-set-add-block-button").click(function() {
        $("#item-set-blocks").append('<li><div class="collapsible-header grey-text text-darken-2" contentEditable=true>New Item Block</div><div class="collapsible-body grey lighten-3 grey-text text-darken-2"><p>Lorem ipsum dolor sit amet.</p></div></li>');
        $(".collapsible").collapsible({
            accordion: false
        });
    });

    $.get("/getItems", function(data) {
        dataJSON = JSON.parse(data);
        for (var itemId in dataJSON) {
            if (dataJSON.hasOwnProperty(itemId)) {
                $("#all-items").append('<img id="' + itemId + '" class="item" src="/images/items/' + itemId + '.png" alt="' + dataJSON[itemId]['name'] + '"/>')
                dataJSON[itemId]['tags'].forEach(function(tag) {
                    $("#" + itemId).addClass(tag);
                });
            }
        }
    });

    $("#item-search-box").on('input', function() {
        if ($("#item-search-box").val() != '') {
            $(".item").not("[alt*='" + $("#item-search-box").val() + "']").hide();
            $(".item[alt*='" + $("#item-search-box").val() + "']").show();
        } else {
            $(".item").show();
        }
    });
});