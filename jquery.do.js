$(function(){
                
    $("body").append(
        '<div id="jqueryDo" title="jQuery Do">' +
            '<div>jQuery-do: <input id="jqDoIn" type="text" /></div>' +
        '</div>'
    );

    $( "#jqueryDo" ).dialog({
        autoOpen:false,
        height: 200,
        width: 350
    });
    var selectedOne = false;
    var loaded = false;
    function doAction(el){
        if(el.nodeName=='A' || el.nodeName=='a'){ 
            var r = true;
            try{
                var r = $(el).triggerHandler('click');
                if(r == undefined){
                    r = true;
                }
            }catch(e){}
            if(r !== false){// se o click nao retornou false, acessamos o href
                document.location.href = el.href;
            }
        }else if(el.nodeName == 'LABEL'){
            console.log('label for='+$(el).attr('for'));
            $('#' + $(el).attr('for')).focus();
            $("#jqueryDo").dialog('close');
        }else{
            $(el).click();
        }
    }
    function ctrlSpaceHandler(){
        // start jQuery do inspirado no gnome-do
        if(loaded==false){
            loaded = true;
            var ls = $.cookie('jqDoClickedLs');
            if(ls == null){
                ls = new Array();
            }else{
                ls = ls.split(',');
            }
            console.log(ls);
            var txt = new Array();
            $("a").each(function(){
                var lbl = $.trim($(this).text());
                var item = {label: lbl, value: this};
                txt.push(item);
            });
            $(":button").each(function(){
                var lbl = $.trim($(this).val());
                var item = {label: lbl, value: this};
                txt.push(item);
            });
            $("input[type='submit']").each(function(){
                var lbl = $.trim($(this).val());
                var item = {label: lbl, value: this};
                txt.push(item);
            });
            $("label").each(function(){
                var lbl = $.trim($(this).text());
                var item = {label: lbl, value: this};
                txt.push(item);
            });
            txt = txt.sort(function(a, b){
                var pa = ls.indexOf(a.label);
                var pb = ls.indexOf(b.label);
                return pb - pa;
            });
            $("#jqDoIn").keyup(function(event){
                if(event.keyCode=='13' && selectedOne==false){
                    var t = $('.ui-autocomplete > li:first').text();
                    for(var i=0;i < txt.length;i++){
                        if(txt[i].label==t){
                            doAction(txt[i].value);
                        }
                    }
                }
            });
            $("#jqDoIn").autocomplete({
                source: txt,
                focus: function( event, ui ) {
                    return false; // nao troca o texto do input
                },
                select: function(event, ui) {
                    selectedOne = true;
                    var tmp = new Array();
                    var lbl = ui.item.label;
                    for(var i = 0; i<ls.length; i++){
                        if(ls[i]!=lbl){
                            tmp.push(ls[i]);
                        }
                    }
                    ls = tmp;
                    ls.push(lbl);
                    $.cookie('jqDoClickedLs', ls, {expires: 15});
                    var el = ui.item.value;
                    doAction(el);
                    return false;
                }
            })
            .data( "autocomplete" )._renderItem = function( ul, item ) {
                return $( "<li></li>" )
                    .data( "item.autocomplete", item )
                    .append( "<a>" + item.label + "</a>" )
                    .appendTo( ul );
            };
        }
        $("#jqueryDo").dialog('open');
        selectedOne = false;
    }
    $(window).bind('keydown', 'ctrl+space', ctrlSpaceHandler);
    $("input[type=text]").bind('keydown', 'ctrl+space', ctrlSpaceHandler);
});
