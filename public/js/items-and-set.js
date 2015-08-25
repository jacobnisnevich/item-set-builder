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

    $(".button-collapse").sideNav();

    $(".filter-menu").draggable({ handle: ".filter-form-title" });

    $('.filter-items-button').click(function() {
        toggleFilterMenu();
    });

    $.get("/getItems", function(data) {
        dataJSON = JSON.parse(data);
        for (var itemId in dataJSON) {
            if (dataJSON.hasOwnProperty(itemId)) {
                $("#all-items").append('<img draggable="true" ondragstart="drag(event)" id="' + itemId + '" class="item" src="/images/items/' + itemId + '.png" alt="' + dataJSON[itemId]['name'] + '"/>');
                new Opentip("#" + itemId, "<img src='/images/gold.png'>&nbsp;" + dataJSON[itemId]['gold']['total'] + "<br><br>" + dataJSON[itemId]['description'], dataJSON[itemId]['name'])
                if (dataJSON[itemId]['tags']) {
                    dataJSON[itemId]['tags'].forEach(function(tag) {
                        $("#" + itemId).addClass(tag);
                    });
                }
            }
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
            "nonbootsmovement",
        ]

        var parent_filters = {
            "tools": ["consumable", "goldper", "trinket vision"],
            "defense": ["armor", "health", "healthregen", "spellblock"],
            "attack": ["attackspeed", "criticalstrike", "damage", "lifesteal"],
            "magic": ["cooldownreduction", "mana", "manaregen", "spelldamage"],
            "movement": ["boots", "nonbootsmovement"],
        }

        var custom_filters = {
            "ap": "spelldamage",
            "ad": "damage",
            "as": "attackspeed",
            "attack speed": "attackspeed",
            "mr": "spellblock",
            "hp": "health",
            "cdr": "cooldownreduction",
        }

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
