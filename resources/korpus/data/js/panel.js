self.port.on("lexicon", function (obj) {

var parser = new DOMParser(),
        wrPage = parser.parseFromString(obj.html, "text/html"),
        dico = obj.dico,
        lang = obj.lang,
        word = obj.word;
  
    function addImg(url) {
        for (var i = 0; i < $("img").length; i++) {
            $("img")[i].attributes["src"].value = url + $("img")[i].attributes["src"].value;
        }
    }

    function addBaseUrl(base, urlR) {
        $("a[href^='" + urlR + "']").attr('href', function (i, v) {
            return v.replace(urlR, base + urlR)
        });
    }
    
    function addCopyright(base, urlR) {
        return $("#contentk").append("<div class='websitecpr'><br><br> Source: <a href=" + base + urlR + " target='_blank'><span class='lien_court'><span class='lien_racine'>" + base + "</span><span class='lien_fin_coupee'>" + word + "</span></span></a></div>");
    }

    function googletranslate(x) {

        var gdict = {
            refine: function (s) {
                var result = '';
                for (var i = 0; i < s.length; ++i) {
                    var c = s.charAt(i);
                    var last = result.charAt(result.length - 1);
                    if (c === ',' && (result.length === 0 || last === ',' || last === '[')) {
                        result += '""';
                    }
                    if (c === ']' && last === ',') {
                        result += '""';
                    }
                    if (!(c === ' ' || c === '\t' || c === '\n') || last !== ',')
                        result += c;
                }
                return result;
            },
            html: function (tag, attrs, parent) {
                if (!attrs) attrs = {};
                var tag = document.createElement(tag);
                for (var i in attrs) {
                    tag.setAttribute(i, attrs[i]);
                }
                if (parent) parent.appendChild(tag);
                return tag;
            },
            thesaurus: function (x) {
                var lit = x[2];
                for (i = 0; i < lit.length; i++) {
                    var tr = gdict.html("tr", {}, $maincontent);
                    var score = Math.round((lit[i][3] || 0) * 100) + 10;
                    $("#contentk").append("<td><div style='width: 32px; height: 7px; background: linear-gradient(90deg, #aaa " + score + "%, #fff " + score + "%);'></div></td>");
                    $("#contentk").append("<td>" + lit[i][0] + "</td>");
                    $("#contentk").append("<td class='deftd'>" + lit[i][1] + "</td>");
                }
            },
            synonym: function (x) {
                x[0];
                lis = x[1];
                for (i = 0; i < 1; i++) {
                    var tr = gdict.html("td", {}, $maincontent);
                    var direct_translation = gdict.html("td", {
                        style: "font: 13px arial,sans-serif;color: #000;white-space: nowrap;",
                        dir: "auto"
                    }, tr);
                    direct_translation.textContent = lis[i][0].join(", ");
                }
            },
            definition: function (x) {
                lid = x[1];
                $("#contentk").append("<tr><td>" + lid[0][0] + "</div></td></tr>");
                $("#contentk").append("<tr><td class='deftd'>'" + lid[0][2] + "'</td></tr>");
            },
            phrasecontext: function (x) {
                lie = x[0];
                $("#contentk").append("<tr><td>" + lie + "</td><tr>");
            }
        };

        var resp = gdict.refine(x),
            z = JSON.parse(resp);

        var $maincontent = document.getElementById("contentk");

        if (!z) {
            $("#contentk").append('');
        } else if (!z[1] || z[1].length === 0) {
            if (z[0] && z[0][0] && z[0][0][0]) {
                $("#contentk").append("<div style='font: 16px arial,sans-serif;color: #000;'><br><br><br><br><b>" + z[0][0][1] + "</b><br><br>" + z[0][0][0] + "</div>");
            } else {
                $("#contentk").append('');
            }
        } else {
            $("#contentk").append("<div class='gt-cd-t'>Translations of <b>" + z[0][0][1] + "</b> </div>");
            for (var j = 0; j < z[1].length; j++) {
                x = z[1][j];
                $("#contentk").append("<div class='gt-baf-pos-head'>" + x[0] + "</div>");
                gdict.thesaurus(x);
            }
            $("#contentk").append("</tr><div class='gt-cd-t'><br>Definitions </div>");
            for (var k = 0; k < z[12].length; k++) {
                x = z[12][k];
                $("#contentk").append("<div class='gt-baf-pos-head'>" + x[0] + "</div><div class='gt-def-list>'");
                gdict.definition(x);
                if (k === 0) {
                    $("#contentk").append("<tr><td class='deftd'>Synonym: " + z[11][0][1][0][0].toString() + "</td></tr></div><br><br>");
                }
            }
            $("#contentk").append("<div class='gt-cd-t'><br>Synonym </div>");
            for (var k = 0; k < z[11].length; k++) {
                x = z[11][k];
                $("#contentk").append("<div class='gt-baf-pos-head'>" + x[0] + "</div>");
                gdict.synonym(x);
            }
            if (typeof z[13][0] != 'undefined') {
                $("#contentk").append("<br><div class='gt-cd-t'><br>Examples </div>");
                for (var l = 0; l < z[13][0].length; l++) {
                    x = z[13][0][l];
                    gdict.phrasecontext(x);
                }
            }
        }
    }
    
/*  function TTSpons() {
//<audio autoplay='autoplay' controls='controls'><source src=""/></audio>
        function playaudio(urlaudio) {
            $("<audio></audio>").attr({
                'src': urlaudio,
                'volume': 0.8,
                'autoplay': 'autoplay'
            })
        }
        $("a").click(function () {
            var addr = $(this).attr("href");
            var urlaudio = "http://dict.tu-chemnitz.de/speak-" + addr.substring(addr.indexOf("speak") + 6, addr.indexOf(";")) + ".mp3";
            playaudio(urlaudio);

        });
   */ 

    $("html").html("<html><head><meta http-equiv='Content-Type' content='text/html; charset=utf-8'></head><body></body>");
    $("head").append($("<link rel='stylesheet' type='text/css'/>").attr("href", "../html/css/cssk.css"));
    $("body").append("<div id='container'><div id='contentk'></div><div class='divk'><form name='formk' target='_self'><label  class='labelk' >  > </label><input name='valueWord' value='1' type='hidden'><input name='inputk' maxlength='30' class='wordk' tabindex='1' value='' type='text'></form></div></div>");

    /** design a new scrollbar 
     **/
    $(function () {
        $('#contentk').slimScroll({
            height: '375px',
            railVisible: false,
            alwaysVisible: true,
            size: "10px"
        });
    });

    /**Forge a clean content
     **/
    switch (dico) {
    case "babla":
        $("head").append($('<link rel="stylesheet" type="text/css"/>').attr('href', '../html/css/babla-cleaned.css'));
        $sectionlist = wrPage.getElementsByTagName("section");
        $maincontent = $sectionlist.item(0).outerHTML;
        for (var i = 1; i < $sectionlist.length; i++) {
            $maincontent += $sectionlist.item(i).outerHTML;
        }
        $("#contentk").append($maincontent);
        addBaseUrl('http://en.bab.la', '/dictionary');
        addCopyright('http://en.bab.la', '/dictionary/' + lang + '/' + word);
        //~ TTSbabla();
        break;
    case "cnrtl":
        if (lang == "Synonyme") {
            $("head").append($('<link rel="stylesheet" type="text/css"/>').attr('href', '../html/css/crisco-cleaned.css'));
            $maincontent = wrPage.getElementById('synonymes').outerHTML;
            $("#contentk").append($maincontent);
            $("hr").css("background-color", "#aaa");
            $("hr").css("color", "#aaa")
            addCopyright('http://www.crisco.unicaen.fr', '/des/synonymes/' + word);
        } else if (lang == "Bob"){
            $("head").append($('<link rel="stylesheet" type="text/css"/>').attr('href', '../html/css/bob-cleaned.css'));
            $maincontent = wrPage.getElementById("main").children[0].outerHTML;
            $("#contentk").append($maincontent);
            $("hr").remove();
            addBaseUrl("http://www.languefrancaise.net/","bob/");
            addCopyright("http://www.languefrancaise.net/bob","/liste.php?moduless=siterech&motsclef="+escape(word));        
        } else {
            $("head").append($('<link rel="stylesheet" type="text/css"/>').attr('href', '../html/css/cnrtl-cleaned.css'));
            if (lang == "DMF") {
                wrPage.getElementsByTagName("tbody")[6].remove();
                $maincontent = wrPage.getElementsByClassName("fond")[0].outerHTML;
                $("#contentk").append($maincontent);
                $("table").attr("style", "");
            } else {
                $maincontent = wrPage.getElementById('vtoolbar').outerHTML +
                    wrPage.getElementById('contentbox').outerHTML;
                $("#contentk").append($maincontent);
                $("a").attr('onclick', '').unbind();
                for (var i = 0; i < $("a").length; i++) {
                    $("a")[i].href = 'http://www.cnrtl.fr/'+lang.toLowerCase()+'/' + word + '//' + i;
                }
            }
            lang = (lang == "Lexicographie") ? "definition" : lang.toLowerCase();
            addCopyright("http://www.cnrtl.fr", "/"+lang+"/" + word);
        }
        break;
    case "littre":
        $("head").append($('<link rel="stylesheet" type="text/css"/>').attr('href', '../html/css/littre-cleaned.css'));
        $maincontent = wrPage.getElementsByTagName("section")[1].outerHTML;
        $("#contentk").append($maincontent);
        addCopyright('http://www.littre.org', '/definition/' + word);
        break;
    case "dvlf":
        $("head").append($('<link rel="stylesheet" type="text/css"/>').attr('href', '../html/css/dvlf-cleaned.css'));
        $maincontent = wrPage.getElementsByClassName("span-15")[0].outerHTML +
            wrPage.getElementsByClassName("span-6")[0].outerHTML;
        $("#contentk").append($maincontent);
        $("hr").remove();
        $("div.incentive").remove();
        $('a[id^="corpa"]').remove();
        $('a[id^="web"]').remove();
        $('span[class^="count"]').remove();
        $("div.word_reference_trigger").remove();
        $("hr").remove();
        $("a[id^='display']").remove();
        $("span[id^='full']").show();
        $("span[id^='remainder']").show();
        $("div.dico_entries_container").show();
        addCopyright('http://dvlf.uchicago.edu', '/mot/' + word);
        break;
    case "wordreference":
        $("head").append($('<link rel="stylesheet" type="text/css"/>').attr('href', '../html/css/wordreference-cleaned.css'));
        $maincontent = wrPage.getElementById('centercolumn').outerHTML;
        $("#contentk").append($maincontent);
        $("td.centercolumn").find('a').each(function () {
            $(this).attr("target", "_blank");
        });
        $("a.gamelink").remove();
        addImg('http://www.wordreference.com');
        addBaseUrl('http://www.wordreference.com', /\/\w+\//);
        addCopyright('http://www.wordreference.com', '/' + lang + '/' + word);
        break;
    case "linguee":
        $("head").append($('<link rel="stylesheet" type="text/css"/>').attr('href', '../html/css/linguee.css'));
        $("#contentk").append(wrPage.getElementById('lingueecontent').outerHTML);
        $("div.progress-indicator").remove();
        addCopyright('http://www.linguee.com', '/' + lang + '/search?source=auto&query=' + word);
        break;
    case "woxikon":
        $("head").append($('<link rel="stylesheet" type="text/css"/>').attr('href', '../html/css/woxikon.css'));
        $("#contentk").append(wrPage.getElementById('content').outerHTML);
        $("a.default-button.suggest-word").remove();
        $("div.nobg.clearfix").remove();
        $("div.shareButtons.clearfix").remove();
        $("div[class^=c]").remove();
        addCopyright('http://www.woxikon.de', '/' + lang + '/' + word + '.php');
        break;
    case "canoonet":
        $("head").append("<meta http-equiv='Content-Type' content='text/html; charset=ISO-8859-1'>");
        $("head").append($('<link rel="stylesheet" type="text/css"/>').attr('href', '../html/css/canoonet-cleaned.css'));
        wrPage.getElementsByClassName("info")[0].style.cssText = "";
        $maincontent = wrPage.getElementsByClassName("contentWhite")[0].childNodes[0].childNodes[1].childNodes[0].childNodes[3].childNodes[0].childNodes[1].outerHTML;
        $("#contentk").append($maincontent);
        addImg("http://www.canoo.net");
        addBaseUrl('http://www.canoo.net', '/inflection');
        addCopyright('http://www.canoo.net', '/services/Controller?MenuId=Search&service=canooNet&lang=de&input=' + word);
        break;
    case "dictcc":
        $("head").append($('<link rel="stylesheet" type="text/css"/>').attr('href', '../html/css/dictcc.css'));
        $maincontent = wrPage.getElementsByTagName("table")[1].outerHTML +
            wrPage.getElementsByTagName("table")[2].outerHTML +
            wrPage.getElementsByTagName("table")[4].outerHTML +
            wrPage.getElementsByClassName("aftertable")[0].outerHTML +
            wrPage.getElementsByClassName("aftertable")[2].outerHTML;
        $("#contentk").append($maincontent);
        $("table")[0].style.width = "";
        $("table")[1].width = "";
        $("table")[3].width = "";
        addCopyright('http://' + lang + '.dict.cc', '/?s=' + word);
        break;
    case "dictleo":
        $("head").append($('<link rel="stylesheet" type="text/css"/>').attr('href', '../html/css/dictleo-cleaned.css'));
        $maincontent = wrPage.getElementById("mainContent").childNodes[1].outerHTML;
        $("#contentk").append($maincontent);
        addCopyright('http://dict.leo.org', '/' + lang + '/?&search=' + word);
        break;
    case "dictionarycom":
        $("head").append($('<link rel="stylesheet" type="text/css"/>').attr('href', '../html/css/dictionarycom-cleaned.css'));
        if (lang == "Dictionary") {
            // var quotes=wrPage.getElementById("quotes-box").outerHTML||"";
            $maincontent = wrPage.getElementsByClassName("center-well-container")[0].outerHTML + "quotes";
            $("#contentk").append($maincontent);
            $("div.hidden-xs").remove();
            addBaseUrl('http://' + lang.toLowerCase() + '.reference.com', '/browse/');
            addCopyright('http://' + lang.toLowerCase() + '.reference.com', '/browse/' + word);
        } else if (lang == "Thesaurus") {
            $maincontent = wrPage.getElementsByClassName('main-heading')[0].outerHTML +
                wrPage.getElementById('synonyms-0').outerHTML +
                wrPage.getElementById("word-origin").outerHTML +
                wrPage.getElementById("example-sentences").outerHTML;
            $("#contentk").append($maincontent);
            $("div#headword-star.star").remove();
            $("div.part-of-speech-filter").remove();
            $("div.box-image").remove();
            $("span.link-row").remove();
            addBaseUrl('http://' + lang.toLowerCase() + '.reference.com', '/browse/');
            addCopyright('http://' + lang.toLowerCase() + '.reference.com', '/browse/' + word);
        } else {
            $maincontent = "<div class='content_t'> <div class='textTxt'> " + word + " </div>" + wrPage.getElementsByClassName('translateTxt')[0].outerHTML + "</div>";
            $("#contentk").append($maincontent);
            addCopyright("http://translate.reference.com", "/translate?query=" + encodeURIComponent(word) + lang);
        }
        break;
    case "beolingus":
        $("head").append($('<link rel="stylesheet" type="text/css"/>').attr('href', '../html/css/beolingus-cleaned.css'));
        $("#contentk").append(wrPage.getElementById('dresult1').outerHTML);
        $("#contentk").append(wrPage.getElementById('dresult1').nextElementSibling.outerHTML);
        $(document).ready(function () {
            $("a[href^='/ding']").attr('onclick', '').unbind();
            $("a[href^='/ding']").attr('onmouseover', '').unbind();
            $("img").remove();
            $('tbody[id^="b"]').remove();
            addBaseUrl('http://dict.tu-chemnitz.de', '/ding');
        });
        addCopyright('http://dict.tu-chemnitz.de', '/dings.cgi?service=' + lang + ';optword=1;optcase=1;opterrors=0;optpro=0;optfold=0;optshape=1;scroll=1;lang=en;wm=1;style=;query=' + word);
        break;
    case "thefreedictionary":
        $("head").append($('<link rel="stylesheet" type="text/css"/>').attr('href', '../html/css/thefreedictionary-cleaned.css'));
        $maincontent1 = wrPage.getElementById('HeaderTable').outerHTML;
        $maincontent2 = wrPage.getElementById('MainTxt').outerHTML;
        $maincontent = $maincontent1 + $maincontent2;
        $("#contentk").append($maincontent);
        addCopyright('http://' + lang + '.thefreedictionary.com', '/' + word);
        break;
    case "urbandictionary":
        $("head").append($('<link rel="stylesheet" type="text/css"/>').attr('href', '../html/css/urbandictionary.css'));
        $("#contentk").append(wrPage.getElementById('content').outerHTML);
        $(".share").remove();
        $(".thumbs-counts").remove();
        $(".footer").remove();
        $(".random_button").remove();
        $(".buy").remove();
        addCopyright('http://www.urbandictionary.com', '/define.php?term=' + word);
        break;
    case "memidex":
        $("head").append($('<link rel="stylesheet" type="text/css"/>').attr('href', '../html/css/memidex.css'));
        $maincontent = wrPage.getElementsByTagName("body").item(0).innerHTML;
        $("#contentk").append($maincontent);
        $("form").remove('#f');
        $("div").remove('#t');
        addCopyright('http://www.memidex.com', '/' + word);
        break;
    case "wordnet":
        $("head").append($('<link rel="stylesheet" type="text/css"/>').attr('href', '../html/css/wordnet.css'));
        $maincontent = wrPage.getElementsByClassName("form")[0].outerHTML;
        $("#contentk").append($maincontent);
        $("form").remove('');
        $(".key").remove('');
        addBaseUrl('http://wordnetweb.princeton.edu/perl/', 'webwn')
        addCopyright('http://wordnetweb.princeton.edu', '/perl/webwn?sub=Search+WordNet&o0=1&o8=1&o1=1&h=0&s=' + word);
        break;
    case "collins":
        $("head").append($('<link rel="stylesheet" type="text/css"/>').attr('href', '../html/css/collins-cleaned.css'));
        $maincontent = wrPage.getElementsByClassName("definition_content")[0].outerHTML;
        $("#contentk").append($maincontent);
        $("div").remove('.the_word');
        $("div").remove('#advert_box');
        addImg("http://www.collinsdictionary.com");
        addCopyright('http://www.collinsdictionary.com', '/dictionary/' + lang + '/' + encodeURIComponent(word));
        break;
    case "oxforddictionaries":
        $("head").append($('<link rel="stylesheet" type="text/css"/>').attr('href', '../html/css/oxforddictionaries-cleaned.css'));
        $maincontent = wrPage.getElementsByClassName("entryPageContent")[0].outerHTML;
        $("#contentk").append($maincontent);
        $("div.the_word").remove();
        $("div.responsive_hide_on_hd").remove();
        addCopyright('http://www.oxforddictionaries.com', '/definition/' + lang + '/' + word);
        break;
    case "merriamwebster":
        $("head").append($('<link rel="stylesheet" type="text/css"/>').attr('href', '../html/css/merriamwebster-cleaned.css'));
        $maincontent = wrPage.getElementById('mwEntryData').outerHTML;
        $("#contentk").append($maincontent);
        addCopyright('http://www.merriam-webster.com', '/dictionary/' + word);
        break;
    case "almaany":
        $("head").append($('<link rel="stylesheet" type="text/css"/>').attr('href', '../html/css/almaany.css'));
        $maincontent = wrPage.getElementsByClassName("divcontentleft2")[0].outerHTML;
        $("#contentk").append($maincontent);
        $("#main_search").remove();
        $(".kb-tgl").css("href", "http://www.almaany.com/home.php?language=french&lang_name=Arabe#");
        $(".block_area")[0].remove()
        $(".block_area")[1].remove()
        $(".cse-branding-bottom").remove();
        addCopyright('http://www.almaany.com', '/home.php?language=' + lang + '&word=' + word);
        break;
    case "albaheth":
        $("head").append($('<link rel="stylesheet" type="text/css"/>').attr('href', '../html/css/baheth.css'));
        $maincontent = wrPage.getElementsByTagName("form")[0].outerHTML;
        $("form")[0].childNodes[1].remove();
        $("#contentk").append($maincontent);
        $("#main_search").remove();
        addCopyright('http://www.baheth.info', '/all.jsp?term=8#' + word);
        break;
    case "iate":
        $("head").append($('<link rel="stylesheet" type="text/css"/>').attr('href', '../html/css/iate-cleaned.css'));
        $maincontent = wrPage.getElementById('searchResultPage').outerHTML;
        $("#contentk").append($maincontent);
        addCopyright('http://iate.europa.eu', '/SearchByQuery.do?method=search&query=' + word + '&sourceLanguage=' + lang + '&&targetLanguages=s&domain=0&matching=&typeOfSearch=s');
        break;
    case "eurovoc":
        $("head").append($('<link rel="stylesheet" type="text/css"/>').attr('href', '../html/css/eurovoc-cleaned.css'));
        $maincontent = wrPage.getElementById('main').outerHTML;
        $("#contentk").append($maincontent);
        addBaseUrl('http://eurovoc.europa.eu/drupal/', '?q=request');
        addCopyright('http://eurovoc.europa.eu', '/drupal/?q=search&text=' + encodeURIComponent(word) + '&cl=' + lang + '&page=1');
        break;
    case "pons":
        $("head").append($('<link rel="stylesheet" type="text/css"/>').attr('href', '../html/css/pons-cleaned.css'));
        $maincontent = wrPage.getElementsByClassName('span8').item(0).outerHTML;
        $("#contentk").append($maincontent);
        $(".results-header").remove();
        $(".form-inline").remove();
        $(".hidden-phone").remove();
        $(".lang_header").remove();
        $(".forum_hits").remove();
        $(".dropdown").remove();
        $(".add_od").remove();
        $(".acapela-template").remove();
        $("#modalTrainerExportInfo").remove();
        addCopyright('http://en.pons.com', '/translate?l=' + lang + '&q=' + word);
        //TTSpons(lang);
        break;
    case "duden":
        $("head").append($('<link rel="stylesheet" type="text/css"/>').attr('href', '../html/css/duden-cleaned.css'));
        $maincontent = wrPage.getElementsByTagName("article")[0].outerHTML;
        $("#contentk").append($maincontent);
        $("#lexem_nav").remove();
        $(".jump_to_top").remove();
        $("#lexem_ad").remove();
        addCopyright('http://www.duden.de', '/rechtschreibung/' + word);
        break;
    case "wortschatzunileipzig":
        $("head").append($('<link rel="stylesheet" type="text/css"/>').attr('href', '../html/css/wunileipzig.css'));
        $maincontent = wrPage.getElementsByClassName("result")[0].outerHTML;
        $("#contentk").append($maincontent);
        addCopyright('http://corpora.informatik.uni-leipzig.de', '/cgi-bin/' + lang + '/wort_www?site=10&Wort=' + word);
        break;
    case "dwds":
        var id = 'ddc_panel_' + lang;
        $("head").append($('<link rel="stylesheet" type="text/css"/>').attr('href', '../html/css/dwds-cleaned.css'));
        $maincontent = wrPage.getElementById(id).outerHTML;
        $("#contentk").append($maincontent);
        addImg('http://www.dwds.de');
        addCopyright('http://www.dwds.de', '/?qu=' + word);
        break;
    case "rae":
        $("head").append($('<link rel="stylesheet" type="text/css"/>').attr('href', '../html/css/drae-cleaned.css'));
        $maincontent = wrPage.getElementsByTagName("body");
        $("#contentk").append($maincontent);
        $("img").remove();
        addCopyright("http://lema.rae.es","/"+lang+"/srv/search?val=" + word);
        break;
    case "reverso":
        $("head").append($('<link rel="stylesheet" type="text/css"/>').attr('href', '../html/css/reverso-cleaned.css'));
        $maincontent = wrPage.getElementsByClassName("search-block-inset")[0].outerHTML;
        $("#contentk").append($maincontent);
        $("#search").remove();
        $("#better_reverse_search").remove();
        $("#search2").remove();
        $("#cconstraint_message").remove();
        $("#navbarup").remove();
        $("#navbardown").remove();
        for (var i = 0; i < $(".info_corpus").length; i++) {
            source = $(".info_corpus")[i].title;
            $(".info_corpus")[i].href = source.substr(8, source.length);
        }
        addCopyright("http://context.reverso.net", "/translation/" + lang + "/" +  word);

        break;
    case "glosbe":
        $("head").append($('<link rel="stylesheet" type="text/css"/>').attr('href', '../html/css/glosbe-cleaned.css'));
        $maincontent = wrPage.getElementsByTagName("article")[0].outerHTML +
            wrPage.getElementsByTagName("article")[1].outerHTML;
        $("#contentk").append($maincontent);
        $("img").remove();
        addCopyright("http://en.glosbe.com", "/" + lang + "/" + word);
        break;
    case "chambers":
        $("head").append($('<link rel="stylesheet" type="text/css"/>').attr('href', '../html/css/chambers-cleaned.css'));
        $maincontent = wrPage.getElementById("fullsearchresults").outerHTML;
        $("#contentk").append($maincontent);
        addCopyright("http://www.chambers.co.uk", "/search.php?title=" + lang + "&query=" + encodeURIComponent(word));
        break;
    case "googletranslate":
        $("head").append($('<link rel="stylesheet" type="text/css"/>').attr('href', '../html/css/googletranslate-cleaned.css'));
        var requestResponse = obj.htmljson;
        googletranslate(requestResponse);
        addCopyright("https://translate.google.com", "/?hl=en#auto/" + lang + "/" + encodeURIComponent(word));
        break;
    default:
        return "false";
    }

    /** Any link open in the browser instead of the panel
     **/
    $(document).ready(function () {
        $("a[href^=http]").attr('target', '_blank');
        $("input[name='inputk']").val(obj.search).focus().select();
    });

    /** new search
     **/
    $("form[name='formk']").submit(function () {
        var word = $("input[name='inputk']").val();
        self.port.emit("newWord", word);
        return false;
    });

});