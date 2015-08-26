var global = {
	setName: 'Unnamed_Item_Set',
	selectedMap: '',
	selectedMode: '',
	selectedChamp: ''
};
$(document).ready(function() {
    $("#item-set-add-block-button").click(function() {
        createItemBlock('New Item Block', [], []);        
        $(".collapsible").collapsible({
            accordion: false
        });
        $(this).parent().find(".item-block-name").last().click();
    });

    $(document).on('click', ".edit-item-block-button", function() {
        var blockName = $(this).parent().parent().find('.item-block-name');
        blockName.attr('contentEditable', true);
        blockName.focus();
        blockName.select();
    });

    $(document).on('click', ".toggle-item-block-button", function() {
        var blockHeader = $(this).parent().parent().find('.item-block-name');
        blockHeader.click();
    });

    $(document).on('click', ".close-item-block-button", function() {
        var block = $(this).parent().parent();
        block.slideUp('500');
        setTimeout(function() {
            block.remove();
        }, 500)
    });

    $(document).on('focusout', ".item-block-name", function() {
        $(this).attr('contentEditable', false);
    });

    $(this).find(".item-block-name").last().click();
});
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
        createJSONFile();
        $('#download-instructions-box').openModal();

        var fileName = 'Unnamed Item Set.json';
        if (global.setName) {
            fileName = global.setName + '.json';
        }

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
    var index_drop;  //index of dropped item
    var index_empty = 10; //index of first empty slot
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
            if (index_source > index_drop) { //source > destination
                if (ev.target.id == data) { //if same item
                    if (data == '2003' || data == '2004' || data == '2043' || data == '2044') { //if stackable
                        var countElement = $(ev.target).parent().find('.item-count');
                        var countNumber = Number($(ev.target).parent().find('.item-count').html());
                        if ((data == '2003' && countNumber < 5) || //health potion
                            (data == '2004' && countNumber < 5) || //mana potion
                            (data == '2043' && countNumber < 2) || //vision ward
                            (data == '2044' && countNumber < 3))   //stealth ward
                        { 
                            $(countElement).html(++countNumber);
                            $(countElement).show();
                            scootRight(ev, data, index_source, index_empty - 1, item_slots);
                            item_slots.eq(index_empty - 1).remove();
                        } else { //reached stack cap
                            scootRight(ev, data, index_drop, index_source, item_slots);
                        }
                    } //else swapping same item so do nothing
                }
                else { //not same item
                    scootLeft(ev, data, index_drop, index_source, item_slots);
                }
            }
            else { //source < destination
                //stack if item is stackable
                if (ev.target.id == data) {
                    if (data == '2003' || data == '2004' || data == '2043' || data == '2044') { //if stackable
                        var countElement = $(ev.target).parent().find('.item-count');
                        var countNumber = Number($(ev.target).parent().find('.item-count').html());
                        if ((data == '2003' && countNumber < 5) || //health potion
                            (data == '2004' && countNumber < 5) || //mana potion
                            (data == '2043' && countNumber < 2) || //vision ward
                            (data == '2044' && countNumber < 3))   //stealth ward
                        { 
                            $(countElement).html(++countNumber);
                            $(countElement).show();
                            scootRight(ev, data, index_source, index_empty - 1, item_slots);
                            item_slots.eq(index_empty - 1).remove();
                        } else { //reached stack cap
                            scootLeft(ev, data, index_source, index_drop, item_slots);
                        }
                    } //else swapping same item so do nothing
                }
                else { //not same item
                    scootRight(ev, data, index_source, index_drop, item_slots);
                }
            }
        }
        else { //empty, scoot
            scootRight(ev, data, index_source, index_empty - 1, item_slots);
        }
    }
    else { //came from all-items box
        //if slot has item
        if (slot_filled) {
            //stack if item is stackable
            if (ev.target.id == data) {
                var countElement = $(ev.target).parent().find('.item-count');
                var countNumber = Number($(ev.target).parent().find('.item-count').html());
                if ((data == '2003' && countNumber < 5) || //health potion
                    (data == '2004' && countNumber < 5) || //mana potion
                    (data == '2043' && countNumber < 2) || //vision ward
                    (data == '2044' && countNumber < 3))   //stealth ward
                { 
                    $(countElement).html(++countNumber);
                    $(countElement).show();
                } else if (!isFull()) { //not stackable item or reached stack cap
                    item_slots.eq(index_empty).append(document.getElementById(data).cloneNode(true));
                    scootLeft(ev,data, index_drop, index_empty, item_slots);
                }
            }
            else if (!isFull()) { //not same item
                item_slots.eq(index_empty).append(document.getElementById(data).cloneNode(true));
                scootLeft(ev,data, index_drop, index_empty, item_slots);
            }
        }
        else { //empty, append to end
            item_slots.eq(index_empty).append(document.getElementById(data).cloneNode(true));
        }
    }
}

