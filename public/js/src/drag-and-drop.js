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