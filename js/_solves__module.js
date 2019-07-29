/**
* Solves 2.0
@Author Thiago Gonçalves da Silva Goulart (SOLVES SOlUÇÕES EM SOFTWARE)
* 11/04/2019.)
*last version of 15/07/2019
**/

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('jquery')) :
  typeof define === 'function' && define.amd ? define(['exports', 'jquery'], factory) :
  (global = global || self, factory(global.bootstrap = {}, global.jQuery));
}(this, function (exports, $) { 'use strict';

  var Solves = function() {

    var versionId = 3;
    var version = '2.0';
    var debug = false;
    var siteUrl = 'https://...';
    var siteTitulo = 'Solves Site Name';
    var siteShortName = 'solves_short_name';
    var icon =  siteUrl+'...';
    var solvesPlugins = [];
    var app = false;
    var url = null;
    /* PADRÃO DE NOMES DE PARAMETROS  */
    var PARAM_NAME_DADOS = 'dados';
    var PARAM_NAME_TOKEN = 'token';
    var PARAM_NAME_USERDATA = 'userData';
    var PARAM_NAME_PERFIL = 'perfil';
    var PARAM_NAME_USUARIO = 'usuario';
    var PARAM_NAME_FIREBASE_AUTH_USER = 'firebaseauthuser';
    var PARAM_NAME_FIREBASE_AUTH_TOKEN = 'firebaseauthtoken';
    var PARAM_NAME_FIREBASE_AUTH_RESULT = 'firebaseauthresult';
    var PARAM_NAME_ADDRESS_DATA = 'addressData';
    var PARAM_NAME_GEO_DATA = 'geoData';
    /* AUTH OBJECT */
    var PERFIL_LOGADO = null;
    /* DFADOS DE TELA */
    var submiting = false;
    var telaAtualId = null;
    var telaAtualTitulo = null;
    var telaAtualSubtitulo = null;
    /* DADOS DINÂMICOS*/
    var submiting = false;
    var filtro = null;
    var params = null;
    var lista = [];
    var objetoId = null;
    var objeto = null;
    var funcao = null;
    var subObjetoId = null;
    var subObjeto = null;
    var subObjetoQtd = 0;
    var subObjetos = [];
    /*FIREBASE*/
    var fireBaseConfig = {};
    var fireBaseInitialized = false;
    var fireBaseApp = null;
    function Solves(p_siteUrl, p_siteTitulo, p_siteShortName, p_icon) {
      this.siteUrl = p_siteUrl;
      this.siteTitulo = p_siteTitulo;
      this.siteShortName = p_siteShortName;
      this.icon = p_icon;
      for(var keyPlugin in this.solvesPlugins){
        var plugin = this.solvesPlugins[keyPlugin];
        if (plugin.afterSolvesInit && (typeof plugin.afterSolvesInit == "function")) {plugin.afterSolvesInit();}
      }
    }

    var _proto = Solves.prototype;

    _proto.setFireBaseConfig = function setFireBaseConfig(config){
      if(config!==undefined && this.isNotEmpty(config.apiKey) && this.isNotEmpty(config.authDomain) && this.isNotEmpty(config.projectId) 
        && this.isNotEmpty(config.messagingSenderId) && this.isNotEmpty(config.databaseURL) && this.isNotEmpty(config.storageBucket)){
        this.fireBaseConfig = config;
        if (!firebase || !firebase.apps.length) {
          // Initialize Firebase      
          this.fireBaseInitialized = true;
          this.fireBaseApp = firebase.initializeApp(this.fireBaseConfig);
        }
      }
    }
    _proto.addSolvesPlugin = function addSolvesPlugin(key, p){
        if(this.solvesPlugins[key]!==undefined && this.solvesPlugins[key]!=null && this.solvesPlugins[key].solvesPluginName==key){
          return this.solvesPlugins[key];
        }
        this.solvesPlugins[key] = p;
    }
    _proto.getSolvesPlugin = function getSolvesPlugin(key){
        if(this.solvesPlugins[key]!==undefined && this.solvesPlugins[key]!=null && this.solvesPlugins[key].solvesPluginName==key){
          return this.solvesPlugins[key];
        }
        return null;
    }
    _proto.hasSolvesPlugin = function hasSolvesPlugin(key){
        return (this.solvesPlugins[key]!=null);
    }
    _proto.isApp = function isApp(){
      return this.isTrue(this.app);
    }
    _proto.getCompleteUrl = function getCompleteUrl(root, url){
      return (this.isTrue(root)?'/':this.siteUrl)+url;
    }
    _proto.especialCharMask = function especialCharMask(str){
        str = str.replace(/[ÀÁÂÃÄÅ]/g,"A");
        str = str.replace(/[àáâãäå]/g,"a");
        str = str.replace(/[ÈÉÊË]/g,"E");
        return (str.replace(/[^a-z0-9]/gi,''));
    }    
    _proto.isTrue = function isTrue(v){
      return (v!==undefined && v!==null && (v==true || v=='true' || v==1 || v=="1" || v=='on'));
    }
    _proto.isNotEmpty = function isNotEmpty(val){
      return val!==undefined && val!=null && val!="null" && val!="" && val!="undefined";
    }
    _proto.getAllUrlParams = function getAllUrlParams(url) {

      // get query string from url (optional) or window
      var queryString = url ? url.split('?')[1] : window.location.search.slice(1);

      // we'll store the parameters here
      var obj = {};

      // if query string exists
      if (queryString) {

        // stuff after # is not part of query string, so get rid of it
        queryString = queryString.split('#')[0];

        // split our query string into its component parts
        var arr = queryString.split('&');

        for (var i=0; i<arr.length; i++) {
          // separate the keys and the values
          var a = arr[i].split('=');

          // in case params look like: list[]=thing1&list[]=thing2
          var paramNum = undefined;
          var paramName = a[0].replace(/\[\d*\]/, function(v) {
            paramNum = v.slice(1,-1);
            return '';
          });

          // set parameter value (use 'true' if empty)
          var paramValue = typeof(a[1])==='undefined' ? true : a[1];

          // (optional) keep case consistent
          paramName = paramName.toLowerCase();
          paramValue = paramValue.toLowerCase();

          // if parameter name already exists
          if (obj[paramName]) {
            // convert value to array (if still string)
            if (typeof obj[paramName] === 'string') {
              obj[paramName] = [obj[paramName]];
            }
            // if no array index number specified...
            if (typeof paramNum === 'undefined') {
              // put the value on the end of the array
              obj[paramName].push(paramValue);
            }
            // if array index number specified...
            else {
              // put the value at that index number
              obj[paramName][paramNum] = paramValue;
            }
          }
          // if param name doesn't exist yet, set it
          else {
            obj[paramName] = paramValue;
          }
        }
      }

      return obj;
    }
    _proto.getAjaxParam = function getAjaxParam(url, formData, successFunc, errorFunc){
      var token = null;
      var pluginStorage = this.getSolvesPlugin('SolvesStorage');
      if(pluginStorage!=null){
        token = pluginStorage.getStorageAuthToken();
      }
      return {
            type: "POST",
            url: url,          
            processData:false,
            contentType: false,
            cache: false,
            data: formData,
            headers: {"Authorization": token},
             success: function(data){ 
                successFunc(data);
                result = jQuery.parseJSON(data);
                if($.Solves.isTrue(result['logoff'])){
                  console.log('não autorizado.');
                  $.Solves.logoff();
                }
                $.Solves.loaded();
              },
              error: function(data){ 
                errorFunc(data);
                $.Solves.loaded();
              },
              complete: function(data){
                $.Solves.loaded();
              }
        };
    }
    _proto.getAjaxExternalParam = function getAjaxExternalParam(url, type, data, successFunc, errorFunc){
      return {
            type: type,
            url: url,          
            processData:false,
            contentType: false,
            cache: false,
            data: data,
             success: function(data){ 
                successFunc(data);
                console.log(data);
                result = jQuery.parseJSON(data);
                console.log(result);
                this.loaded();
              },
              error: function(data){ 
                errorFunc(data);
                this.loaded();
              }
        };
    }
    _proto.doAjax = function doAjax(url, formData, successFunc, errorFunc){
      $.ajax(this.getAjaxParam(url, formData, successFunc, errorFunc));
    }
    _proto.doAjaxExternal = function doAjaxExternal(url, type, data, successFunc, errorFunc){
      $.ajax(this.getAjaxExternalParam(url, type, data, successFunc, errorFunc));
    }
    _proto.doMaskForMoney = function doMaskForMoney(elmId){
        $('#'+elmId).maskMoney({symbol:"R$",decimal:",",thousands:"."});
    }
    _proto.getUserLabel = function getUserLabel(user_id, user_id_label){
      return (this.PERFIL_LOGADO.user_id==user_id ? 'Eu' :user_id_label);
    }
    _proto.getIdade = function getIdade(date) {
       var ano_aniversario = date.substring(0,4);
       var mes_aniversario = date.substring(5,7);
       var dia_aniversario = date.substring(8,10);
        var d = new Date,
            ano_atual = d.getFullYear(),
            mes_atual = d.getMonth() + 1,
            dia_atual = d.getDate(),

            ano_aniversario = +ano_aniversario,
            mes_aniversario = +mes_aniversario,
            dia_aniversario = +dia_aniversario,

            quantos_anos = ano_atual - ano_aniversario;

        if (mes_atual < mes_aniversario || mes_atual == mes_aniversario && dia_atual < dia_aniversario) {
            quantos_anos--;
        }

        return quantos_anos < 0 ? 0 : quantos_anos;
    }
    _proto.escapeTextField = function escapeTextField(str){
      return escape(str);
    }
    _proto.apenasNumeros = function apenasNumeros(string){
        var numsStr = string.replace(/[^0-9]/g,'');
        return parseInt(numsStr);
    }
    _proto.getDoubleValue = function getDoubleValue(string){
        var numsStr = string.replace(/[^0-9,.]/g,'');
        if(numsStr.indexOf('.')>0 && numsStr.indexOf(',')>0){
          numsStr = numsStr.replace(/[.]/g,'');
        }
        numsStr = numsStr.replace(",", ".");
        return parseFloat(numsStr);
    }
    _proto.formatMoneyByCountry = function formatMoneyByCountry(float){
      return 'R$ '+this.formatMoney(float);
    }
    _proto.formatMoney = function formatMoney(float){
      var str='';
      if(float!==undefined){
        float = Math.round(float * 100) / 100;
        var len = float.toString().length
        var pos = float.toString().indexOf('.');
        var n = (pos>0 ? float.toString().substring(0,pos) : float);
        var d = (pos>0 ? float.toString().substring(pos+1,len) : 0);
        var dstr = (d<10?d+'0':d);
        str = n+','+dstr;
      }
      return str;
    }
    _proto.getDataAtualFormatada = function getDataAtualFormatada(){
      var data = new Date(),
      dia  = data.getDate().toString(),
      diaF = (dia.length == 1) ? '0'+dia : dia,
      mes  = (data.getMonth()+1).toString(), //+1 pois no getMonth Janeiro começa com zero.
      mesF = (mes.length == 1) ? '0'+mes : mes,
      anoF = data.getFullYear();
      return diaF+"/"+mesF+"/"+anoF;
    }
    _proto.removeEspacos = function removeEspacos(str){
      return (str!==undefined && str!=null ? str.replace( /\s/g, '' ) : null);
    }
    _proto.substituiEspacos = function substituiEspacos(str, replace){
      return (str!==undefined && str!=null ? str.replace( /\s/g, replace) : null);
    }
    _proto.getSiteUrl = function getSiteUrl(){
      return this.siteUrl;
    }
    _proto.getSiteUrlRest = function getSiteUrlRest(modulo){
      return this.siteUrl+'rest/';
    }
    _proto.getSubObjetos = function getSubObjetos(classe){
      return this.subObjetos[classe];
    }
    _proto.setSubObjetos = function setSubObjetos(classe, arr){
      this.subObjetos[classe] = arr;
    }
    _proto.getSubObjeto = function getSubObjeto(classe, id){
      return this.subObjetos[classe][id];
    }
    _proto.setSubObjeto = function setSubObjeto(classe, id, obj){
      this.subObjetos[classe][id] = obj;
    }
    _proto.removeSubObjeto = function removeSubObjeto(classe, id, obj){
      this.subObjetos[classe][id].remove();
    }
    _proto.getPalavraPrimeiraLetraMaiuscula = function getPalavraPrimeiraLetraMaiuscula(word){
      if(word!=null){if(word.length>1){
        word = (word.substring(0,1)).toUpperCase()+word.substring(1,word.length);}else{word = word.toUpperCase();}
      }
      return word;
    }
    _proto.getTempoPassadoFormatado = function getTempoPassadoFormatado(dateFormated, minutos){
      if(minutos==undefined || minutos==null || minutos<1){
         return 'há momentos atrás';
      }else if(minutos<60){
        var v = Math.floor(minutos);
        return 'há '+v+' minuto'+(v>1?'s':'');
      }else if(minutos>=60 && minutos<1440){
        var v = Math.floor(minutos/60)
        return 'há '+v+' hora'+(v>1?'s':'');
      }else{  
        if(minutos>=1440 && minutos<44640){
          var v = Math.floor(((minutos/60)/24));
          return 'há '+v+(v>1?' dias':' dia')+' ('+dateFormated+')';
        }else if(minutos>=44640 && minutos<525600){
          var v = Math.floor(((minutos/60)/24)/31);
          return 'há '+v+(v>1?' meses':' mês')+' ('+dateFormated+')';
        }else if(minutos>=525600){
          var v = Math.floor((((minutos/60)/24)/31)/12);
          return 'há '+v+(v>1?' anos':' ano')+' ('+dateFormated+')';
        }
      }
      return dateFormated;
    }
    _proto.getMinutosLabel = function getMinutosLabel(minutos){
      if(minutos==undefined || minutos==null || minutos<1){
         return '';
      }else { 
        var v = Math.floor(minutos);
        return v+' minuto'+(v>1?'s':'');
      }
      return '';
    }
    _proto.getExtensao = function getExtensao(nomeArquivo){
      return (nomeArquivo==null || nomeArquivo.indexOf('.') < 1 ? '' : nomeArquivo.split('.').pop());
    }
    _proto.getClassByExtension = function getClassByExtension(extensao){
        var content = '';
        if(extensao==='jpg' || extensao==='JPG' ||
            extensao==='jpeg' || extensao==='JPEG' ||
            extensao==='gif' || extensao==='GIF' || 
            extensao==='png' || extensao==='PNG'){
            content = 'item_anexo_image';
        }else if(extensao==='pdf' || extensao==='PDF'){
            content = 'item_anexo_pdf';
        }else if(extensao==='zip' || extensao==='ZIP'){
            content = 'item_anexo_zip';
        }else if(extensao==='doc' || extensao==='DOC' ||
                extensao==='docx' || extensao==='DOCX'){
            content = 'item_anexo_doc';
        }else if(extensao==='xls' || extensao==='XLS' ||
                extensao==='xlsx' || extensao==='XLSX'){
            content = 'item_anexo_xls';
        }else if(extensao==='ppt' || extensao==='PPT' ||
                extensao==='pptx' || extensao==='PPTX'){
            content = 'item_anexo_ppt';
        }
        return content;
    }
    _proto.htmlDecode = function htmlDecode(str){
      if(this.isNotEmpty(str)){ 
        /*Substitui apenas as tags permitidas,l as demais continuarão como se fossem textos exibidos e não inttubretados.*/
        str = str.replaceAll('&lt;p&gt;','<p>').replaceAll('&lt;/p&gt;','</p>');   
        str = str.replaceAll('&lt;b&gt;','<b>').replaceAll('&lt;/b&gt;','</b>');  
        str = str.replaceAll('&lt;strong&gt;','<strong>').replaceAll('&lt;/strong&gt;','</strong>');    
        str = str.replaceAll('&lt;h3&gt;','<h3>').replaceAll('&lt;/h3&gt;','</h3>');    
        str = str.replaceAll('&lt;h2&gt;','<h2>').replaceAll('&lt;/h2&gt;','</h2>');    
        str = str.replaceAll('&lt;h1&gt;','<h1>').replaceAll('&lt;/h1&gt;','</h1>');    
        str = str.replaceAll('&lt;em&gt;','<em>').replaceAll('&lt;/em&gt;','</em>');  
        str = str.replaceAll('&lt;br&gt;','<br>').replaceAll('&lt;br/&gt;','<br/>');      
        str = str.replaceAll('&#92;&#34;','"');  
      } else{
        str = '';
      }
      return str;
    }
    _proto.htmlDecodePuro = function htmlDecodePuro(str){
      if(this.isNotEmpty(str)){ 
        $('<div>', {id: 'hiddenHtmlDecode',class: 'hidden'}).appendTo('body');
        str = $('#hiddenHtmlDecode').html(this.htmlDecode(str)).text();
        $('#hiddenHtmlDecode').html('').remove();
      } else{
        str = '';
      } 
      return str;
    }
    _proto.getFormData = function getFormData(dados){
      var formData = new FormData();
      formData.append(this.PARAM_NAME_DADOS, this.getJsonData(dados));
      return formData;
    }
    _proto.encondeUrlParam = function encondeUrlParam(p){
      p = encodeURI(p);
      p = p.replaceAll('&','%26');
      return p;
    };
    _proto.getTokenUrlParam = function getTokenUrlParam(){
        if(this.isNotEmpty($.SolvesStorage.getStorageAuthToken()) && this.isNotEmpty($.SolvesStorage.getStorageAuthUserData()) ){
          var pluginStorage = this.getSolvesPlugin('SolvesStorage');
          if(pluginStorage!=null){
            var url = '';
            var hasParam=false;
            var token = pluginStorage.getStorageAuthToken();
            var userData = JSON.stringify(pluginStorage.getStorageAuthUserData());
            var usuario = JSON.stringify(pluginStorage.getStorageAuthUsuario());
            var perfil = JSON.stringify(pluginStorage.getStorageAuthPerfil());
            if(this.isNotEmpty(token)){
              url+=this.PARAM_NAME_TOKEN+'='+token;
              hasParam = true;
            }
            if(this.isNotEmpty(userData)){
              url+=(hasParam?'&':'')+this.PARAM_NAME_USERDATA+'='+this.encondeUrlParam(userData);
              hasParam = true;
            }
            if(this.isNotEmpty(usuario)){
              url+=(hasParam?'&':'')+this.PARAM_NAME_USUARIO+'='+this.encondeUrlParam(usuario);
              hasParam = true;
            }
            if(this.isNotEmpty(perfil)){
              url+=(hasParam?'&':'')+this.PARAM_NAME_PERFIL+'='+this.encondeUrlParam(perfil);
              hasParam = true;
            }
            return url;
          }else{
            console.log('logoff sem SolvesStorage.');
          }
        }
        return '';
    }
    _proto.getJsonData = function getJsonData(dados){
      var json = this.getTokenUrlParam();
      var pluginStorage = this.getSolvesPlugin('SolvesStorage');
      if(pluginStorage!=null){
        var pluginGeo = this.getSolvesPlugin('SolvesGeo');
        if(pluginGeo!=null){
          if(pluginGeo.addressData!=undefined && pluginGeo.addressData!=null){
            json += (json.length>0 ? '&' : '?')+this.PARAM_NAME_ADDRESS_DATA+'='+this.escapeTextField(JSON.stringify(pluginGeo.addressData));
          }
          if(pluginGeo.geoData!=undefined && pluginGeo.geoData!=null){
          json += (json.length>0 ? '&' : '?')+this.PARAM_NAME_GEO_DATA+'='+this.escapeTextField(JSON.stringify(pluginGeo.geoData));
          }
        }
      }
      if(dados!=undefined){
        json+= (json.length>0 ? '&' : '?')+this.PARAM_NAME_DADOS+'='+this.escapeTextField(JSON.stringify(dados));
      }
      return json;
    }
    _proto.refreshUrlBrowser = function refreshUrlBrowser(url, title){
      window.history.pushState(url, this.siteTitulo+(this.isNotEmpty(title)?' '+title:''), url);
    }
    _proto.logoff = function logoff(){
        this.PERFIL_LOGADO = null;
        //store
        var pluginStorage = this.getSolvesPlugin('SolvesStorage');
        if(pluginStorage!=null){
          pluginStorage.clearAuthData();
        }else{
          console.log('logoff sem SolvesStorage.');
        }
        this.clearDataActualPage();
    }
    _proto.isLogado = function isLogado(){
      var pluginStorage = this.getSolvesPlugin('SolvesStorage');
      if(pluginStorage!=null){
        return (this.isNotEmpty(pluginStorage.getStorageAuthUserData()));
      }else{
        console.log('logoff sem SolvesStorage.');
      }
      return false;
    }
    _proto.getPerfilLogado = function getPerfilLogado(){
      if(!this.isLogado()){
        this.PERFIL_LOGADO=null;
      }
      else if(this.PERFIL_LOGADO==null){
        //store
        var pluginStorage = this.getSolvesPlugin('SolvesStorage');
        if(pluginStorage!=null){
          this.PERFIL_LOGADO = pluginStorage.getStorageAuthPerfil();
        }else{
          console.log('logoff sem SolvesStorage.');
        }
      }
      return this.PERFIL_LOGADO;
    }
    _proto.loaded = function loaded(){
      this.submiting = false;
      var pluginUi = this.getSolvesPlugin('SolvesUi');
      if(pluginUi!=null){
        return pluginUi.loaded();
      }
    }
    _proto.atualizaPerfilLogado = function atualizaPerfilLogado(obj){
      if(obj==null){
        this.PERFIL_LOGADO = null;
      }else{ 
        if(this.getPerfilLogado()==null){
          this.PERFIL_LOGADO = {};
        }
        this.PERFIL_LOGADO.data_nascimento = obj.data_nascimento;
        this.PERFIL_LOGADO.email_confirmado = this.isTrue(obj.email_confirmado);
        this.PERFIL_LOGADO.email = obj.email;
        this.PERFIL_LOGADO.nome = obj.nome;
        this.PERFIL_LOGADO.avatar = this.normalizeImgUrl(obj.avatar);
        if(this.PERFIL_LOGADO.data_nascimento!=null){
          this.PERFIL_LOGADO.idade = this.getIdade(this.PERFIL_LOGADO.data_nascimento);  
        }
        if(obj.fone1!=null){
          this.PERFIL_LOGADO.fone1 = obj.fone1;
        }
        if(obj.fone2!=null){
          this.PERFIL_LOGADO.fone2 = obj.fone2;
        }
      }
      var pluginStorage = this.getSolvesPlugin('SolvesStorage');
      if(pluginStorage!=null){
        pluginStorage.setStorageAuthPerfil(this.PERFIL_LOGADO);
      }
      
      var pluginUi = this.getSolvesPlugin('SolvesUi');
      if(pluginUi!=null){
        pluginUi.preencheHtmlUsuarioLogado();
      }
    }
    _proto.clearDataActualPage = function clearDataActualPage(){
      this.filtro = null;
      this.params = null;
      this.lista = [];
      this.objetoId = null;
      this.objeto = null;
      this.subObjetoId = null;
      this.subObjeto = null;
      this.subObjetoQtd = 0;
      this.subObjetos = [];
    }
    _proto.refreshOffline = function refreshOffline(lastPage){
      window.location.href = lastPage;
    }
    _proto.normalizeImgUrl = function normalizeImgUrl(imgUrl){
      return (this.isNotEmpty(imgUrl) ? ((imgUrl.slice!==undefined && typeof imgUrl.slice=="function" && imgUrl.slice(0, 5) === 'data:')?imgUrl.replace(/ /g, '+'):imgUrl) : '');
    };
    _proto.base64ToBlob = function base64ToBlob(base64, mime) {
        mime = mime || '';
        var sliceSize = 1024;
        var byteChars = window.atob(base64);
        var byteArrays = [];

        for (var offset = 0, len = byteChars.length; offset < len; offset += sliceSize) {
            var slice = byteChars.slice(offset, offset + sliceSize);

            var byteNumbers = new Array(slice.length);
            for (var i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }

            var byteArray = new Uint8Array(byteNumbers);

            byteArrays.push(byteArray);
        }

        return new Blob(byteArrays, {type: mime});
    };
    _proto.getImgSrcInBlob = function getImgSrcInBlob(imgElmId){
      var image = $('#'+imgElmId).attr('src');
      if($.Solves.isNotEmpty(image)){
        var base64ImageContent = image.replace(/^data:image\/(png|jpg);base64,/, "");
        return this.base64ToBlob(base64ImageContent, 'image/png'); 
      }
      return null;
    }
  }


  exports.Solves = Solves;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
//$.Solves = new Solves();



String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};
// Array Remove - By John Resig (MIT Licensed)
Array.prototype.remove = function(from, to) {
  var rest = this.slice((to || from) + 1 || this.length);
  this.length = from < 0 ? this.length + from : from;
  return this.push.apply(this, rest);
};