//scoots items from index_end to index_start
function scootLeft(ev, data, index_start, index_end, item_slots) {
    for (var i = index_end - 1; i >= index_start; i--) {
        var leftCountElement = $(item_slots.eq(i).find('.item-count'));
        var leftCountNumber = Number(item_slots.eq(i).find('.item-count').html());
        var rightCountElement = $(item_slots.eq(i + 1).find('.item-count'))
        var rightCountNumber = Number(item_slots.eq(i + 1).find('.item-count').html());

        //swap count numbers
        var temp = leftCountNumber;
        $(leftCountElement).html(rightCountNumber);
        $(rightCountElement).html(temp);

        //swap hidden-ness
        var left_hidden = $(leftCountElement).is(":hidden");
        var right_hidden = $(rightCountElement).is(":hidden")
        left_hidden ? rightCountElement.hide() : rightCountElement.show();
        right_hidden ? leftCountElement.hide() : leftCountElement.show();

        //swap item images
        var left_item = item_slots.eq(i).find(".item").detach();
        var right_item = item_slots.eq(i + 1).find(".item").detach();
        item_slots.eq(i).append(right_item);
        item_slots.eq(i + 1).append(left_item);
    };
}

//scoots items from index_start to index_end
function scootRight(ev, data, index_start, index_end, item_slots) {
    for (var i = index_start; i < index_end; i++) {
        var leftCountElement = $(item_slots.eq(i + 1).find('.item-count'));
        var leftCountNumber = Number(item_slots.eq(i + 1).find('.item-count').html());
        var rightCountElement = $(item_slots.eq(i).find('.item-count'))
        var rightCountNumber = Number(item_slots.eq(i).find('.item-count').html());

        //swap count numbers
        var temp = leftCountNumber;
        $(leftCountElement).html(rightCountNumber);
        $(rightCountElement).html(temp);

        //swap hidden-ness
        var source_hidden = $(leftCountElement).is(":hidden");
        var destination_hidden = $(rightCountElement).is(":hidden")
        source_hidden ? rightCountElement.hide() : rightCountElement.show();
        destination_hidden ? leftCountElement.hide() : leftCountElement.show();

        //swap item images
        var leftItem = item_slots.eq(i).find(".item").detach();
        var rightItem = item_slots.eq(i + 1).find(".item").detach();
        item_slots.eq(i).append(rightItem);
        item_slots.eq(i + 1).append(leftItem);
    };
}

