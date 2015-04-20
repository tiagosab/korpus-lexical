var contextMenu = require("sdk/context-menu"),
    tabs = require("sdk/tabs"),
    {ToggleButton} = require('sdk/ui/button/toggle'),
    panels = require("sdk/panel"),
    self = require("sdk/self"),
    selection = require("sdk/selection"),
    data = self.data,
    _ = require("sdk/l10n").get,
    prefs = require("sdk/simple-prefs"),
    Request = require("sdk/request").Request,
    Hotkey = require("sdk/hotkeys").Hotkey,
    {Cc, Ci} = require("chrome"),
    selection = require("sdk/selection"),
    pageMod = require("sdk/page-mod");


/**Select a word or a fragment of a sentence
 **/
var currentSelection = null,
    mt_charset = "UTF-8",
    replaceAccentedChar = (function() {
      var translate = {
        "ä": "ae", "ö": "oe", "ü": "ue",
        "Ä": "Ae", "Ö": "Oe", "Ü": "Ue",
        "ß": "ss",
        "\u00AD": ""
      };
        return function(x,s) {
        return ( s.replace(x, function(match) { 
          return translate[match]; 
        }) );
        }
    })();
selection.on('select', function () {
    if (selection.isContiguous && selection.text) {
        currentSelection = selection.text;
    }
});


/** Remote HTML response displayed in this panel
 **/
var panel = panels.Panel({
    width: prefs.prefs["panel.width"],
    height: prefs.prefs["panel.height"],
    contentURL: self.data.url("html/panel.html"),
    contentScriptFile: [data.url("js/jquery/jquery-2.1.1.min.js"),
        data.url("js/jquery.slimscroll.min.js"),
        data.url("js/panel.js"),
    ],
    contentScriptWhen: 'ready',
});

/** Language and dictionary preference set in this panel
 **/
var panelbutton = panels.Panel({
    width: 190,
    height: 290,
    contentURL: self.data.url("html/sortable.html"),
    contentScriptFile: [data.url("js/jquery/jquery-2.1.1.min.js"),
                        data.url("js/jquery.sortable.js"),
                        data.url("js/typeahead.bundle.js"),
                        data.url("js/handlebars.js"),
                        data.url("js/jquery.slimscroll.min.js"),
                        data.url("js/sortable.js")
    ],
    onHide: handleHide
});

var button = ToggleButton({
    id: "k-widget",
    label: "Korpus Lexicon",
    icon: {
        "16": "./icon16.png",
    },
    onChange: handleChange
});

function handleChange(state) {
    if (state.checked) {
        panelbutton.show({
            position: button
        });
    }
}

function handleHide() {
    button.state('window', {
        checked: false
    });
}

/** Possibility to display a search console in the current tab
 **/
function consoleK() {
    worker = tabs.activeTab.attach({
        contentScriptFile: [
        data.url('js/jquery/jquery-2.1.1.min.js'),
        data.url('js/typeahead.bundle.js'),    
        data.url('js/consolek.js')
        ]

    });
    worker.port.emit("click", "gd");
    worker.port.on("ready", function () {
        worker.port.emit("init");
    });
    worker.port.on("newWord2", function (word) {
        forgePanelContent(word);
    });
}

/** Add a contextual menu
 **/
var menuItem = contextMenu.Item({
    label: "Speak selection ",
    image: self.data.url("kspeak.png"),
    context: contextMenu.SelectionContext(),
    contentScript: 'self.on("click", function() {' + '   var text = window.getSelection().toString();' + '   self.postMessage(text);' + '});',
    onMessage: function (selectionText) {
        loadTTS(selectionText)
    }
});

var menuItem2 = contextMenu.Item({
    label: "Translate selection ",
    image: self.data.url("conv.png"),
    context: contextMenu.SelectionContext(),
    contentScript: 'self.on("click", function() {' + '   var text = window.getSelection().toString();' + '   self.postMessage(text);' + '});',
    onMessage: function () {
        forgePanelContent(currentSelection)
    }
});

/** Forge appropriate URL, widget label, panel content
 **/
