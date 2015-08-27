//scripts for Reset/Upload/Download/Save

$(document).ready(function() {
	if (localStorage.getItem('itemSetBuilderData') != null && localStorage.getItem('itemSetBuilderData') != '') {
        loadSessionData();
    }

    $("#reset-button").click(function() {
        resetItemBlocks();
        resetSetInfo();
        $("#item-search-box").val('');
        $('input[type=checkbox]').each(function() {
            $(this).prop('checked', false);
        });
        $(".item", $("#all-items")).show();
        $(".item-block-name").click();
    });

    $("#upload-button").click(function() {
        $("#hidden-upload-button").click();
    });

    $("#download-button").click(function() {
        var fileName = 'Unnamed Item Set.json';
        if (global.setName) {
            fileName = global.setName + '.json';
            var returnval = false;
            $.each(global.sortedKeys, function() {
                if (global.setName == this) {
                    alert("DOH!");
                    returnval = true;
                    return false;
                }
            });
            if (returnval) {return}
        }

        createJSONFile();
        $('#download-instructions-box').openModal();

        if (global.selectedChamp) {
            $("#champ-set-instructions").show();
            $("#global-set-instructions").hide();
            $("#champKey").text(global.selectedChamp);
            $(".fileName").text(fileName);
        } else {
            $("#global-set-instructions").show();
            $("#champ-set-instructions").hide();
            $(".fileName").text(fileName);
        }
    });

    $("#set-form-name").on('input', function() {
        global.setName = $("#set-form-name").val();
        $("#download-button").attr('download', global.setName + ".json")
    });

    $("#save-button").click(function() {
        saveSessionData();
    });

    $("#summary-button").click(function() {
        $('#set-summary-box').openModal();

        $('.summary-progress').show();
        $('.summary-content').hide();

        $.post('/setSummary', createJSONObject(), function(data) {
            dataJSON = JSON.parse(data);

            $('.summary-title').text(dataJSON.title);

            $('.summary-total-cost').text(dataJSON.totalCost);
            $('.summary-total-worth-lower').text(dataJSON.totalWorthLower);
            $('.summary-total-worth-upper').text(dataJSON.totalWorthUpper);
            $('.summary-total-efficiency-lower').text((Number(dataJSON.totalEfficiencyLower) * 100).toFixed(2) + '%');
            $('.summary-total-efficiency-upper').text((Number(dataJSON.totalEfficiencyUpper) * 100).toFixed(2) + '%');

            $(".summary-total-efficiency-lower").removeClass("item-efficiency-positive item-efficiency-negative item-efficiency-neutral");
            $(".summary-total-efficiency-upper").removeClass("item-efficiency-positive item-efficiency-negative item-efficiency-neutral");

            if (dataJSON.totalEfficiencyLower > 1) {
                $('.summary-total-efficiency-lower').addClass('item-efficiency-positive');
            } else if (dataJSON.totalEfficiencyLower < 1) {
                $('.summary-total-efficiency-lower').addClass('item-efficiency-negative');
            } else {
                $('.summary-total-efficiency-lower').addClass('item-efficiency-neutral');
            }

            if (dataJSON.totalEfficiencyUpper > 1) {
                $('.summary-total-efficiency-upper').addClass('item-efficiency-positive');
            } else if (dataJSON.totalEfficiencyUpper < 1) {
                $('.summary-total-efficiency-upper').addClass('item-efficiency-negative');
            } else {
                $('.summary-total-efficiency-upper').addClass('item-efficiency-neutral');
            }

            var yValues = [];
            var xValues = [];

            $.each(dataJSON.tagDistribution, function(index, object) {
                yValues.push(index.replace(/([a-z])([A-Z])/g, '$1 $2'));
                xValues.push(object);
            });

            var chartData = {
                "type": "bar",
                "background-color": "#9e9e9e",
                "scale-x": {
                    "values": yValues,
                    "items-overlap": true,
                    "item": {
                        "font-angle": -45,
                        "auto-align": true
                    }
                },
                "plotarea":{
                    "y": 20
                },
                "series": [
                    { 
                        "values": xValues,
                        "background-color": "#757575"
                    }
                ]
            }

            zingchart.render({ 
                id:'summary-tags-chart',
                data: chartData,
                height: 500,
                width: $('#set-summary-box').width() - 50
            });


            $('.summary-progress').hide();
            $('.summary-content').show();
        });
    })

    $("#about-button").click(function() {
        $('#help-about-box').openModal();
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

function resetSetInfo() {
    $('#set-form-name').val('');
    global.setName = 'Unnamed_Item_Set';

    $('.map-selected').removeClass('map-selected');
    global.selectedMap = '';
    global.selectedMode = '';

    $('.champ-selected').removeClass('map-selected');
    global.selectedChamp = '';
}

function removeItemBlocks() {
    $('#item-set-blocks').empty();
}

function createItemBlock(name, itemsArray, itemCountsArray) {
    var itemsCount = 0;

    var itemBlockString = '<li><div class="item-block-buttons noselect"><i class="material-icons toggle-item-block-button text-grey text-darken-2">swap_vert</i><i class="material-icons edit-item-block-button">spellcheck</i></div><div class="item-block-close-button noselect"><i class="material-icons close-item-block-button text-grey text-darken-2">clear</i></div>';
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

    global = {
        setName: obj.title,
        selectedMap: obj.map,
        selectedMode: obj.mode,
        selectedChamp: ''
    };

    $('#set-form-name').val(global.setName);
    $('*[data-map="' + global.selectedMap + '"]').addClass('map-selected');

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

    $(".item-block-name").click();
}

function createJSONFile() {
    var obj = createJSONObject();

    data = "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(obj));
    
    $("#download-button").attr('href', 'data:' + data);
    if (global.setName) {
        $("#download-button").attr('download', global.setName + ".json");
    } else {
        $("#download-button").attr('download', "Unnamed Item Set.json");
    }
}

function createJSONObject() {
    var mapChoice;
    if (global.selectedMap == '') {
        mapChoice = 'any'
    } else {
        mapChoice = global.selectedMap;
    }

    var modeChoice;
    if (global.selectedMode == '') {
        modeChoice = 'any'
    } else {
        modeChoice = global.selectedMode;
    }

    var obj = {
        "title": global.setName,        
        "type": 'custom',
        "map": mapChoice,
        "mode": modeChoice,
        "priority": false,
        "sortrank": 0,
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