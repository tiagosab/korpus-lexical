self.port.on("click", function (obj) {
    if ($("#divk").length == 0 && $("#stylek").length == 0) {
        $("head").append("<style id='stylek'>body{position:relative;}#divk{margin-top:-103px;border-radius:5px 5px;z-index:6000;background-color:rgba(0,0,0,0.5);color:#FFF;width:323px;height:48px;position:fixed;top:109%;left:1%;padding-left:10px;opacity:1;display:block;}.labelk{float:left;display:inline;font-family:Georgia,serif;text-transform:uppercase;font-weight:700;text-align:left;color:rgba(255,153,0,0.9);line-height:1.5;font-size:30px;opacity:0.8;cursor:pointer;transition:opacity .25s;}.wordk{overflow:hidden;font-size:24px;font-family:Georgia,serif;text-align:left;resize:none;border-color:none;border-style:none;float:left; cursor:default;color:#FFF !important;spellcheck:false} .wordk:focus,input:focus {border-color:transparent !important;} .wordk::-moz-selection {background:rgba(255,153,0,0.9);}.submitk{background-color:rgba(0,0,0,0);border-style:none;}#divk.ink {-moz-animation: console-ink .3s both;}#divk.outk {-moz-animation: console-outk .3s both;}@-moz-keyframes console-ink{0%{	opacity:0;-moz-transform:translate3D(0,-100px,0)}100%{opacity:1}}@-moz-keyframes console-outk{0%{opacity:1}#divk.ink{-moz-animation:console-ink .3s both}#divk.outk{-moz-animation:console-outk .3s both}100%{opacity:0;-moz-transform:translate3D(0,-100px,0)}}</style>");
        $("body").append("<div id='divk' class='ink'><label title='click to remove' class='labelk' >  > </label><input type='text' size='50' id='textareak' class='wordk' onmouseover='this.select();this.focus();' style='background-color: transparent; color: #FFF;border: 0px;font-size:24px;font-family:Georgia,serif;font-style: normal;box-shadow: none;line-height: normal;-moz-box-sizing:border-box;width:90%;height:90%;padding: 7px 0px;margin: 0px;'></input></div>");
    }

    
   
    $('#textareak').focus();

 $('#textareak').bind("enterKey", function (e) {
        var word = $("#textareak").val();
        self.port.emit("newWord2", word);
        $(this).val('');
        $(this).focus();
    });

 $(".labelk").click(function () {
        $("#divk").removeClass("ink").addClass("outk");
        setTimeout(function () {
            $("#divk").remove();
            $("#stylek").remove();
        }, 3000);
    });

 $('#textareak').keyup(function (e) {
        if (e.keyCode == 13) {
            $(this).trigger("enterKey");
        }
    });



});