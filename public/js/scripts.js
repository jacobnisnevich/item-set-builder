$(document).ready(function() {
    Opentip.styles.leagueItems = {
        extends: "alert",
        stem: true,
        borderColor: "rgb(0, 204, 153)",
        borderWidth: 1,
        background: "rbga(0, 0, 0, 0.2)",
        borderRadius: 5,
        offset: [ 0, 0 ],
        tipJoint: "bottom left",
        stem: false
    };
    Opentip.defaultStyle = "leagueItems";

    $('#fileupload').fileupload({
        dataType: 'json',
        done: function (e, data) {
            $('#file-upload-text').html(data.result);
        }
    });

    $("#item-set-add-block-button").click(function() {
        $("#item-set-blocks").append('<li class="active"><div class="collapsible-header grey-text text-darken-2" contentEditable=true>New Item Block</div><div class="collapsible-body grey lighten-3 grey-text text-darken-2"><div class="item-slots clearfix"><div class="item-slot" ondrop="drop(event)" ondragover="allowDrop(event)"></div><div class="item-slot" ondrop="drop(event)" ondragover="allowDrop(event)"></div><div class="item-slot" ondrop="drop(event)" ondragover="allowDrop(event)"></div><div class="item-slot" ondrop="drop(event)" ondragover="allowDrop(event)"></div><div class="item-slot" ondrop="drop(event)" ondragover="allowDrop(event)"></div><div class="item-slot" ondrop="drop(event)" ondragover="allowDrop(event)"></div><div class="item-slot" ondrop="drop(event)" ondragover="allowDrop(event)"></div><div class="item-slot" ondrop="drop(event)" ondragover="allowDrop(event)"></div><div class="item-slot" ondrop="drop(event)" ondragover="allowDrop(event)"></div><div class="item-slot" ondrop="drop(event)" ondragover="allowDrop(event)"></div></div></div></li>');
        $(".collapsible").collapsible({
            accordion: false
        });
    });

    $.get("/getItems", function(data) {
        dataJSON = JSON.parse(data);
        for (var itemId in dataJSON) {
            if (dataJSON.hasOwnProperty(itemId)) {
                $("#all-items").append('<img draggable="true" ondragstart="drag(event)" id="' + itemId + '" class="item" src="/images/items/' + itemId + '.png" alt="' + dataJSON[itemId]['name'] + '"/>');
                new Opentip("#" + itemId, "<img src='/images/gold.png'>" + dataJSON[itemId]['gold']['total'] + "<br><br>" + dataJSON[itemId]['description'], dataJSON[itemId]['name'])
                dataJSON[itemId]['tags'].forEach(function(tag) {
                    $("#" + itemId).addClass(tag);
                });
            }
        }
    });

    $("#set-form-name").on('input', function() {
        $("#download-button").attr('download', $("#set-form-name").val() + ".json")
    });

    $("#download-button").click(function() {
        createJSONFile();
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

var data;

function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    ev.target.appendChild(document.getElementById(data).cloneNode(true));
}

function createJSONFile() {
    var obj = {
        "map": "any",
        "isGlobalForChampions": false,
        "associatedChampions": [],
        "title": $("#set-form-name").val(),
        "priority": false,
        "mode": "any",
        "isGlobalForMaps": true,
        "associatedMaps": [],
        "type": "custom",
        "sortrank": 1,
        "champion": "any",
        "blocks": []
    };
    $.each($("#item-set-blocks li"), function(itemBlock) {
        var block = {
            "items": [],
            "type": $("#item-set-blocks li").find(".collapsible-header")[0].textContent
        };
        $.each($($("#item-set-blocks li")[itemBlock]).find("img"), function(item) {
            block.items.push({
                "item": $($($("#item-set-blocks li")[itemBlock]).find("img")[item]).attr("id"),
                "count": "1"
            });
        });
        obj.blocks.push(block);
    });
    data = "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(obj));
    $("#download-button").attr('href', 'data:' + data);
}