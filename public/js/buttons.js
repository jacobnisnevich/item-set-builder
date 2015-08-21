//scripts for Reset/Upload/Download/Save

$(document).ready(function() {
	if (localStorage.getItem('itemSetBuilderData') != null) {
        loadSessionData();
    }

    $("#reset-button").click(function() {
        resetItemBlocks();
        $("#item-search-box").val('');
        $('input[type=checkbox]').each(function() {
            $(this).prop('checked', false);
        });
        $(".item", $("#all-items")).show();
    });

    $("#upload-button").click(function() {
        $("#hidden-upload-button").click();
    });

    $("#download-button").click(function() {
        createJSONFile();
    });

    $("#set-form-name").on('input', function() {
        $("#download-button").attr('download', $("#set-form-name").val() + ".json")
    });

    $("#save-button").click(function() {
        saveSessionData();
    });
});

// Event handling functions
function handleFileUpload(files) {
    var file = files[0];

    var reader = new FileReader();
    reader.onload = function(event) {
        loadFromJSON(JSON.parse(event.target.result));
    };
    reader.readAsText(file);
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

    var itemBlockString = '<li><div class="item-block-buttons noselect"><i class="material-icons toggle-item-block-button text-grey text-darken-2">swap_vert</i><i class="material-icons edit-item-block-button">spellcheck</i></div>';
    itemBlockString = itemBlockString.concat('<div class="collapsible-header grey-text text-darken-2"><span class="item-block-name">' + name + '</span></div>');
    itemBlockString = itemBlockString.concat('<div class="collapsible-body grey lighten-3 grey-text text-darken-2"><div class="item-slots clearfix">');

    itemsArray.forEach(function(itemId, index) {
        itemsCount++;
        itemBlockString = itemBlockString.concat('<div class="item-slot slot-' + itemsCount + '" ondrop="drop(event)" ondragover="allowDrop(event)"><div class="item-count count-' + itemsCount + '">' + itemCountsArray[index] + '</div><img class="item" draggable="true" id="' + itemId + '" ondragstart="drag(event)" src="/images/items/' + itemId + '.png"></div>');
    });

    while (itemsCount < 10) {
        itemsCount++;    
        itemBlockString = itemBlockString.concat('<div class="item-slot slot-' + itemsCount + '" ondrop="drop(event)" ondragover="allowDrop(event)"><div class="item-count count-' + itemsCount + '">1</div></div>');
    }

    itemBlockString = itemBlockString.concat('</div></div></li>');
    $("#item-set-blocks").append(itemBlockString);
    $(".collapsible").collapsible({
        accordion: false
    });

    $(".item-count").filter(function () {
       return Number($(this).text()) > 1;
    }).show();
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
            "type": $("#item-set-blocks li").find(".item-block-name")[itemBlock].textContent
        };
        $.each($($("#item-set-blocks li")[itemBlock]).find("img"), function(item) {
            block.items.push({
                "id": $($($("#item-set-blocks li")[itemBlock]).find("img")[item]).attr("id"),
                "count": $($("#item-set-blocks li")[itemBlock]).find('.count-' + $($($("#item-set-blocks li")[itemBlock]).find("img")[item]).parent().attr('class').match(/slot-(\d+)/)[1]).text()
            });
        });
        obj.blocks.push(block);
    });

    return obj;
}