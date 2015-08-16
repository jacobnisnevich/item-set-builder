$(document).ready(function() {
    Opentip.styles.leagueItems = {
        extends: "alert",
        stem: true,
        borderColor: "rgb(182, 234, 187)",
        borderWidth: 1,
        background: [[0, "rgba(30, 30, 30, 0.9)"]],
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
        $("#item-set-blocks").append('<li><div class="collapsible-header grey-text text-darken-2" contentEditable=true>New Item Block</div><div class="collapsible-body grey lighten-3 grey-text text-darken-2"><div class="item-slots clearfix"><div class="item-slot slot-1" ondrop="drop(event)" ondragover="allowDrop(event)"><div class="item-count count-1">1</div></div><div class="item-slot slot-2" ondrop="drop(event)" ondragover="allowDrop(event)"><div class="item-count count-2">1</div></div><div class="item-slot slot-3" ondrop="drop(event)" ondragover="allowDrop(event)"><div class="item-count count-3">1</div></div><div class="item-slot slot-4" ondrop="drop(event)" ondragover="allowDrop(event)"><div class="item-count count-4">1</div></div><div class="item-slot slot-5" ondrop="drop(event)" ondragover="allowDrop(event)"><div class="item-count count-5">1</div></div><div class="item-slot slot-6" ondrop="drop(event)" ondragover="allowDrop(event)"><div class="item-count count-6">1</div></div><div class="item-slot slot-7" ondrop="drop(event)" ondragover="allowDrop(event)"><div class="item-count count-7">1</div></div><div class="item-slot slot-8" ondrop="drop(event)" ondragover="allowDrop(event)"><div class="item-count count-8">1</div></div><div class="item-slot slot-9" ondrop="drop(event)" ondragover="allowDrop(event)"><div class="item-count count-9">1</div></div><div class="item-slot slot-10" ondrop="drop(event)" ondragover="allowDrop(event)"><div class="item-count count-10">1</div></div></div></div></li>');
        $(".collapsible").collapsible({
            accordion: false
        });
    });

    $.get("/getItems", function(data) {
        dataJSON = JSON.parse(data);
        for (var itemId in dataJSON) {
            if (dataJSON.hasOwnProperty(itemId)) {
                $("#all-items").append('<img draggable="true" ondragstart="drag(event)" id="' + itemId + '" class="item" src="/images/items/' + itemId + '.png" alt="' + dataJSON[itemId]['name'] + '"/>');
                new Opentip("#" + itemId, "<img src='/images/gold.png'>&nbsp;" + dataJSON[itemId]['gold']['total'] + "<br><br>" + dataJSON[itemId]['description'], dataJSON[itemId]['name'])
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
        var search = $("#item-search-box").val().toLowerCase();
        var all_items = $(".item", $("#all-items"));
        if (search != '') {
            all_items.hide();
            all_items.filter(function() {
                var alt = $(this)[0].alt.toLowerCase();
                return alt.indexOf(search) > -1;
            }).show();
        } else {
            all_items.show();
        }
    });
});

function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    //stack if item is stackable
    if (ev.target.id == data) {
        var countElement = $(ev.target).parent().find('.item-count');
        var countNumber = Number($(ev.target).parent().find('.item-count').html());
        if (data == '2003') { //health potion
            if (countNumber < 5) {
                $(countElement).html(++countNumber);
                if (countNumber > 1) {
                    $(countElement).show();
                }
            }
        } else if (data == '2004') { //mana potion
            if (countNumber < 5) {
                $(countElement).html(++countNumber);
                if (countNumber > 1) {
                    $(countElement).show();
                }
            }
        } else if (data == '2044') { //stealth ward
            if (countNumber < 3) {
                $(countElement).html(++countNumber);
                if (countNumber > 1) {
                    $(countElement).show();
                }
            }
        } else if (data == '2043') { //vision ward
            if (countNumber < 2) {
                $(countElement).html(++countNumber);
                if (countNumber > 1) {
                    $(countElement).show();
                }
            }
        }
    }
    //if item exists in slot already, scoot over all items
    else if ($($(ev.target).parent().not(".item-slot")[0]).length == 0) {
        //TODO: SCOOT THE SCOOT
        return;
    }
    else { //else append to item slot at next available item slot
        $(ev.target.parentElement).children().each(function() {
            if ($(this).find('img').length == 0) {
                $(this).append(document.getElementById(data).cloneNode(true));
                return false;
            }
        });
    }
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

    var data = "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(obj));
    
    $("#download-button").attr('href', 'data:' + data);
    if ($("#set-form-name").val() == "") {
        $("#download-button").attr('download', "Unnamed_Item_Set.json");
    }
}