//returns true if item-slots are full
function isFull() {
    var returnval = true;
    $(".item-slots").children().each(function() {
        if ($(this).find('img').length == 0) {
            returnval = false;
            return false;
        }
    });
    return returnval;
}
$(document).ready(function() {
	Opentip.styles.leagueItems = {
        "extends": "alert",
        "borderColor": "rgb(182, 234, 187)",
        "borderWidth": 1,
        "background": [[0, "rgba(30, 30, 30, 0.9)"]],
        "borderRadius": 5,
        "offset": [ 0, 0 ],
        "tipJoint": "bottom left",
        "stem": false
    };
    Opentip.defaultStyle = "leagueItems";

    $(".button-collapse").sideNav();

    $(".filter-menu").draggable({
        handle: ".filter-form-title",
        containment: "#builder"
    });

    $('.filter-items-button').click(function() {
        toggleFilterMenu();
    });

    new Opentip("#champ-help-tooltip", "Pick one specific champion or none for a global item set");
    new Opentip("#map-help-tooltip", "Pick one specific map or none for a global item set");  

    $.get("/getItems", function(data) {
        dataJSON = JSON.parse(data);
        for (var itemId in dataJSON) {
            if (dataJSON.hasOwnProperty(itemId)) {
                $("#all-items").append('<img draggable="true" ondragstart="drag(event)" id="' + itemId + '" class="item" src="/images/items/' + itemId + '.png" alt="' + dataJSON[itemId]['name'] + '"/>');
                var tooltipDescription = "<img src='/images/gold.png'>&nbsp;" + dataJSON[itemId]['gold']['total'] + "<br><br>" + dataJSON[itemId]['description'];
                if (dataJSON[itemId]['efficiency'] != null) {
                    if (!dataJSON[itemId]['efficiency']['base']) {
                        tooltipDescription = tooltipDescription.concat("<br><hr>")
                        $.each(dataJSON[itemId]['efficiency']['cases'], function(index, item_case) {
                            var caseName = Object.keys(item_case)[0];
                            var efficiencyRatio = item_case[caseName]['Gold Efficiency Ratio'];
                            var efficiencyRatioNumber = parseFloat(item_case[caseName]['Gold Efficiency Ratio']);
                            var efficiencyClass;
                            if (efficiencyRatioNumber > 100) {
                                efficiencyClass = 'item-efficiency-positive';
                            } else if (efficiencyRatioNumber < 100) {
                                efficiencyClass = 'item-efficiency-negative';
                            } else {
                                efficiencyClass = 'item-efficiency-neutral';
                            }
                            tooltipDescription = tooltipDescription.concat("<b>Case: " + caseName + "</b><br>");
                            tooltipDescription = tooltipDescription.concat("Gold Efficiency Ratio: <b class=" + efficiencyClass + ">" + efficiencyRatio + "</b><br><br>");
                        });
                    } else {
                        tooltipDescription = tooltipDescription.concat("<br><hr>")
                        tooltipDescription = tooltipDescription.concat("<b>Case: Base Item</b><br>");
                        tooltipDescription = tooltipDescription.concat("Gold Efficiency Ratio: <b class='item-efficiency-neutral'>100%</b><br><br>");
                    }
                }
                new Opentip("#" + itemId, tooltipDescription, dataJSON[itemId]['name'])
                if (dataJSON[itemId]['tags']) {
                    dataJSON[itemId]['tags'].forEach(function(tag) {
                        $("#" + itemId).addClass(tag);
                    });
                }
            }
        }
    });

    $.get("/getChamps", function(data) {
        dataJSON = JSON.parse(data);
        sortedKeys = Object.keys(dataJSON).sort()
        sortedKeys.forEach(function(champName) {
            $(".champ-container").append('<div class="col s1 no-padding"><img class="champ-select" data-champ="' + dataJSON[champName]["key"] + '" id="' + dataJSON[champName]["key"] + '" src="images/champs/' + dataJSON[champName]["key"] + '.png" alt="' + dataJSON[champName]["name"] + '"></div>');
            new Opentip("#" + dataJSON[champName]["key"], dataJSON[champName]["name"]);              
        });
    });

    $(document).on('click', ".map-select", function() {
        if (global.selectedMap == '') {
            global.selectedMap = $(this).data('map');
            global.selectedMode = $(this).data('mode');
            $(this).addClass('map-selected');
        } else if (global.selectedMap == $(this).data('map')) {
            $('*[data-map="' + global.selectedMap + '"]').removeClass('map-selected');
            global.selectedMap = '';
            global.selectedMode = '';      
        } else {
            $('*[data-map="' + global.selectedMap + '"]').removeClass('map-selected');
            global.selectedMap = $(this).data('map');
            global.selectedMode = $(this).data('mode');
            $(this).addClass('map-selected');
        }
    });

    $(document).on('click', ".champ-select", function() {
        if (global.selectedChamp == '') {
            global.selectedChamp = $(this).data('champ');
            $(this).addClass('champ-selected');
        } else if (global.selectedChamp == $(this).data('champ')) {
            $('*[data-champ="' + global.selectedChamp + '"]').removeClass('champ-selected');
            global.selectedChamp = '';   
        } else {
            $('*[data-champ="' + global.selectedChamp + '"]').removeClass('champ-selected');
            global.selectedChamp = $(this).data('champ');
            $(this).addClass('champ-selected');
        }
    });

    $("#item-search-box").on('input', function() {
        //uncheck all checkboxes
        $('input[type=checkbox]').each(function() {
            $(this).prop('checked', false);
        });

        var filters = [
            "jungle",
            "lane",
            "consumable",
            "goldper",
            "trinket",
            "vision",
            "armor",
            "health",
            "healthregen",
            "spellblock",
            "attackspeed",
            "criticalStrike",
            "damage",
            "lifesteal",
            "cooldownreduction",
            "mana",
            "manaregen",
            "spelldamage",
            "boots",
            "nonbootsmovement"
        ];

        var parent_filters = {
            "tools": ["consumable", "goldper", "trinket vision"],
            "defense": ["armor", "health", "healthregen", "spellblock"],
            "attack": ["attackspeed", "criticalstrike", "damage", "lifesteal"],
            "magic": ["cooldownreduction", "mana", "manaregen", "spelldamage"],
            "movement": ["boots", "nonbootsmovement"]
        };

        var custom_filters = {
            "ap": "spelldamage",
            "ad": "damage",
            "as": "attackspeed",
            "attack speed": "attackspeed",
            "mr": "spellblock",
            "hp": "health",
            "cdr": "cooldownreduction"
        };

        var search = $("#item-search-box").val().toLowerCase();
        var all_items = $(".item", $("#all-items"));
        if (search != '') {
            all_items.hide();
            all_items.filter(function() {
                var className = false;
                var altName = this.alt.toLowerCase().indexOf(search) > -1;
                var item_class_name = this.className.toLowerCase();
                if (filters.indexOf(search) > -1) {
                    altName = false;
                    className = item_class_name.indexOf(" " + search) > -1;
                }
                else if (parent_filters[search]) {
                    altName = false;
                    $.each(parent_filters[search], function(index,object) {
                        if (item_class_name.indexOf(" " + object) > -1) {
                            className = true;
                            return false;
                        }
                    });
                }
                else if (custom_filters[search]) {
                    altName = false;
                    if (item_class_name.indexOf(" " + custom_filters[search]) > -1) {
                        className = true;
                    }
                }
                return (altName || className);
            }).show();
        } else {
            all_items.show();
        }
    });

    //on filter checkbox change
    $('input[type=checkbox]').change(function() {
        var all_items = $(".item", $("#all-items"));

        //refresh search if needed
        if ($("#item-search-box").val()) {
            $("#item-search-box").val('');
            all_items.show();
        }

        //in unchecking, show all items again to re-filter
        if (!this.checked) {all_items.show()}

        //calulate which fields are checked
        var filters = [];
        $('input[type=checkbox]').each(function() {
            if (this.checked) {
                filters.push(this.id)
            }
        });

        var all_items_checked = false;
        all_items.filter(function() {
            if (all_items_checked) {
                //uncheck all checkboxes
                $('input[type=checkbox]').each(function() {
                    $(this).prop('checked', false);
                });
                all_items.show();
                return false;
            }

            //if hidden already, just return
            if (this.hidden) {return false}

            var item = $(this);
            var returnval = false;
            filters.forEach(function(element) {
                if (all_items_checked || element == "All Items") {
                    all_items_checked = true;
                    returnval = false;
                    return false;
                }
                else if (element == "Starting Items") {
                    if (!item.hasClass("Jungle") &&
                        !item.hasClass("Lane")) {
                        returnval = true;
                        return false;
                    }
                }
                else if (element == "Tools") {
                    if (!item.hasClass("Consumable") &&
                        !item.hasClass("GoldPer") &&
                        !item.hasClass("Trinket Vision")) {
                        returnval = true;
                        return false;
                    }
                }
                else if (element == "Defense") {
                    if (!item.hasClass("Armor") &&
                        !item.hasClass("Health") &&
                        !item.hasClass("HealthRegen") &&
                        !item.hasClass("SpellBlock")) {
                        returnval = true;
                        return false;
                    }
                }
                else if (element == "Attack") {
                    if (!item.hasClass("AttackSpeed") &&
                        !item.hasClass("CriticalStrike") &&
                        !item.hasClass("Damage") &&
                        !item.hasClass("LifeSteal")) {
                        returnval = true;
                        return false;
                    }
                }
                else if (element == "Magic") {
                    if (!item.hasClass("CooldownReduction") &&
                        !item.hasClass("Mana") &&
                        !item.hasClass("ManaRegen") &&
                        !item.hasClass("SpellDamage")) {
                        returnval = true;
                        return false;
                    }
                }
                else if (element == "Movement") {
                    if (!item.hasClass("Boots") &&
                        !item.hasClass("NonbootsMovement")) {
                        returnval = true;
                        return false;
                    }
                }
                //if class doesn't have filter, hide item
                else if (!item.hasClass(element)) {
                    returnval = true;
                    return false;
                }
            });
            return returnval;
        }).hide();
    });
});

function toggleFilterMenu() {
    if ($('.filter-menu').is(':visible')) {
        $('.filter-menu').fadeOut('fast');
    } else {
        $('.filter-menu').fadeIn('fast');
    }
}
