var global={setName:"Unnamed_Item_Set",selectedMap:"",selectedMode:"",selectedChamp:"",source_item_slots:"",source_index_empty:"",MAX_ITEMS:10,sortedKeys:"",mapNames:["SR","TT","DM","ASC","PG"]};
$(document).ready(function(){$("#item-set-add-block-button").click(function(){createItemBlock("New Item Block",[],[]);$(".collapsible").collapsible({accordion:!1});$(this).parent().find(".item-block-name").last().click()});$(document).on("click",".edit-item-block-button",function(){var a=$(this).parent().parent().find(".item-block-name");a.attr("contentEditable",!0);a.focus();a.select()});$(document).on("click",".toggle-item-block-button",function(){$(this).parent().parent().find(".item-block-name").click()});
$(document).on("click",".close-item-block-button",function(){var a=$(this).parent().parent();a.slideUp("500");setTimeout(function(){a.remove()},500)});$(document).on("focusout",".item-block-name",function(){$(this).attr("contentEditable",!1)});$(this).find(".item-block-name").last().click()});
$(document).ready(function(){null!=localStorage.getItem("itemSetBuilderData")&&""!=localStorage.getItem("itemSetBuilderData")&&loadSessionData();$("#reset-button").click(function(){resetItemBlocks();resetSetInfo();$("#item-search-box").val("");$("input[type=checkbox]").each(function(){$(this).prop("checked",!1)});$(".item",$("#all-items")).show();$(".item-block-name").click()});$("#upload-button").click(function(){$("#hidden-upload-button").click()});$("#download-button").click(function(){isValidFileName("Unnamed Item Set.json")&&
(createJSONFile(),$("#download-instructions-box").openModal(),global.selectedChamp?($("#champ-set-instructions").show(),$("#global-set-instructions").hide(),$("#champKey").text(global.selectedChamp)):($("#global-set-instructions").show(),$("#champ-set-instructions").hide()),$(".fileName").text("Unnamed Item Set.json"))});$("#set-form-name").on("input",function(){global.setName=$("#set-form-name").val();$("#download-button").attr("download",global.setName+".json")});$("#save-button").click(function(){saveSessionData()});
$("#summary-button").click(function(){$("#set-summary-box").openModal();$(".summary-progress").show();$(".summary-content").hide();$.post("/setSummary",createJSONObject(),function(a){dataJSON=JSON.parse(a);$(".summary-title").text(dataJSON.title);$(".summary-total-cost").text(dataJSON.totalCost);$(".summary-total-worth-lower").text(dataJSON.totalWorthLower);$(".summary-total-worth-upper").text(dataJSON.totalWorthUpper);$(".summary-total-efficiency-lower").text((100*Number(dataJSON.totalEfficiencyLower)).toFixed(2)+
"%");$(".summary-total-efficiency-upper").text((100*Number(dataJSON.totalEfficiencyUpper)).toFixed(2)+"%");$(".summary-total-efficiency-lower").removeClass("item-efficiency-positive item-efficiency-negative item-efficiency-neutral");$(".summary-total-efficiency-upper").removeClass("item-efficiency-positive item-efficiency-negative item-efficiency-neutral");1<dataJSON.totalEfficiencyLower?$(".summary-total-efficiency-lower").addClass("item-efficiency-positive"):1>dataJSON.totalEfficiencyLower?$(".summary-total-efficiency-lower").addClass("item-efficiency-negative"):
$(".summary-total-efficiency-lower").addClass("item-efficiency-neutral");1<dataJSON.totalEfficiencyUpper?$(".summary-total-efficiency-upper").addClass("item-efficiency-positive"):1>dataJSON.totalEfficiencyUpper?$(".summary-total-efficiency-upper").addClass("item-efficiency-negative"):$(".summary-total-efficiency-upper").addClass("item-efficiency-neutral");var d=[],b=[];$.each(dataJSON.tagDistribution,function(a,c){d.push(a.replace(/([a-z])([A-Z])/g,"$1 $2"));b.push(c)});zingchart.render({id:"summary-tags-chart",
data:{type:"bar","background-color":"#9e9e9e","scale-x":{values:d,"items-overlap":!0,item:{"font-angle":-45,"auto-align":!0}},plotarea:{y:20},series:[{values:b,"background-color":"#757575"}]},height:500,width:$("#set-summary-box").width()-50});$(".summary-progress").hide();$(".summary-content").show()})});$("#about-button").click(function(){$("#help-about-box").openModal()})});
function isValidFileName(a){var d=!0;global.setName&&global.sortedKeys.forEach(function(a){d&&global.mapNames.forEach(function(e){global.setName==a+e&&(Materialize.toast("<span>Oh no, it seems you have a reserved set name! Find out more info <span><a href='https://developer.riotgames.com/docs/item-sets' target='_blank'>here<a>",4E3),d=!1)})});return d}function handleFileUpload(a){a=a[0];var d=new FileReader;d.onload=function(a){loadFromJSON(JSON.parse(a.target.result))};d.readAsText(a)}
function saveSessionData(){var a=createJSONObject();localStorage.setItem("itemSetBuilderData",JSON.stringify(a))}function loadSessionData(){var a=JSON.parse(localStorage.getItem("itemSetBuilderData"));loadFromJSON(a)}function clearSessionData(){localStorage.removeItem("itemSetBuilderData")}function resetItemBlocks(){removeItemBlocks();createItemBlock("New Item Block",[],[])}
function resetSetInfo(){$("#set-form-name").val("");global.setName="Unnamed_Item_Set";$(".map-selected").removeClass("map-selected");global.selectedMap="";global.selectedMode="";$(".champ-selected").removeClass("map-selected");global.selectedChamp=""}function removeItemBlocks(){$("#item-set-blocks").empty()}
function createItemBlock(a,d,b){var e=0,c='<li><div class="item-block-buttons noselect"><i class="material-icons toggle-item-block-button text-grey text-darken-2">swap_vert</i><i class="material-icons edit-item-block-button">spellcheck</i></div><div class="item-block-close-button noselect"><i class="material-icons close-item-block-button text-grey text-darken-2">clear</i></div>',c=c.concat('<div class="collapsible-header grey-text text-darken-2"><span class="item-block-name">'+a+"</span></div>"),
c=c.concat('<div class="collapsible-body grey lighten-3 grey-text text-darken-2"><div class="item-slots clearfix">');for(d.forEach(function(a,d){e++;c=c.concat('<div class="item-slot slot-'+e+'" ondrop="drop(event)" ondragover="allowDrop(event)"><div class="item-count count-'+e+'">'+b[d]+'</div><img class="item" draggable="true" id="'+a+'" ondragstart="drag(event)" src="/images/items/'+a+'.png"></div>')});10>e;)e++,c=c.concat('<div class="item-slot slot-'+e+'" ondrop="drop(event)" ondragover="allowDrop(event)"><div class="item-count count-'+
e+'">1</div></div>');c=c.concat("</div></div></li>");$("#item-set-blocks").append(c);$(".collapsible").collapsible({accordion:!1});$(".item-count").filter(function(){return 1<Number($(this).text())}).show()}
function loadFromJSON(a){var d,b=[],e=[];removeItemBlocks();global.setName=a.title;global.selectedMap=a.map;global.selectedMode=a.mode;$("#set-form-name").val(global.setName);$('*[data-map="'+global.selectedMap+'"]').addClass("map-selected");a.blocks.forEach(function(a){d=a.type;b=[];e=[];a.items.forEach(function(a){b.push(a.id);e.push(a.count)});createItemBlock(d,b,e)});$(".item-block-name").click()}
function createJSONFile(){var a=createJSONObject();data="text/json;charset=utf-8,"+encodeURIComponent(JSON.stringify(a));$("#download-button").attr("href","data:"+data);global.setName?$("#download-button").attr("download",global.setName+".json"):$("#download-button").attr("download","Unnamed Item Set.json")}
function createJSONObject(){var a={title:global.setName,type:"custom",map:""==global.selectedMap?"any":global.selectedMap,mode:""==global.selectedMode?"any":global.selectedMode,priority:!1,sortrank:0,blocks:[]};$.each($("#item-set-blocks li"),function(d){var b={items:[],type:$("#item-set-blocks li").find(".item-block-name")[d].textContent};$.each($($("#item-set-blocks li")[d]).find("img"),function(a){b.items.push({id:$($($("#item-set-blocks li")[d]).find("img")[a]).attr("id"),count:$($("#item-set-blocks li")[d]).find(".count-"+
$($($("#item-set-blocks li")[d]).find("img")[a]).parent().attr("class").match(/slot-(\d+)/)[1]).text()})});a.blocks.push(b)});return a}function allowDrop(a){a.preventDefault()}
function drag(a){var d=!1;a.dataTransfer.setData("text",a.target.id);a.dataTransfer.setData("parent",a.target.parentElement.className);global.source_item_slots=$(a.target.parentElement).parent().children();global.source_item_slots.each(function(){if(0==$(this).find("img").length)return global.source_index_empty=$(this).parent().children().index($(this)),d=!0,!1});d||(global.source_index_empty=global.MAX_ITEMS-1);a.target.parentElement.className.indexOf("item-slots")&&(a.dataTransfer.setData("index",
$(a.target.parentElement).parent().children().index($(a.target.parentElement))),a.dataTransfer.setData("number",$(a.target.parentElement).children().filter(".item-count").html()))}
function drop(a){a.preventDefault();if("trash"==a.target.id){if(0!=global.source_item_slots.filter(".item-slot").length){var d=Number(a.dataTransfer.getData("index"));scootRight(d,global.source_index_empty,global.source_item_slots);global.source_item_slots.eq(global.source_index_empty).children().remove("img");global.source_item_slots.eq(global.source_index_empty).find(".item-count").html(1);global.source_item_slots.eq(global.source_index_empty).find(".item-count").hide()}}else{var b=a.dataTransfer.getData("text"),
e=0==$(a.target.parentElement).not(".item-slot").length,c,g,f=global.MAX_ITEMS;e?(c=$(a.target.parentElement).parent().children(),g=c.index(a.target.parentElement)):(c=$(a.target.parentElement).children(),g=c.index(a.target));c.each(function(){if(0==$(this).find("img").length)return f=$(this).parent().children().index($(this)),!1});if(-1<a.dataTransfer.getData("parent").indexOf("item-slot")&&c.is(global.source_item_slots)){var h=Number(a.dataTransfer.getData("index"));if(e)if(h>g)if(a.target.id==
b){if("2003"==b||"2004"==b||"2043"==b||"2044"==b)e=$(a.target).parent().find(".item-count"),a=Number($(a.target).parent().find(".item-count").html()),"2003"==b&&5>a||"2004"==b&&5>a||"2043"==b&&2>a||"2044"==b&&3>a?($(e).html(++a),$(e).show(),scootRight(h,f-1,c),c.eq(f-1).remove("img"),c.eq(f-1).find(".item-count").html(1),c.eq(f-1).find(".item-count").hide()):scootRight(g,h,c)}else scootLeft(g,h,c);else if(a.target.id==b){if("2003"==b||"2004"==b||"2043"==b||"2044"==b)e=$(a.target).parent().find(".item-count"),
a=Number($(a.target).parent().find(".item-count").html()),"2003"==b&&5>a||"2004"==b&&5>a||"2043"==b&&2>a||"2044"==b&&3>a?($(e).html(++a),$(e).show(),scootRight(h,f-1,c),c.eq(f-1).remove("img"),c.eq(f-1).find(".item-count").html(1),c.eq(f-1).find(".item-count").hide()):scootLeft(h,g,c)}else scootRight(h,g,c);else scootRight(h,f-1,c)}else h=Number(a.dataTransfer.getData("number")),0<global.source_item_slots.filter(".item-slot").length&&!global.source_item_slots.is(c)&&!isFull(c)&&(d=Number(a.dataTransfer.getData("index")),
scootRight(d,global.source_index_empty,global.source_item_slots),global.source_item_slots.eq(global.source_index_empty).children().remove("img"),global.source_item_slots.eq(global.source_index_empty).find(".item-count").html(1),global.source_item_slots.eq(global.source_index_empty).find(".item-count").hide()),e?a.target.id==b?(e=$(a.target).parent().find(".item-count"),a=Number($(a.target).parent().find(".item-count").html()),"2003"==b&&5>a||"2004"==b&&5>a||"2043"==b&&2>a||"2044"==b&&3>a?($(e).html(++a),
$(e).show()):isFull(c)||(c.eq(f).append(document.getElementById(b).cloneNode(!0)),c.eq(f).show(),!isNaN(h)&&1<h&&(c.eq(f).children().filter(".item-count").html(h),c.eq(f).children().filter(".item-count").show()),scootLeft(g,f,c))):isFull(c)||(c.eq(f).append(document.getElementById(b).cloneNode(!0)),c.eq(f).show(),!isNaN(h)&&1<h&&(c.eq(f).children().filter(".item-count").html(h),c.eq(f).children().filter(".item-count").show()),scootLeft(g,f,c)):(c.eq(f).append(document.getElementById(b).cloneNode(!0)),
c.eq(f).show(),!isNaN(h)&&1<h&&(c.eq(f).children().filter(".item-count").html(h),c.eq(f).children().filter(".item-count").show()))}}
function scootLeft(a,d,b){for(--d;d>=a;d--){var e=$(b.eq(d).find(".item-count")),c=Number(b.eq(d).find(".item-count").html()),g=$(b.eq(d+1).find(".item-count")),f=Number(b.eq(d+1).find(".item-count").html());$(e).html(f);$(g).html(c);f=$(e).is(":hidden");c=$(g).is(":hidden");f?g.hide():g.show();c?e.hide():e.show();e=b.eq(d).find(".item").detach();g=b.eq(d+1).find(".item").detach();b.eq(d).append(g);b.eq(d+1).append(e)}}
function scootRight(a,d,b){for(;a<d;a++){var e=$(b.eq(a+1).find(".item-count")),c=Number(b.eq(a+1).find(".item-count").html()),g=$(b.eq(a).find(".item-count")),f=Number(b.eq(a).find(".item-count").html());$(e).html(f);$(g).html(c);f=$(e).is(":hidden");c=$(g).is(":hidden");f?g.hide():g.show();c?e.hide():e.show();e=b.eq(a).find(".item").detach();g=b.eq(a+1).find(".item").detach();b.eq(a).append(g);b.eq(a+1).append(e)}}
function isFull(a){var d=!0;a.each(function(){if(0==$(this).find("img").length)return d=!1});return d}
$(document).ready(function(){Opentip.styles.leagueItems={"extends":"alert",borderColor:"rgb(182, 234, 187)",borderWidth:1,background:[[0,"rgba(30, 30, 30, 0.9)"]],borderRadius:5,offset:[0,0],tipJoint:"bottom left",stem:!1};Opentip.defaultStyle="leagueItems";$(".button-collapse").sideNav();$(".filter-menu").draggable({handle:".filter-form-title",containment:"#builder"});$(".filter-items-button").click(function(){toggleFilterMenu()});new Opentip("#champ-help-tooltip","Pick one specific champion or none for a global item set");
new Opentip("#map-help-tooltip","Pick one specific map or none for a global item set");$.get("/getItems",function(a){dataJSON=JSON.parse(a);for(var d in dataJSON)if(dataJSON.hasOwnProperty(d)){$("#all-items").append('<img draggable="true" ondragstart="drag(event)" id="'+d+'" class="item" src="/images/items/'+d+'.png" alt="'+dataJSON[d].name+'"/>');var b="<img src='/images/gold.png'>&nbsp;"+dataJSON[d].gold.total+"<br><br>"+dataJSON[d].description;null!=dataJSON[d].efficiency&&(dataJSON[d].efficiency.base?
(b=b.concat("<br><hr>"),b=b.concat("<b>Case: Base Item</b><br>"),b=b.concat("Gold Efficiency Ratio: <b class='item-efficiency-neutral'>100%</b><br><br>")):(b=b.concat("<br><hr>"),$.each(dataJSON[d].efficiency.cases,function(a,d){var g=Object.keys(d)[0],f=d[g]["Gold Efficiency Ratio"],h=parseFloat(d[g]["Gold Efficiency Ratio"]),h=100<h?"item-efficiency-positive":100>h?"item-efficiency-negative":"item-efficiency-neutral";b=b.concat("<b>Case: "+g+"</b><br>");b=b.concat("Gold Efficiency Ratio: <b class="+
h+">"+f+"</b><br><br>")})));new Opentip("#"+d,b,dataJSON[d].name);dataJSON[d].tags&&dataJSON[d].tags.forEach(function(a){$("#"+d).addClass(a)})}});$.get("/getChamps",function(a){dataJSON=JSON.parse(a);global.sortedKeys=Object.keys(dataJSON).sort();global.sortedKeys.forEach(function(a){$(".champ-container").append('<div class="col s1 no-padding"><img class="champ-select" data-champ="'+dataJSON[a].key+'" id="'+dataJSON[a].key+'" src="images/champs/'+dataJSON[a].key+'.png" alt="'+dataJSON[a].name+'"></div>');
new Opentip("#"+dataJSON[a].key,dataJSON[a].name)})});$(document).on("click",".map-select",function(){""==global.selectedMap?(global.selectedMap=$(this).data("map"),global.selectedMode=$(this).data("mode"),$(this).addClass("map-selected")):global.selectedMap==$(this).data("map")?($('*[data-map="'+global.selectedMap+'"]').removeClass("map-selected"),global.selectedMap="",global.selectedMode=""):($('*[data-map="'+global.selectedMap+'"]').removeClass("map-selected"),global.selectedMap=$(this).data("map"),
global.selectedMode=$(this).data("mode"),$(this).addClass("map-selected"))});$(document).on("click","#champion-selection .champ-select",function(){""==global.selectedChamp?(global.selectedChamp=$(this).data("champ"),$(this).addClass("champ-selected")):global.selectedChamp==$(this).data("champ")?($('#champion-selection .champ-select[data-champ="'+global.selectedChamp+'"]').removeClass("champ-selected"),global.selectedChamp=""):($('#champion-selection .champ-select[data-champ="'+global.selectedChamp+
'"]').removeClass("champ-selected"),global.selectedChamp=$(this).data("champ"),$(this).addClass("champ-selected"))});$(document).on("click","#champion-build-selection .champ-select",function(){var a={key:$(this).data("champ"),type:$("input[name=build-type]:checked").val()};$.post("/getChampBuild",a,function(a){dataJSON=JSON.parse(a);loadFromJSON(dataJSON)});$('#champion-selection .champ-select[data-champ="'+global.selectedChamp+'"]').removeClass("champ-selected");global.selectedChamp=$(this).data("champ");
$('#champion-selection .champ-select[data-champ="'+global.selectedChamp+'"]').addClass("champ-selected")});$(document).on("click",".preset-select",function(){var a={preset:$(this).text()};$.post("/getStarterPreset",a,function(a){dataJSON=JSON.parse(a);loadFromJSON(dataJSON)})});$("#item-search-box").on("input",function(){$("input[type=checkbox]").each(function(){$(this).prop("checked",!1)});var a="jungle lane consumable goldper trinket vision armor health healthregen spellblock attackspeed criticalStrike damage lifesteal cooldownreduction mana manaregen spelldamage boots nonbootsmovement".split(" "),
d={tools:["consumable","goldper","trinket vision"],defense:["armor","health","healthregen","spellblock"],attack:["attackspeed","criticalstrike","damage","lifesteal"],magic:["cooldownreduction","mana","manaregen","spelldamage"],movement:["boots","nonbootsmovement"]},b={ap:"spelldamage",ad:"damage",as:"attackspeed","attack speed":"attackspeed",mr:"spellblock",hp:"health",cdr:"cooldownreduction"},e=$("#item-search-box").val().toLowerCase(),c=$(".item",$("#all-items"));""!=e?(c.hide(),c.filter(function(){var c=
!1,f=-1<this.alt.toLowerCase().indexOf(e),h=this.className.toLowerCase();-1<a.indexOf(e)?(f=!1,c=-1<h.indexOf(" "+e)):d[e]?(f=!1,$.each(d[e],function(a,b){if(-1<h.indexOf(" "+b))return c=!0,!1})):b[e]&&(f=!1,-1<h.indexOf(" "+b[e])&&(c=!0));return f||c}).show()):c.show()});$("input[type=checkbox]").change(function(){var a=$(".item",$("#all-items"));$("#item-search-box").val()&&($("#item-search-box").val(""),a.show());this.checked||a.show();var d=[];$("input[type=checkbox]").each(function(){this.checked&&
d.push(this.id)});var b=!1;a.filter(function(){if(b)return $("input[type=checkbox]").each(function(){$(this).prop("checked",!1)}),a.show(),!1;if(this.hidden)return!1;var e=$(this),c=!1;d.forEach(function(a){if(b||"All Items"==a)return b=!0,c=!1;if("Starting Items"==a){if(!e.hasClass("Jungle")&&!e.hasClass("Lane"))return c=!0,!1}else if("Tools"==a){if(!e.hasClass("Consumable")&&!e.hasClass("GoldPer")&&!e.hasClass("Trinket Vision"))return c=!0,!1}else if("Defense"==a){if(!(e.hasClass("Armor")||e.hasClass("Health")||
e.hasClass("HealthRegen")||e.hasClass("SpellBlock")))return c=!0,!1}else if("Attack"==a){if(!(e.hasClass("AttackSpeed")||e.hasClass("CriticalStrike")||e.hasClass("Damage")||e.hasClass("LifeSteal")))return c=!0,!1}else if("Magic"==a){if(!(e.hasClass("CooldownReduction")||e.hasClass("Mana")||e.hasClass("ManaRegen")||e.hasClass("SpellDamage")))return c=!0,!1}else if("Movement"==a){if(!e.hasClass("Boots")&&!e.hasClass("NonbootsMovement"))return c=!0,!1}else if(!e.hasClass(a))return c=!0,!1});return c}).hide()})});
function toggleFilterMenu(){$(".filter-menu").is(":visible")?$(".filter-menu").fadeOut("fast"):$(".filter-menu").fadeIn("fast")};
