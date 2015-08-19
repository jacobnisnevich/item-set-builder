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
    ev.dataTransfer.setData("parent", ev.target.parentElement.className);
    if (ev.target.parentElement.className.indexOf("item-slots")) {
        ev.dataTransfer.setData("index", $(ev.target.parentElement).parent().children().index($(ev.target.parentElement)));
    }
}

function drop(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    var slot_filled = $(ev.target.parentElement).not(".item-slot").length == 0;
    var item_slots;
    var index_drop;  // index of dropped item
    var index_empty; // index of first empty slot
    if(slot_filled) {
        item_slots = $(ev.target.parentElement).parent().children();
        index_drop = item_slots.index(ev.target.parentElement);
        item_slots.each(function() {
            if ($(this).find('img').length == 0) {
                index_empty = $(this).parent().children().index($(this));
                return false;
            }
        });
    }
    else {
        item_slots = $(ev.target.parentElement).children();
        index_drop = item_slots.index(ev.target);
        item_slots.each(function() {
            if ($(this).find('img').length == 0) {
                index_empty = $(this).parent().children().index($(this));
                return false;
            }
        });
    }

    //if dragging item from item-set block
    if (ev.dataTransfer.getData("parent").indexOf("item-slot") > -1) {
        var index_source = Number(ev.dataTransfer.getData("index"));
        if (slot_filled) {

        }
        else { //empty, scoot
            scootLeft(ev, data, index_source, index_empty - 1, item_slots);
        }
    }
    else { //came from all-items box
        //if slot has item
        if (slot_filled) {
            //stack if item is stackable
            if (ev.target.id == data) {
                var countElement = $(ev.target).parent().find('.item-count');
                var countNumber = Number($(ev.target).parent().find('.item-count').html());
                if (data == '2003' && countNumber < 5) { //health potion
                    $(countElement).html(++countNumber);
                    $(countElement).show();
                } else if (data == '2004' && countNumber < 5) { //mana potion
                    $(countElement).html(++countNumber);
                    $(countElement).show();
                } else if (data == '2044' && countNumber < 3) { //stealth ward
                    $(countElement).html(++countNumber);
                    $(countElement).show();
                } else if (data == '2043' && countNumber < 2) { //vision ward
                    $(countElement).html(++countNumber);
                    $(countElement).show();
                } else { //not stackable item or reached stack cap
                    scootRight(ev,data, index_drop, index_empty, item_slots);
                }
            }
            else { //not same item
                scootRight(ev,data, index_drop, index_empty, item_slots);
            }
        }
        else { //not filled, append to end
            $(ev.target.parentElement).children().each(function() {
                if ($(this).find('img').length == 0) {
                    $(this).append(document.getElementById(data).cloneNode(true));
                    return false;
                }
            });
        }
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

//scoots items from index_start to index_end and places item at index_start
function scootRight(ev, data, index_start, index_end, item_slots) {
    for (var i = index_end - 1; i >= index_start; i--, index_end--) {
        var sourceCountElement = $(item_slots.eq(i).find('.item-count'));
        var sourceCountNumber = Number(item_slots.eq(i).find('.item-count').html());
        var destinationCountElement = $(item_slots.eq(index_end).find('.item-count'))
        var destiantionCountNumber = Number(item_slots.eq(index_end).find('.item-count').html());

        //swap count numbers
        var temp = sourceCountNumber;
        $(sourceCountElement).html(destiantionCountNumber);
        $(destinationCountElement).html(temp);

        //swap hidden-ness
        $(sourceCountElement).is(":hidden") ? destinationCountElement.hide() : destinationCountElement.show();
        $(destinationCountElement).is(":hidden") ? sourceCountElement.hide() : sourceCountElement.show();

        //swap item images
        var item = item_slots.eq(i).find(".item").detach();
        item_slots.eq(index_end).append(item);
    };

    //finally, put item in slot
    item_slots.eq(index_end).append(document.getElementById(data).cloneNode(true));
    item_slots.eq(index_end).find('.item-count').hide();
}

function scootLeft(ev,data, index_start, index_end, item_slots) {
    for (var i = index_start; i < index_end; i++, index_start++) {
        var sourceCountElement = $(item_slots.eq(index_start).find('.item-count'));
        var sourceCountNumber = Number(item_slots.eq(index_start).find('.item-count').html());
        var destinationCountElement = $(item_slots.eq(i).find('.item-count'))
        var destiantionCountNumber = Number(item_slots.eq(i).find('.item-count').html());

        //swap count numbers
        var temp = sourceCountNumber;
        $(sourceCountElement).html(destiantionCountNumber);
        $(destinationCountElement).html(temp);

        //swap hidden-ness
        $(sourceCountElement).is(":hidden") ? destinationCountElement.hide() : destinationCountElement.show;
        $(destinationCountElement).is(":hidden") ? sourceCountElement.hide() : sourceCountElement.show();

        //swap item images
        var sourceItem = item_slots.eq(i).find(".item").detach();
        var draggedItem = item_slots.eq(i + 1).find(".item").detach();
        item_slots.eq(i).append(draggedItem);
        item_slots.eq(i + 1).append(sourceItem);
    };
}
