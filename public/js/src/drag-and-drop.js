function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    var isEmpty = false;

    ev.dataTransfer.setData("text", ev.target.id);
    ev.dataTransfer.setData("parent", ev.target.parentElement.className);

    global.source_item_slots = $(ev.target.parentElement).parent().children();

    global.source_item_slots.each(function() {
        if ($(this).find('img').length == 0) {
            global.source_index_empty = $(this).parent().children().index($(this));
            isEmpty = true;

            return false;
        }
    });
    
    if (!isEmpty) {
        global.source_index_empty = global.MAX_ITEMS - 1
    }

    if (ev.target.parentElement.className.indexOf("item-slots")) {
        ev.dataTransfer.setData("index", $(ev.target.parentElement).parent().children().index($(ev.target.parentElement)));
        ev.dataTransfer.setData("number", $(ev.target.parentElement).children().filter(".item-count").html());
    }
}

function drop(ev) {
    ev.preventDefault();
    // If dropping into trash
    if (ev.target.id == "trash") {
        if (global.source_item_slots.filter(".item-slot").length == 0) {// from all-items
            return;
        }

        var index = Number(ev.dataTransfer.getData("index"));

        scootRight(index, global.source_index_empty, global.source_item_slots);

        global.source_item_slots.eq(global.source_index_empty).children().remove("img");
        global.source_item_slots.eq(global.source_index_empty).find(".item-count").html(1);
        global.source_item_slots.eq(global.source_index_empty).find(".item-count").hide();
        return;
    }

    // Else dropping into item-set builder
    var data = ev.dataTransfer.getData("text");
    var slot_filled = $(ev.target.parentElement).not(".item-slot").length == 0;
    var item_slots;
    var index_drop;  // Index of dropped item
    var index_empty = global.MAX_ITEMS; // Index of first empty slot

    if (slot_filled) {
        item_slots = $(ev.target.parentElement).parent().children();
        index_drop = item_slots.index(ev.target.parentElement);

        item_slots.each(function() {
            if ($(this).find('img').length == 0) {
                index_empty = $(this).parent().children().index($(this));
                return false;
            }
        });
    } else {
        item_slots = $(ev.target.parentElement).children();
        index_drop = item_slots.index(ev.target);

        item_slots.each(function() {
            if ($(this).find('img').length == 0) {
                index_empty = $(this).parent().children().index($(this));
                return false;
            }
        });
    }

    
    // If dragging item from item-set block to same item-set block
    if (ev.dataTransfer.getData("parent").indexOf("item-slot") > -1 && item_slots.is(global.source_item_slots)) {
        var index_source = Number(ev.dataTransfer.getData("index"));

        if (slot_filled) {
            if (index_source > index_drop) { // Source > destination
                if (ev.target.id == data) { // If same item
                    if (data == '2003' || data == '2004' || data == '2043' || data == '2044') { // If stackable
                        var countElement = $(ev.target).parent().find('.item-count');
                        var countNumber = Number($(ev.target).parent().find('.item-count').html());
                        if ((data == '2003' && countNumber < 5) || // Health potion
                            (data == '2004' && countNumber < 5) || // Mana potion
                            (data == '2043' && countNumber < 2) || // Vision ward
                            (data == '2044' && countNumber < 3))   // Stealth ward
                        { 
                            $(countElement).html(++countNumber);
                            $(countElement).show();

                            scootRight(index_source, index_empty - 1, item_slots);

                            item_slots.eq(index_empty - 1).remove("img");
                            item_slots.eq(index_empty - 1).find(".item-count").html(1);
                            item_slots.eq(index_empty - 1).find(".item-count").hide();
                        } else { // Reached stack cap
                            scootRight(index_drop, index_source, item_slots);
                        }
                    } // Else swapping same item so do nothing
                } else { // Not same item
                    scootLeft(index_drop, index_source, item_slots);
                }
            } else { // Source < destination
                // Stack if item is stackable
                if (ev.target.id == data) {
                    if (data == '2003' || data == '2004' || data == '2043' || data == '2044') { // If stackable
                        var countElement = $(ev.target).parent().find('.item-count');
                        var countNumber = Number($(ev.target).parent().find('.item-count').html());
                        if ((data == '2003' && countNumber < 5) || // Health potion
                            (data == '2004' && countNumber < 5) || // Mana potion
                            (data == '2043' && countNumber < 2) || // Vision ward
                            (data == '2044' && countNumber < 3))   // Stealth ward
                        { 
                            $(countElement).html(++countNumber);
                            $(countElement).show();

                            scootRight(index_source, index_empty - 1, item_slots);

                            item_slots.eq(index_empty - 1).remove("img");
                            item_slots.eq(index_empty - 1).find(".item-count").html(1);
                            item_slots.eq(index_empty - 1).find(".item-count").hide();
                        } else { // Reached stack cap
                            scootLeft(index_source, index_drop, item_slots);
                        }
                    } // Else swapping same item so do nothing
                } else { // Not same item
                    scootRight(index_source, index_drop, item_slots);
                }
            }
        } else { // Empty, scoot
            scootRight(index_source, index_empty - 1, item_slots);
        }
    }
    else { // Came from all-items box or from another item-slot block
        var number = Number(ev.dataTransfer.getData("number"));
        // If dragging from one item-set block to another
        if (global.source_item_slots.filter(".item-slot").length > 0 && !global.source_item_slots.is(item_slots) && !isFull(item_slots)) {
            // Delete source item if source is another item-slot block
            var index = Number(ev.dataTransfer.getData("index"));

            scootRight(index, global.source_index_empty, global.source_item_slots);

            global.source_item_slots.eq(global.source_index_empty).children().remove("img");
            global.source_item_slots.eq(global.source_index_empty).find(".item-count").html(1);
            global.source_item_slots.eq(global.source_index_empty).find(".item-count").hide();
        }

        // If slot has item
        if (slot_filled) {
            // Stack if item is stackable
            if (ev.target.id == data) {
                var countElement = $(ev.target).parent().find('.item-count');
                var countNumber = Number($(ev.target).parent().find('.item-count').html());
                if ((data == '2003' && countNumber < 5) || // Health potion
                    (data == '2004' && countNumber < 5) || // Mana potion
                    (data == '2043' && countNumber < 2) || // Vision ward
                    (data == '2044' && countNumber < 3))   // Stealth ward
                { 
                    $(countElement).html(++countNumber);
                    $(countElement).show();
                } else if (!isFull(item_slots)) { // Not stackable item or reached stack cap
                    item_slots.eq(index_empty).append(document.getElementById(data).cloneNode(true));
                    item_slots.eq(index_empty).show();

                    if (!isNaN(number) && number > 1) {
                        item_slots.eq(index_empty).children().filter(".item-count").html(number);
                        item_slots.eq(index_empty).children().filter(".item-count").show();
                    }

                    scootLeft(index_drop, index_empty, item_slots);
                }
            } else if (!isFull(item_slots)) { // Not same item
                item_slots.eq(index_empty).append(document.getElementById(data).cloneNode(true));
                item_slots.eq(index_empty).show();

                if (!isNaN(number) && number > 1) {
                    item_slots.eq(index_empty).children().filter(".item-count").html(number);
                    item_slots.eq(index_empty).children().filter(".item-count").show();
                }

                scootLeft(index_drop, index_empty, item_slots);
            }
        } else { // Empty, append to end
            item_slots.eq(index_empty).append(document.getElementById(data).cloneNode(true));
            item_slots.eq(index_empty).show();

            if (!isNaN(number) && number > 1) {
                item_slots.eq(index_empty).children().filter(".item-count").html(number);
                item_slots.eq(index_empty).children().filter(".item-count").show();
            }
        }
    }
}

