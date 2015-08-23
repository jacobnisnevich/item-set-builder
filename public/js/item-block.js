$(document).ready(function() {
    $("#item-set-add-block-button").click(function() {
        createItemBlock('New Item Block', [], []);        
        $(".collapsible").collapsible({
            accordion: false
        });
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

    $(document).on('focusout', ".item-block-name", function() {
        $(this).attr('contentEditable', false);
    });
});