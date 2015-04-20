self.port.on("sorteddictlist", function (obj) {

    /**Design a scrollbar via JQuery.slimscroll 
     **/
    $('#inner-content-div').slimScroll({
        height: '250px',
        width: '180px',
        railVisible: false,
        alwaysVisible: true,
        size: "10px"

    });

    /**Handlebars templating
     **/
    var IDs = [],
        rank = JSON.parse(obj.sdl),
        dictionaries = {},
        dictlist1 = {
            linguee: ["Linguee", 1],
            babla: ["Babla", 2],
            wordreference: ["Wordreference", 3],
            thefreedictionary: ["TheFreeDictionary", 4],
            cnrtl: ["CNRTL", 5],
            littre: ["Littré", 6],
            dictionarycom: ["DictionaryCom", 7],
            urbandictionary: ["urbandictionary", 8],
            iate: ["IATE", 9],
            eurovoc: ["Eurovoc", 10],
            beolingus: ["Beolingus", 11],
            pons: ["PONS", 12],
            dvlf: ["DVLF", 13],
            almaany: ["Almaany", 14],
            merriamwebster: ["Merriam-Webster", 15],
            collins: ["Collins", 16],
            oxforddictionaries: ["Oxford dictionaries", 17],
            memidex: ["Memidex", 18],
            duden: ["Duden", 19],
            wortschatzunileipzig: ["Wortschatz Uni-Leipzig", 20],
            dictcc: ["DictCC", 21],
            dictleo: ["DictLeo", 22],
            woxikon: ["Woxikon", 23],
            dwds: ["DWDS", 24],
            linguatec: ["Linguatec", 25],
            googletranslate: ["Google translate", 26],
            ispeech: ["ISpeech", 27],
            rae: ["Real Academia Española", 28],
            reverso:["Reverso context",29],
            chambers:["Chambers dictionary",30]
        },
        dictlist2 = [["linguee", "Linguee"], ["babla", "Babla"], ["wordreference", "Wordreference"], ["thefreedictionary", "TheFreeDictionary"], ["cnrtl", "CNRTL"], ["littre", "Littré"], ["dictionarycom", "DictionaryCom"], ["urbandictionary", "Urban Dictionary"], ["iate", "IATE"], ["eurovoc", "Eurovoc"], ["beolingus", "Beolingus"], ["pons", "PONS"], ["dvlf", "DVLF"], ["almaany", "Almaany"], ["merriamwebster", "Merriam-Webster"], ["collins", "Collins"], ["oxforddictionaries", "Oxford dictionaries"], ["memidex", "Memidex"], ["duden", "Duden"], ["wortschatzunileipzig", "Wortschatz Uni-Leipzig"], ["dictcc", "DictCC"], ["dictleo", "Leo"], ["woxikon", "Woxikon"], ["dwds", "DWDS"], ["linguatec", "Linguatec"], ["googletranslate", "Google translate"], ["ispeech", "ISpeech"], ["rae", "Real Academia Española"],["reverso","Reverso context"],["chambers","Chambers dictionary"]],
        selecteddict='';
    
  /* var fromtolan = [], 
        param_t = {
            select_0: function(datum) {
                selectedlang = datum.langvalue;
            },
            select_1: function (datum) {
                if (fromtolan.length < 2) {
                    fromtolan.push(datum.langvalue);
                    $("#tags").val("");
                }
                if (fromtolan.length == 2) {
                    selectedlang = fromtolan[0] + ", " + fromtolan[1];
                    $("#tags").val("");
                    fromtolan = [];
                }
            },
            filter: function (suggestions) {
                return $.grep(suggestions, function (suggestion) {
                    return $.inArray(suggestion.val, selected) === -1;
                });
            },
            source_0: function (languages) {languages.ttAdapter();},
            source_1: function (query, cb) {
                languages.get(query, function (suggestions) {
                    cb(param_t.filter(suggestions));
                });
            },
            source_01: function (selecteddict) {
                switch (selecteddict) {
                case "glosbe":
                    return [param_t.source_1, param_t.select_1];
                    break;
                case "dictionarycom":
                    return [param_t.source_1, param_t.select_1];
                    break;
                default:
                    return [param_t.source_0, param_t.select_0];
                }
            }
        }; 
*/
    function forgeDictionariesList() {
        for (var i = 0; i < Object.keys(dictlist1).length; i++) {
            dictionaries.dictionary[i] = {};
            dictionaries.dictionary[i].dict = dictlist2[rank[i] - 1][0];
            dictionaries.dictionary[i].content = dictlist2[rank[i] - 1][1];
        }
        return dictionaries;
    }

    dictionaries.dictionary = [];
    dictionaries = forgeDictionariesList();

    var template = $("#dictionaries-template").html(),
        compile = Handlebars.compile(template),
        result = compile(dictionaries);
    $("#sortable").html(result);
    $("h2").text(dictlist1[obj.dictionary][0]);
    $("#dicolangpair").text("-- " + obj.language);

    $("#sortable").sortable();

    $('#sortable').sortable().bind('sortupdate', function () {
        IDs = $("li[id]").map(function () {
            return this.id;
        })
            .get();
        var swap = $.map(IDs, function (n, i) {
            return [dictlist1[n][1]];
        });
        self.port.emit("newsorteddictlist", JSON.stringify(swap));
    });

    $('#sortable li >span').click(function () {
        $(this).css({
            'background-color': '#FECA40',
            'color': 'black'
        }).closest('li').siblings().find('> span').css({
            'background-color': 'white',
            'color': 'black'
        });
    });

    /**Autocomplete language via typeahead.js
     **/
       var languageslist = {
            "linguee":["english-german","english-french","english-spanish","english-portuguese","english-italian","english-russian","english-japanese","english-chinese","english-polish","english-dutch","german-english","deutsch-franzoesisch","deutsch-spanisch","deutsch-portugiesisch","french-english","francais-allemand","francais-espagnol","francais-portugais","spanish-english","espanol-aleman","espanol-frances","espanol-portugues","portuguese-english","portugues-alemao","portugues-frances","portugues-espanhol","italian-english","russian-english","japanese-english","chinese-english","polish-english","dutch-english"],
            "babla":["arabic-english","chinese-english","chinese-german","czech-english","danish-english","dutch-english","english-arabic","english-chinese","english-czech","english-danish","english-dutch","english-finnish","english-french","english-german","english-hindi","english-hungarian","english-indonesian","english-italian","english-japanese","english-korean","english-norwegian","english-polish","english-portuguese","english-romanian","english-russian","english-spanish","english-swahili","english-swedish","english-turkish","finnish-english","french-english","french-german","french-italian","french-spanish","german-chinese","german-english","german-french","german-italian","german-polish","german-portuguese","german-russian","german-spanish","german-swedish","german-turkish","hindi-english","hungarian-english","indonesian-english","italian-english","italian-french","italian-german","italian-romanian","italian-spanish","japanese-english","korean-english","norwegian-english","polish-english","polish-german","portuguese-english","portuguese-german","portuguese-spanish","romanian-english","romanian-italian","russian-english","russian-german","spanish-english","spanish-french","spanish-german","spanish-italian","spanish-portuguese","swahili-english","swedish-english","swedish-german","turkish-english","turkish-german"],
            "wordreference":["enes #English Spanish","esen #Spanish English","esfr #Spanish French","espt #Spanish Portuguese","enfr #English French","fren #French English","fres #French Spanish","enit #English Italian","iten #Italian English","enar #English Arabic","aren #Arabic English","ende #English German","deen #German English","enru #English Russian","ruen #Russian English","enpt #English Portuguese","pten #Portuguese English","ptes #Portuguese Spanish","enpl #English Polish","plen #Polish English","enro #English Romanian","roen #Romanian English","encz #English Czech","czen #Czech English","engr #English Greek","gren #Greek English","entr #English Turkish","tren #Turkish English","enzh #English Chinese","zhen #Chinese English","enja #English Japanese","jaen #Japanese English","enko #English Korean","koen #Korean English"],
            "thefreedictionary":["en #english","es #spanish","de #deutsch","fr #french","ar #arabic","zh #chinese","pl #polish","pt #portuguese","nl #dutch","no #norwegian","el #greek","ru #russian","tr #turkish"],
            "cnrtl":["Lexicographie #TLFi","Etymologie #TLFi","Synonyme #CRISCO","Academie9 #Académie française, 9ème éd.","Academie8 #Académie française, 8ème éd.","BHVF #Base Historique du Vocabulaire Français","DMF #Dictionnaire du Moyen Français (1330-1500)","Bob #Argot,français populaire et familier"],
            "littré":[""],
            "dictionarycom":["Dictionary","Thesaurus"],
            "urbandictionary":[""],
            "iate":["bg #Bulgarian","cs #Czech","da #Danish","de #German","el #Greek","en #English","es #Spanish","et #Estonian","fi #Finnish","fr #French","ga #Irish","hr #Croatian","hu #Hungarian","it #Italian","la #Latin","lt #Lithuanian","lv #Latvian","mt #Maltese","nl #Dutch","pl #Polish","pt #Portuguese","ro #Romanian","sk #Slovak","sl #Slovenian","sv #Swedish"],
            "eurovoc":["bg #(bg) Български","es #(es) Español","cs #(cs) Čeština","da #(da) Dansk","de #(de) Deutsch","et #(et) Eesti","el #(el) Ελληνικά","en #(en) English","fr #(fr) Français","hr #(hr) Hrvatski","it #(it) Italiano","lv #(lv) Latviešu","lt #(lt) Lietuvių","hu #(hu) Magyar","mt #(mt) Malti","nl #(nl) Nederlands","pl #(pl) Polski","pt #(pt) Português","ro #(ro) Română","sk #(sk) Slovenčina","sl #(sl) Slovenščina","fi #(fi) Suomi","sv #(sv) Svenska","sr #(sr) Српски"],
            "pons":["zhen #Chinese English","zhde #Chinese German","enzh #English Chinese","enfr #English French","ende #English German","enit #English Italian","enpl #English Polish","enpt #English Portuguese","enru #English Russian","ensl #English Slovenian","enes #English Spanish","fren #French English","frpl #French Polish","frsl #French Slovenian","fres #French Spanish","dezh #German Chinese","deen #German English","defr #German French","deel #German Greek","deit #German Italian","dela #German Latin","depl #German Polish","dept #German Portuguese","deru #German Russian","desl #German Slovenian","dees #German Spanish","detr #German Turkish","decs #German Czech","deda #German Danish","denl #German Dutch","dehu #German Hungarian","deno #German Norwegian","desv #German Swedish","elde #Greek German","iten #Italian English","itde #Italian German","itpl #Italian Polish","itsl #Italian Slovenian","lade #Latin German","plen #Polish English","plfr #Polish French","plde #Polish German","plit #Polish Italian","plru #Polish Russian","ples #Polish Spanish","pten #Portuguese English","ptde #Portuguese German","ptes #Portuguese Spanish","ruen #Russian English","rude #Russian German","rupl #Russian Polish","slen #Slovenian English","slfr #Slovenian French","slde #Slovenian German","slit #Slovenian Italian","sles #Slovenian Spanish","esen #Spanish English","esfr #Spanish French","esde #Spanish German","espl #Spanish Polish","espt #Spanish Portuguese","essl #Spanish Slovenian","trde #Turkish German","czde #czech German","dnde #Danish German","nlde #dutch German","hude #Hungarian German","node #Norwegian German","slde #Slovenian German"],
            "dvlf":["Francais"],
            "almaany":["arabic","english","spanish","portuguese","french","turkish","persian"],
            "merriamwebster":["Dictionary","Thesaurus"],
            "collins":["english-german","german-english","english-french","french-english","english-spanish","spanish-english","english-italian","italian-english"],
            "oxforddictionaries":["Dictionary #english","Dictionary #american_english","Synonyms #english-thesaurus","Synonyms #american_english-thesaurus"],
            "memisdex":["English"],
            "duden":["Deutsch"],
            "wortschatzunileipzig":["Abkhaz #abk_wikipedia_2012","Acholi #ach_newscrawl_2011","Afrikaans #afr-za_web_2013","Akan #aka_wikipedia_2012","Albanian #sqi_newscrawl_2011","Amharic #amh_wikipedia_2011","Arabic #ramar_db","Arabic-Egyptian #arz_wikipedia_2011","Aragonese #arg_wikipedia_2011","Armenian #hye_newscrawl_2011","Aromanian #rup_wikipedia_2012","Assamese #asm_wikipedia_2012","AssyrianNeo-Aramaic #aii_wikipedia_2012","Asturian #ast_wikipedia_2011","Avar #ava_wikipedia_2012","Azerbaijanian #aze_newscrawl_2011","Balkar #krc_wikipedia_2012","Bamanankan #bam_wikipedia_2012","Banjar #bjn_wikipedia_2012","Bashkir #bak_wikipedia_2011","Basque #eus_web_2002","Bavarian #bar_wikipedia_2012","Belarusan #bel_newscrawl_2011","Bengali #ben_newscrawl_2011","Bicolano #bcl_wikipedia_2011","Bishnupriya #bpy_wikipedia_2011","Bosnian #bos_wikipedia_2007","Breton #bre_wikipedia_2007","Bulgarian #bul_newscrawl_2011","Buriat #bua_wikipedia_2012","Catalan #cat_web_2004","Cebuano #ceb_wikipedia_2011","Chavacano #cbk_wikipedia_2012","Chechen #che_wikipedia_2012","Cherokee #chr_wikipedia_2012","Chinese(simplified) #zho_news_2007-2009","Chinese-MinDong #cdo_wikipedia_2012","Chinese-MinNan #nan_wikipedia_2011","Chuvash #chv_wikipedia_2011","Cornish #cor_wikipedia_2012","Corsican #cos_wikipedia_2011","CrimeanTatar #crh_wikipedia_2012","Croatian #hrv_newscrawl_2011","Czech #ces_newscrawl_2011","Danish #dan_web_2002","Dimli #diq_wikipedia_2011","Dutch #nld_web_2002","Emiliano-Romagnolo #eml_wikipedia_2012","English #eng_news_2008","English-(AU) #eng-au_web_2002","English-(CA) #eng-ca_web_2002","English-(NZ) #eng-nz_web_2002","English-(UK) #eng-uk_web_2002","Esperanto #epo_wikipedia_2011","Estonian #est_news","Faroese #fao_newscrawl_2011","Fijian #fij_newscrawl_2011","Finnish #fin_web_2002","French #fra_mixed_2012","Frisian-Northern #frr_wikipedia_2012","Frisian-Western #fry_newscrawl_2011","Friulian #fur_wikipedia_2012","Fulah #ful_wikipedia_2012","Gaelic-Irish #gle_wikipedia_2012","Gaelic-Scottish #gla_wikipedia_2007","Gagauz #gag_wikipedia_2012","Galician #glg_wikipedia_2012","Ganda #lug_newscrawl_2011","Georgian #kat_newscrawl_2011","German #de","German-(CH) #deu-ch_web_2002","German-Swiss #gsw_wikipedia_2012","Gilaki #glk_wikipedia_2011","Goan-Konkani #gom_newscrawl_2011","Greek #ell_newscrawl_2011","Greenlandic #kal_newscrawl_2011","Guarani #grn_wikipedia_2012","Gujarati #guj_newscrawl_2011","Haitian #hat_wikipedia_2011","Hausa #hau_newscrawl_2011","Hebrew #heb_wikipedia_2010","Hindi #hin_news_2010","Hindi-Fiji #hif_wikipedia_2011","Hungarian #hun_newscrawl_2011","Icelandic #isl_web_2005","Ido #ido_wikipedia_2007","Ilocano #ilo_web_2012","Indonesian #ind_mixed_2012","Interlingua #ina_wikipedia_2011","Interlingue #ile_wikipedia_2012","Italian #ita_news_2005-2009","Japanese #jpn_news_2005-2008","Javanese #jav_wikipedia_2011","K??h #ksh_wikipedia_2012","Kabardian #kbd_wikipedia_2012","Kabyle #kab_wikipedia_2012","Kalmyk-Oirat #xal_wikipedia_2012","Kannada #kan_wikipedia_2011","Karakalpak #kaa_wikipedia_2012","Kashubian #csb_wikipedia_2012","Kazakh #kaz_wikipedia_2010","Khmer-Central #khm_newscrawl_2011","Kiswahili #swh_wikipedia_2011","Klingon #tlh_wikia_2011","Komi #kom_wikipedia_2012","Konkani #knn_web_2012","Korean #kor_newscrawl_2011","Kurdish #kur_newscrawl_2011","Kyrgyz #kir_newscrawl_2011","Ladino #lad_wikipedia_2012","Lak #lbe_wikipedia_2012","Lao #lao_newscrawl_2011","Latgalian #ltg_wikipedia_2012","Latin #lat_wikipedia_2007","Latvian #lav_wikipedia_2007","Ligurian #lij_wikipedia_2012","Limburgish #lim_wikipedia_2012","Lingala #lin_wikipedia_2012","Lithuanian #lit_newscrawl_2011","Lushai #lus_newscrawl_2011","Luxemburgian #ltz_wikipedia_2007","Macedonian #mkd_wikipedia_2010","Malagasy #mlg_web_2012","Malay #msa_newscrawl_2011","Malayalam #mal_newscrawl_2011","Maldivian #div_newscrawl_2011","Maltese #mlt_newscrawl_2011","Manx #glv_wikipedia_2012","Maori #mri_web_2011","Marathi #mar_news_2010","Mari-Meadow #mhr_wikipedia_2012","Mari-Western #mrj_wikipedia_2011","Mingrelian #xmf_wikipedia_2012","Mirandese #mwl_wikipedia_2012","Moksha #mdf_wikipedia_2012","Mongolian(Cyrillic) #mon-cyr_newscrawl_2011","Mongolian(traditional) #mon_news_2011","Nahuatl #nah_wikipedia_2011","Navajo #nav_wikipedia_2012","Nepali #nep_news_2010","Newari #new_wikipedia_2009","Norse-Old #non_web_2012","Norwegian(Bokm? #nob_web_2002","Norwegian(Nynorsk) #nno_wikipedia_2007","Novial #nov_wikipedia_2012","Occitan #oci_wikipedia_2007","OldEnglish #ang_wikipedia_2012","Oriya #ori_wikipedia_2012","Oromo #orm_wikipedia_2012","Oromo-WestCentral #gaz_web_2012","Ossetian #oss_wikipedia_2011","Pampanga #pam_wikipedia_2011","Pangasinan #pag_wikipedia_2012","Panjabi #pan_newscrawl_2011","Panjabi-Western #pnb_wikipedia_2011","Papiamento #pap_newscrawl_2011","Pashto #pus_newscrawl_2011","Pennsylvanian-Dutch #pdc_wikipedia_2007","Persian #fas_newscrawl_2011","Picard #pcd_wikipedia_2012","Piemontese #pms_wikipedia_2011","Polish #pol_newscrawl_2011","Portuguese-(Brazil) #por-br_newscrawl_2011","Portuguese-(Macao) #por-mo_newscrawl_2011","Portuguese-(Portugal) #por-pt_newscrawl_2011","Romanian #ron_newscrawl_2011","Romansch #roh_newscrawl_2011","Romany #rom_wikipedia_2012","Russian #rus_newscrawl_2011","Rusyn #rue_wikipedia_2010","Saami-North #sme_wikipedia_2012","Sami #smi_newscrawl_2011","Samoan #smo_wikipedia_2012","Samogitian #sgs_wikipedia_2011","Sanskrit #san_newscrawl_2011","Sardinian #srd_wikipedia_2012","Scots #sco_wikipedia_2011","Serbian #srp_wikipedia_2010","Shona #sna_web_2012","Sicilian #scn_wikipedia_2011","Silesian #szl_wikipedia_2012","Sindhi #snd_wikipedia_2012","Sinhala #sin_wikipedia_2011","Slovak #slk_newscrawl_2011","Slovenian #slv_newscrawl_2011","Somali #som_newscrawl_2011","Sorbian-(Lower) #dsb_wikipedia_2012","Sorbian-(Upper) #hsb_news_1999","Sotho-Northern #nso-za_web_2013","Sotho-Southern #sot_web_2012","Spanish #spa_newscrawl_2011","Spanish-(Mexico) #spa-mx_web_2002","Sundanesian #sun_wikipedia_2007","Swahili #swa_newscrawl_2011","Swedish #swe_web_2002","Tagalog #tgl_newscrawl_2011","Tajik #tgk_newscrawl_2011","Tama #ten_wikipedia_2012","Tamil #tam_newscrawl_2011","Tatar #tat_news_2005-2011","Telugu #tel_newscrawl_2011","Tetun #tet_wikipedia_2012","Thai #tha_newscrawl_2011","Tibetan-Central #bod_wikipedia_2012","Tigrigna #tir_wikipedia_2012","Tok-Pisin #tpi_newscrawl_2011","Tongan #ton_wikipedia_2012","Tswana #tsn_web_2012","Turkish #tur_news_2005","Turkmen-Latin #tuk-latn_web_2012","Udmurt #udm_wikipedia_2012","Ukrainian #ukr_newscrawl_2011","Urdu #urd_news_2007","Uyghur #uig_newscrawl_2011","Uzbek #uzn-cyr_newscrawl_2011","Uzbek-Latin #uzn-lat_newscrawl_2011","Venda #ven_wikipedia_2012","Venetian #vec_wikipedia_2011","Vietnamese #vie_wikipedia_2007","Vlaams #vls_wikipedia_2012","Walloon #wln_wikipedia_2012","Waray #war_wikipedia_2011","Welsh #cym_wikipedia_2007","Wolof #wol_wikipedia_2012","Yakut #sah_wikipedia_2011","Yiddish #yid_wikipedia_2011","Yoruba #yor_wikipedia_2011","Zeeuws #zea_wikipedia_2012","Zhuang #zha_wikipedia_2012","Zulu #zul_mixed_2013"],
            "dictcc":["debg #German Bulgarian","debs #German Bosnian","decs #German Czech","deda #German Danish","deel #German Greek","deen #German English","deeo #German Esperanto","dees #German Spanish","defi #German Finnish","defr #German French","dehr #German Croatian","dehu #German Ungarian","deis #German Icelandic","deit #German Italian","dela #German Latein","denl #German Dutch","deno #German Norwegian","depl #German Polish","dept #German Portuguese","dero #German Romanian","deru #German Russian","desk #German Slovak","desq #German Albanian","desr #German Serbian","desv #German Swedish","detr #German Turkish","enbg #English Bulgarian","enbs #English Bosnian","encs #English Czech","enda #English Danish","ende #English German","enel #English Greek","eneo #English Esperanto","enes #English Spanish","enfi #English Finnish","enfr #English French","enhr #English Croatian","enhu #English Hungarian","enis #English Icelandic","enit #English Italian","enla #English Latin","ennl #English Dutch","enno #English Norwegian","enpl #English Polish","enpt #English Portuguese","enro #English Romanian","enru #English Russian","ensk #English Slovak","ensq #English Albanian","ensr #English Serbian","ensv #English Swedish","entr #English Turkish","frde #French German"],
            "dictleo":["frde #french german","ende #english german","esde #spanish german","itde #italian german","chde #chinese german","rude #russian german","ptde #portuguese german","plde #polish german"],
            "woxikon":["French #deutsch-franzoesisch","Spanish #deutsch-spanish","Swedish #deutsch-schwedisch","Finnish #deutsch-finnisch","Russian #deutsch-russisch","Türkisch #deutsch-tuerkisch","English #deutsch-englisch","Italian #deutsch-italienisch","Dutch #deutsch-niederlaendisch","Portuguese #deutsch-portugiesisch","Polish #deutsch-polnisch","Norwegian #deutsch-norwegisch"],
            "beolingus":["dict-de #Synonyms","fortune-de #Proverbs, aphorisms, quotations","de-en #german english dictionary","de-en-ex #german english example sentences","de-es #german spanish dictionary","de-es-ex #german spanish example sentences","de-pt #german portuguese dictionary","de-pt-ex #german portuguese example sentences"],
            "dwds":["147 #DWDS Wörterbuch","148 #DWDS Etymologisches Wörterbuch (nach Pfeifer)","149 #DWDS OpenThesaurus"],
            "linguatec":["ENG #English (British)","FRF #French Français","GED #German Deutsch","ITI #Italian Italiano","PTP #Portuguese Português","SPE #Spanish Español"],
            "googletranslate":["af #Afrikaans Afrikaans","sq #Albanian Shqip","ar #Arabic عربي","hy #Armenian Հայերէն","az #Azerbaijani آذربایجان دیلی","eu #Basque Euskara","be #Belarusian Беларуская","bg #Bulgarian Български","ca #Catalan Català","zh-CN #Chinese (Simplified) 中文简体","zh-TW #Chinese (Traditional) 中文繁體","hr #Croatian Hrvatski","cs #Czech Čeština","da #Danish Dansk","nl #Dutch Nederlands","en #English English","et #Estonian Eesti keel","tl #Filipino Filipino","fi #Finnish Suomi","fr #French Français","gl #Galician Galego","ka #Georgian ქართული","de #German Deutsch","el #Greek Ελληνικά","ht #Haitian Creole Kreyòl ayisyen","iw #Hebrew עברית","hi #Hindi हिन्दी","hu #Hungarian Magyar","is #Icelandic Íslenska","id #Indonesian Bahasa Indonesia","ga #Irish Gaeilge","it #Italian Italiano","ja #Japanese 日本語","ko #Korean 한국어","lv #Latvian Latviešu","lt #Lithuanian Lietuvių kalba","mk #Macedonian Македонски","ms #Malay Malay","mt #Maltese Malti","no #Norwegian Norsk","fa #Persian فارسی","pl #Polish Polski","pt #Portuguese Português","ro #Romanian Română","ru #Russian Русский","sr #Serbian Српски","sk #Slovak Slovenčina","sl #Slovenian Slovensko","es #Spanish Español","sw #Swahili Kiswahili","sv #Swedish Svenska","th #Thai ไทย","tr #Turkish Türkçe","uk #Ukrainian Українська","ur #Urdu اردو","vi #Vietnamese Tiếng Việt","cy #Welsh Cymraeg","yi #Yiddish ייִדיש"],
            "ispeech":["usenglishfemale #US English Female","usenglishmale #US English Male","ukenglishfemale #UK English Female","ukenglishmale #UK English Male","auenglishfemale #AU English Female","usspanishfemale #US Spanish Female","usspanishmale #US Spanish Male","chchinesefemale #Chinese Female 中文简体","chchinesemale #Chinese Male 中文简体","hkchinesefemale #HK Cantonese Female","twchinesefemale #TW Chinese Female 中文繁體","jpjapanesefemale #Japanese Female 日本語","jpjapanesemale #Japanese Male 日本語","krkoreanfemale #Korean Female 한국어","krkoreanmale #Korean Male 한국어","caenglishfemale #Canadian English Female","huhungarianfemale #Hungarian Female","brportuguesefemale #BR Portuguese Female","eurportuguesefemale #Portuguese Female","eurportuguesemale #Portuguese Male","eurspanishfemale #Spanish Female","eurspanishmale #Spanish Male","eurcatalanfemale #Catalan Female","eurczechfemale #Czech Female","eurdanishfemale #Danish Female","eurfinnishfemale #Finnish Female","eurfrenchfemale #French Female","eurfrenchmale #French Male","eurnorwegianfemale #Norweigian Female","eurdutchfemale #Dutch Female","eurpolishfemale #Polish Female","euritalianfemale #Italian Female","euritalianmale #Italian Male","eurturkishfemale #Turkish Female","eurturkishmale #Turkish Male","eurgreekfemale #Greek Female Ελληνικά","eurgermanfemale #German Female","eurgermanmale #German Male","rurussianfemale #Russian Female Русский","rurussianmale #Russian Male Русский","swswedishfemale #Swedish Female","cafrenchfemale #CA French Female","cafrenchmale #CA French Male","arabicmale #Arabic Male عربي","obama #","bush #"],
            "rae":["DRAE #Diccionario de la lengua española","DPD #Diccionario panhispánico de dudas","DESEN #Diccionario esencial"],
            "reverso":["english-french","french-english","english-spanish","spanish-english","english-portuguese","portuguese-english","english-italian","italian-english","english-german","german-english","french-spanish","spanish-french","french-portuguese","portuguese-french","french-italian","italian-french","french-german","german-french","spanish-portuguese","portuguese-spanish","arabic-english","english-arabic","arabic-french","french-arabic"],
            "chambers":["21st century dictionary","Thesaurus"]
            },
        selectedlanglist = [],
        selectedlang='';

    $("li").click(function () {
        $("input[name='langpair']").val('');
        selecteddict = $(this).attr("name");
        selectedlanglist = languageslist[selecteddict];
        self.port.emit("website", selecteddict);

        $("h2").text(dictlist1[selecteddict][0]);
        self.port.on("languagedict", function (x) {
            $("#dicolangpair").text("-- " + x.language);
        });
        
        
        $('#tags').typeahead('destroy');
        var languages = new Bloodhound({
            datumTokenizer: Bloodhound.tokenizers.obj.whitespace('langvalue'),
            queryTokenizer: Bloodhound.tokenizers.whitespace,
            limit: 10,
            local: $.map(selectedlanglist, function (l) {
                return {
                    langvalue: l
                };
            })
        }); 

        languages.initialize();

        $('#tags').typeahead({
            highlight: true,
            minLength: 1
        }, {
            name: 'languages',
            displayKey: 'langvalue',
            source: languages.ttAdapter(),
            templates: {
                empty: 'No matches'
            }
        }).on('typeahead:selected', function ($e, datum, dataset) {
                selectedlang = datum.langvalue;
                $("#tags").change(function () {
                    $("#dicolangpair").text("-- " + selectedlang);
                    if (selectedlang != null||'') {
                        self.port.emit("langpair", selectedlang);
                        $("#tags").val("");
                     }
                }).change();
            });
        });
    });