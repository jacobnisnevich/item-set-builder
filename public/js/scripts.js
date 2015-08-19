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

    if (localStorage.getItem('itemSetBuilderData') != null) {
        loadSessionData();
    }

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

    $("#reset-button").click(function() {
        resetItemBlocks();
    });

    $("#upload-button").click(function() {
        $("#hidden-upload-button").click();
    });

    $("#download-button").click(function() {
        createJSONFile();
    });

    $("#save-button").click(function() {
        saveSessionData();
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

// Session manipulation functions

function saveSessionData() {
    var obj = createJSONObject();

    localStorage.setItem('itemSetBuilderData', JSON.stringify(obj));
}

function loadSessionData() {
    var obj = JSON.parse(localStorage.getItem('itemSetBuilderData'));

    loadFromJSON(obj);
}

function clearSessionData() {
    localStorage.removeItem('itemSetBuilderData');
}

// Item block manipulation functions

function resetItemBlocks() {
    removeItemBlocks();
    createItemBlock('New Item Block', [], []);
}

function removeItemBlocks() {
    $('#item-set-blocks').empty();
}

function createItemBlock(name, itemsArray, itemCountsArray) {
    var itemsCount = 0;

    var itemBlockString = '<li class="active"><div class="collapsible-header grey-text text-darken-2" contentEditable=true>' + name + '</div>';
    itemBlockString = itemBlockString.concat('<div class="collapsible-body grey lighten-3 grey-text text-darken-2"><div class="item-slots clearfix">');

    itemsArray.forEach(function(itemId) {
        itemsCount++;
        itemBlockString = itemBlockString.concat('<div class="item-slot" ondrop="drop(event)" ondragover="allowDrop(event)"><img draggable="true" id="' + itemId + '" ondragstart="drag(event)" src="/images/items/' + itemId + '.png"></div>');
    })

    while (itemsCount < 10) {
        itemsCount++;
        itemBlockString = itemBlockString.concat('<div class="item-slot" ondrop="drop(event)" ondragover="allowDrop(event)"></div>');
    }

    itemBlockString = itemBlockString.concat('</div></div></li>');
    $("#item-set-blocks").append(itemBlockString);
    $(".collapsible").collapsible({
        accordion: false
    });
}

// JSON data manipulation functions

function loadFromJSON(obj) {
    var blockName;
    var itemsArray = [];
    var itemCountsArray = [];

    removeItemBlocks();

    obj.blocks.forEach(function(block) {
        blockName = block.type;
        itemsArray = [];
        itemCountsArray = [];

        block.items.forEach(function(item) {
            itemsArray.push(item.id);
            itemCountsArray.push(item.count);
        });

        createItemBlock(blockName, itemsArray, itemCountsArray);
    });
}

function createJSONFile() {
    var obj = createJSONObject();

    data = "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(obj));
    
    $("#download-button").attr('href', 'data:' + data);
    if ($("#set-form-name").val() == "") {
        $("#download-button").attr('download', "Unnamed_Item_Set.json");
    }
}

function createJSONObject() {
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
                "id": $($($("#item-set-blocks li")[itemBlock]).find("img")[item]).attr("id"),
                "count": "1"
            });
        });
        obj.blocks.push(block);
    });

    return obj;
}

// Event handling functions

function handleFileUpload(files) {
    var file = files[0];

    var reader = new FileReader();
    reader.onload = function(event) {
        loadFromJSON(JSON.parse(event.target.result));
    };
    reader.readAsText(file);
}