var forgeUrlDict = function (word) {
    var dico = prefs.prefs["dictionnaire"],
        pattern = /[~@#$%^&*_|¯+\=<>\[\]\{\\}\\/]/gi,
        phrase = word.replace(pattern, '');
        word = word.replace(pattern, '').replace(/[()?¿؟!¡,;:."\»«“”„“‘’]/gi, '').replace(/^\s+|\s+$/,'');
    var lang = prefs.prefs["lang." + dico] || '';
        lang = lang.replace(/,\s$/, '');
    var url ="";

    switch (dico) {
    case "babla":
        url = "http://en.bab.la/dictionary/" + lang + "/" + word;
        break;
    case "cnrtl":
        lang = lang.substring(0, lang.indexOf("#") - 1);
        cnrtl = {
            Lexicographie: "http://www.cnrtl.fr/definition/" + word + "//0",
            Etymologie: "http://www.cnrtl.fr/etymologie/" + word + "//0",
            Synonyme: "http://www.crisco.unicaen.fr/des/synonymes/" + word,
            Academie9: "http://www.cnrtl.fr/definition/academie9/" + word,
            Academie8: "http://www.cnrtl.fr/definition/academie8/" + word,
            BHVF: "http://www.cnrtl.fr/definition/bhvf/" + word,
            DMF: "http://atilf.atilf.fr/scripts/dmfX.exe?MENU=menu_dmf;AFFICHAGE=2;ISIS=isis_dmf2012.txt;OUVRIR_MENU=2;s=s0b3e0c38;LANGUE=FR;XMODE=STELLa;FERMER;LEM=" + word,
            DMF2: "http://www.cnrtl.fr/utilities/ADMF?query=" + word,
            Bob:"http://www.languefrancaise.net/bob/liste.php?moduless=siterech&motsclef="+escape(word)
        }
        url = cnrtl[lang];

        break;
    case "littre":
        word = word.replace(/\s+/g, '').toLowerCase();
        url = "http://www.littre.org/definition/" + word;
        break;
    case "dvlf":
        word= word.replace(/\s+/g, '').toLowerCase();
        url = "http://dvlf.uchicago.edu/mot/" + word;
        break;
    case "wordreference":
        lang = lang.substr(0, 4);
        url = "http://www.wordreference.com/" + lang + "/" + word;
        break;
    case "linguee":
        url = "http://www.linguee.com/" + lang + "/search?source=auto&query=" + word;
        break;
    case "woxikon":
        word= word.replace(/\s+/g, '').toLowerCase();
        lang=lang.substring(lang.indexOf("#")+1,lang.length);
        url = "http://www.woxikon.de/" + lang + "/" + word + ".php";
        break;
    case "beolingus":
        var a = lang.indexOf('#');
        lang = lang.substring(0, a - 1);
        url = "http://dict.tu-chemnitz.de/dings.cgi?o=302;service=dict-de;iservice=" + lang + ";optfold=0;query=" + word;;
        break;
    case "thefreedictionary":
        lang = lang.substr(0, 2),
        word = word.replace(/\s+/g, '').toLowerCase();
        url = "http://" + lang + ".thefreedictionary.com/" + word;
        break;
    case "iate":
        lang = lang.substr(0, 2);
        url = "http://iate.europa.eu/SearchByQuery.do?method=search&query=" + word + "&sourceLanguage=" + lang + "&&targetLanguages=s&domain=0&matching=&typeOfSearch=s";
        break;
    case "eurovoc":
        var a = lang.indexOf('#');
        lang = lang.substring(0, a - 1);
        url = "http://eurovoc.europa.eu/drupal/?q=search&text=" + word + "&cl=" + lang;
        break;
    case "pons":
        lang = lang.substr(0, 4);
        url = "http://en.pons.com/translate?l=" + lang + "&q=" + word;
        break;
    case "dictcc":
        lang = lang.substr(0, 4);
        url = "http://" + lang + ".dict.cc/?s=" + word;
        break;
    case "urbandictionary":
        url = "http://www.urbandictionary.com/define.php?term=" + word;
        break;
    case "wortschatzunileipzig":
        var a = lang.indexOf('#'),
            b = lang.length;
            lang = lang.substring(a + 1, b);
        url = "http://corpora.informatik.uni-leipzig.de/cgi-bin/" + lang + "/wort_www?site=10&Wort=" + word;
        break;
    case "duden":
        word = replaceAccentedChar(/[öäüÖÄÜ\u00AD]/g, word.replace(/\s+/g, ""));
        url = "http://www.duden.de/rechtschreibung/" + word;
        break;
    case "dictleo":
        lang = lang.substr(0, 4);
        url = "http://dict.leo.org/" + lang + "/?&search=" + word;
        break;
    case "glosbe":
        var a = lang.indexOf(","),
            n = lang.substring(0, a).indexOf("#"),
            m = lang.substring(a + 2, lang.length).indexOf("#");
        lang = lang.substring(0, n - 1) + "/" + lang.substring(a + 2, a + m + 1);
        url = "http://glosbe.com/" + lang + "/" + word;
        break;
    case "memidex":
        word= word.replace(/\s+/g, '').toLowerCase();
        url = "http://www.memidex.com/" + word;
        break;
    case "wordnet":
        url = "http://wordnetweb.princeton.edu/perl/webwn?sub=Search+WordNet&o0=1&o8=1&o1=1&h=0&s=" + word;
        break;
    case "dictionarycom":
        if (lang == "Dictionary" || lang == "Thesaurus") {
            url = "http://" + lang.toLowerCase() + ".reference.com/browse/" + word;
        } else {
            var a = lang.indexOf(","),
                n = lang.substring(0, a).indexOf("#"),
                m = lang.substring(a + 1, lang.length).indexOf("#");
            lang = "&src=" + lang.substring(0, n - 1) + "&dst=" + lang.substring(a + 2, a + m);
            word = phrase;
            url = "http://translate.reference.com/translate?query=" + encodeURIComponent(word) + lang;
        }
        break;
    case "merriamwebster":
        lang = lang.toLocaleLowerCase();
        url = "http://www.merriam-webster.com/" + lang + "/" + word;
        break;
    case "almaany":
        url = "http://www.almaany.com/home.php?language=" + lang + "&word=" + word;
        break;
    case "collins":
        url = "http://www.collinsdictionary.com/dictionary/" + lang + '/' + encodeURIComponent(word);
        break;
    case "oxforddictionaries":
        var a = lang.indexOf('#'),
            b = lang.length;
        lang = lang.substring(a + 1, b).toLocaleLowerCase();
        url = "http://www.oxforddictionaries.com/definition/" + lang + "/" + word;
        break;
    case "iate":
        url = "http://iate.europa.eu/SearchByQuery.do?method=search&query=" + word + "&sourceLanguage=s&&targetLanguages=s";
        break;
    case "dwds":
        lang = lang.substr(0, 3);
        url = "http://www.dwds.de/panel/get/" + lang + "/?qu=" + word;
        break;
    case "rae":
        word= word.toLowerCase();
        lang=lang.substring(0,lang.indexOf("#")-1).toLowerCase();
        url = "http://lema.rae.es/"+lang+"/srv/search?key=" + word;
        break;
    case "reverso":
        word= word.toLowerCase();
        url = "http://context.reverso.net/translation/" + lang + "/" + word;
        break;
    case "chambers":
        word= word.toLowerCase();
        lang = lang.substring(0, 4).toLowerCase();
        url = "http://www.chambers.co.uk/search.php?title=" + lang + "&query=" + word;
        break;
    default:
        lang = lang.substr(0, 2);
        url = "https://translate.google.com/translate_a/single?client=t&sl=auto&tl=" + lang + "&hl=en&dt=bd&dt=ex&dt=ld&dt=md&dt=qc&dt=rw&dt=rm&dt=ss&dt=t&dt=at&dt=sw&ie=UTF-8&oe=UTF-8&oc=1&otf=2&ssel=0&tsel=0&q=" + encodeURIComponent(phrase);
        break;
    }
    return {
        url: url,
        normalizedWord: word,
        normalizedLang: lang
    }
};

var requestHTML = function (url, dico, word, lang) {
    if (lang === "DMF" || dico === "beolingus"|| dico == "linguee") {
        mt_charset = "iso-8859-15";
    } else if (lang=="Bob") {
        mt_charset="windows-1252";
    }
    else {
        mt_charset = "utf-8"
    }
    var x = Request({
        url: url,
        overrideMimeType: "text/html; charset=" + mt_charset,
        onComplete: function (response) {
            var sanitizedRemoteHTML=sanitizeRemoteHTML(response.text);
            panel.port.emit("lexicon", {
                "dico": dico,
                "word": word,
                "lang": lang,
                "html": sanitizedRemoteHTML,
                "htmljson": response.text
            });
        }
    });
    x.get();
};

function forgePanelContent(word) {
    var newforgeUrlDict = new forgeUrlDict(word),
        url = newforgeUrlDict.url,
        dico = prefs.prefs["dictionnaire"],
        word = newforgeUrlDict.normalizedWord,
        lang = newforgeUrlDict.normalizedLang;

    requestHTML(url, dico, word, lang);
    panel.show();
}

function loadTTS(selectionText) {
    var dico = prefs.prefs["tts"],
        panelTTS = function (url) {
            var x = panels.Panel({
                width: 250,
                height: 150,
                contentURL: url
            });
            return x;
        };

    switch (dico) {
    case "linguatec":
        var lang = prefs.prefs["lang.linguatec"];
            lang = lang.substr(0, 3);
        var url = "http://vrweb.linguatec.net/vrweb/popup1_ptonline?dir=0&srctext=" + encodeURIComponent(selectionText) + "&lang=" + lang + "&guilang=en&readcontent=all&srctype=text&srccharset=utf8&customerid=00000102&cache=0&sndpitch=100&sndspeed=100&sndtype=1&sndquality=4&sndgender=W&simpleparse=1";
        break;
    case "ispeech":
        var lang = prefs.prefs["lang.ispeech"];
            lang = lang.substr(0, lang.indexOf('#') - 1);
        if (lang == 'obama' || lang == 'bush') {
            var apikeyIspeach = 'zzzzzzzzzzzzzzzzaaaaaaaaaaaaaaaa';
        } else {
            var apikeyIspeach = 'ispeech-listenbutton-betauserkey';
        }
        var url = "http://api.ispeech.org/api/rest?apikey=" + apikeyIspeach + "&action=convert&text=" + encodeURIComponent(selectionText) + "&voice=" + lang + "&format=mp3";
        break;
    default:
        var lang = prefs.prefs["lang.googletranslate"];
            lang = lang.substr(0, 2);
        var url = "http://translate.google.com/translate_tts?ie=UTF-8&tl=" + lang + "&q=" + encodeURIComponent(selectionText);
    }
    panelTTS(url).show();
}

/***sanitize HTML response 
source: http://stackoverflow.com/questions/12757649/how-to-use-nsiparserutils-inside-firefox-addon-sdk-1-10-main-js 
*
**/
/** Source firefox https://developer.mozilla.org/en-US/Add-ons/Overlay_Extensions/XUL_School/DOM_Building_and_HTML_Insertion#Safely_Using_Remote_HTML
function parseHTML(doc,html, allowStyle, baseURI, isXML) {
    
    var doc = Cc["@mozilla.org/xmlextras/domparser;1"]
        .createInstance(Ci.nsIDOMParser)
        .parseFromString(html, "text/html");
    
    const PARSER_UTILS = "@mozilla.org/parserutils;1";
    // User the newer nsIParserUtils on versions that support it.
    if (PARSER_UTILS in Components.classes) {
        let parser = Components.classes[PARSER_UTILS]
                               .getService(Ci.nsIParserUtils);
        if ("parseFragment" in parser)
            return parser.parseFragment(html, allowStyle ? parser.SanitizerAllowStyle : 0,
                                        !!isXML, baseURI, doc.documentElement);
    }

 return   Components.classes["@mozilla.org/feed-unescapehtml;1"]
                     .getService(Components.interfaces.nsIScriptableUnescapeHTML)
                     .parseFragment(html, !!isXML, baseURI, doc.documentElement);
}
**/
function sanitizeRemoteHTML(html) {

    var doc = Cc["@mozilla.org/xmlextras/domparser;1"]
        .createInstance(Ci.nsIDOMParser)
        .parseFromString(html, "text/html");

    // Make sure all links are absolute
    for (var i = 0; i < doc.links.length; i++)
        doc.links[i].setAttribute("href", doc.links[i].href);

    // Make sure all stylesheets are inlined
    var stylesheets = doc.getElementsByTagName("link");
    for (i = 0; i < stylesheets.length; i++) {
        try {
            var request = new XMLHttpRequest();
            request.open("GET", stylesheets[i].href, false);
            request.send(null);
            var style = doc.createElement("style");
            style.setAttribute("type", "text/css");
            style.textContent = request.responseText;
            stylesheets[i].parentNode.replaceChild(style, stylesheets[i]);
            i--;
        } catch (e) {
            // Ignore download errors
        }
    }

    // Serialize the document into a string again
    html = Cc["@mozilla.org/xmlextras/xmlserializer;1"]
        .createInstance(Ci.nsIDOMSerializer)
        .serializeToString(doc.documentElement);

    var parser = Cc["@mozilla.org/parserutils;1"].getService(Ci.nsIParserUtils);
    return parser.sanitize(html, parser.SanitizerAllowStyle | parser.SanitizerInternalEmbedsOnly);
}

/**Hotkey configuration
 **/
var showHotKey = [];
if (prefs.prefs["hotkey.active"]) {
    var x = getHotkeyCombination();
    showHotKey[0] = initHotKey1(x[0]);
    showHotKey[1] = initHotKey2(x[1]);
}

function initHotKey1(key) {
    return Hotkey({
        combo: key,
        onPress: function () {
            if (currentSelection != null) {
                if (prefs.prefs["dictionnaire"] == "linguatec" || prefs.prefs["dictionnaire"] == "ispeech") {
                    loadTTS(currentSelection);
                } else {
                    forgePanelContent(currentSelection);
                }
            }
        }
    });
}

function initHotKey2(key) {
    return Hotkey({
        combo: key,
        onPress: function () {
            consoleK();
        }
    });
}

function getHotkeyCombination() {
    var newHotkey = new Array(2);
    newHotkey[0] = prefs.prefs["hotkey.searchselected"] || "F9";
    newHotkey[1] = prefs.prefs["hotkey.opensearch"] || "F8";
    return newHotkey;
}

/** Events listener
 **/
panelbutton.port.on("website", function (dico) {
    if (dico == "linguatec" || dico == "googletranslate" || dico == "ispeech") {
        prefs.prefs["tts"] = dico;
        prefs.prefs["dictionnaire"] = dico;
    } else {
        prefs.prefs["dictionnaire"] = dico;
    }
    panelbutton.port.emit("languagedict", {
        "dictionary": prefs.prefs["dictionnaire"],
        "language": prefs.prefs["lang." + prefs.prefs["dictionnaire"]]
    });
});
panel.port.on("newWord", function (word) {
    forgePanelContent(word);
});
panelbutton.port.on("langpair", function (lang) {
    var dico = prefs.prefs["dictionnaire"];
    prefs.prefs["lang." + dico] = lang;
});
panelbutton.port.on("newsorteddictlist", function (r) {
    prefs.prefs["sortdict"] = r;
});

panelbutton.port.emit("sorteddictlist", {
    "sdl": prefs.prefs["sortdict"],
    "dictionary": prefs.prefs["dictionnaire"],
    "language": prefs.prefs["lang." + prefs.prefs["dictionnaire"]]
});


/** Preferences
 **/
function onPrefChange(prefName) {
    if ((prefName != "dictionnaire") && (prefName != "sortdict")) {
        var langc = prefs.prefs[prefName];
        panelbutton.port.emit("showlanguagepair", langc);
    }
}
prefs.on("", onPrefChange);
prefs.on("panel.width", function () {
    panel.width = prefs.prefs["panel.width"];
});
prefs.on("panel.height", function () {
    panel.height = prefs.prefs["panel.height"];
});
prefs.on("hotkey.active", function () {
    if (!prefs.prefs["hotkey.active"]) {
        showHotKey[0].destroy();
        showHotKey[1].destroy();
    } else {
        var x = getHotkeyCombination();
        showHotKey[0] = initHotKey(x[0]);
        showHotKey[1] = initHotKey(x[1]);
    }
});
prefs.on("hotkey.searchselected", function () {
    var x = getHotkeyCombination();
    showHotKey[0] = initHotKey(x[0]);
});
prefs.on("hotkey.opensearch", function () {
    var x = getHotkeyCombination();
    showHotKey[1] = initHotKey(x[1]);
});