// Scoots items from index_end to index_start
function scootLeft(index_start, index_end, item_slots) {
    for (var i = index_end - 1; i >= index_start; i--) {
        var leftCountElement = $(item_slots.eq(i).find('.item-count'));
        var leftCountNumber = Number(item_slots.eq(i).find('.item-count').html());

        var rightCountElement = $(item_slots.eq(i + 1).find('.item-count'))
        var rightCountNumber = Number(item_slots.eq(i + 1).find('.item-count').html());

        // Swap count numbers
        var temp = leftCountNumber;
        $(leftCountElement).html(rightCountNumber);
        $(rightCountElement).html(temp);

        // Swap hidden-ness
        var left_hidden = $(leftCountElement).is(":hidden");
        var right_hidden = $(rightCountElement).is(":hidden");

        left_hidden ? rightCountElement.hide() : rightCountElement.show();
        right_hidden ? leftCountElement.hide() : leftCountElement.show();

        // Swap item images
        var left_item = item_slots.eq(i).find(".item").detach();
        var right_item = item_slots.eq(i + 1).find(".item").detach();

        item_slots.eq(i).append(right_item);
        item_slots.eq(i + 1).append(left_item);
    };
}

// Scoots items from index_start to index_end
function scootRight(index_start, index_end, item_slots) {
    for (var i = index_start; i < index_end; i++) {
        var leftCountElement = $(item_slots.eq(i + 1).find('.item-count'));
        var leftCountNumber = Number(item_slots.eq(i + 1).find('.item-count').html());
        var rightCountElement = $(item_slots.eq(i).find('.item-count'))
        var rightCountNumber = Number(item_slots.eq(i).find('.item-count').html());

        // Swap count numbers
        var temp = leftCountNumber;
        $(leftCountElement).html(rightCountNumber);
        $(rightCountElement).html(temp);

        // Swap hidden-ness
        var source_hidden = $(leftCountElement).is(":hidden");
        var destination_hidden = $(rightCountElement).is(":hidden")
        source_hidden ? rightCountElement.hide() : rightCountElement.show();
        destination_hidden ? leftCountElement.hide() : leftCountElement.show();

        // Swap item images
        var leftItem = item_slots.eq(i).find(".item").detach();
        var rightItem = item_slots.eq(i + 1).find(".item").detach();
        item_slots.eq(i).append(rightItem);
        item_slots.eq(i + 1).append(leftItem);
    };
}

// Returns true if item-slots are full
function isFull(itemSlots) {
    var returnval = true;
    itemSlots.each(function() {
        if ($(this).find('img').length == 0) {
            returnval = false;
            return false;
        }
    });
    return returnval;
}