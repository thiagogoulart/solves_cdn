/**
@Author Thiago Gonçalves da Silva Goulart (SOLVES SOlUÇÕES EM SOFTWARE)
* 11/04/2019.)
**/
function Solves() {
  this.versionId = 1;
  this.version = '1.0';
  this.siteUrl = 'https://compartilhatube.com.br/pwa/';
  this.siteTitulo = 'CompartilhaTube';
  this.siteShortName = 'compartilhatube';
  this.icon =  this.siteUrl+'assets/img/icons/Icon-48.png';
  this.solvesPlugins = [];
  this.app = false;
  this.url = null;
  /* PADRÃO DE NOMES DE PARAMETROS  */
  this.PARAM_NAME_DADOS = 'dados';
  this.PARAM_NAME_TOKEN = 'token';
  this.PARAM_NAME_USERDATA = 'userData';
  this.PARAM_NAME_USUARIO = 'usuario';
  this.PARAM_NAME_ADDRESS_DATA = 'addressData';
  this.PARAM_NAME_GEO_DATA = 'geoData';
  /* AUTH OBJECT */
  this.PERFIL_LOGADO = null;
  /* DFADOS DE TELA */
  this.submiting = false;
  this.telaAtualId = null;
  this.telaAtualTitulo = null;
  this.telaAtualSubtitulo = null;
  /* DADOS DINÂMICOS*/
  this.submiting = false;
  this.filtro = null;
  this.params = null;
  this.lista = [];
  this.objetoId = null;
  this.objeto = null;
  this.subObjetoId = null;
  this.subObjeto = null;
  this.subObjetoQtd = 0;
  this.subObjetos = [];

  this.init = function(p_siteUrl, p_siteTitulo, p_siteShortName, p_icon){
    this.siteUrl = p_siteUrl;
    this.siteTitulo = p_siteTitulo;
    this.siteShortName = p_siteShortName;
    this.icon = p_icon;
  }
  this.addSolvesPlugin = function(key, p){
      if(this.solvesPlugins[key]!==undefined && this.solvesPlugins[key]!=null && this.solvesPlugins[key].solvesPluginName==key){
        return this.solvesPlugins[key];
      }
      this.solvesPlugins[key] = p;
  }
  this.getSolvesPlugin = function(key){
      if(this.solvesPlugins[key]!==undefined && this.solvesPlugins[key]!=null && this.solvesPlugins[key].solvesPluginName==key){
        return this.solvesPlugins[key];
      }
      return null;
  }
  this.hasSolvesPlugin = function(key){
      return (this.solvesPlugins[key]!=null);
  }
  this.isApp = function(){
    return this.isTrue(this.app);
  }
  this.getCompleteUrl = function(root, url){
    return (this.isTrue(root)?'/':this.siteUrl)+url;
  }
  this.especialCharMask = function(str){
      str = str.replace(/[ÀÁÂÃÄÅ]/g,"A");
      str = str.replace(/[àáâãäå]/g,"a");
      str = str.replace(/[ÈÉÊË]/g,"E");
      return (str.replace(/[^a-z0-9]/gi,''));
  }    
  this.isNotEmpty = function(val){
    return val!==undefined && val!=null && val!="null" && val!="" && val!="undefined";
  }
  this.getAllUrlParams = function(url) {

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
  this.getAjaxParam = function(url, formData, successFunc, errorFunc){
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
              if(this.isTrue(result['logoff'])){
                console.log('não autorizado.');
                this.logoff();
              }
              this.loaded();
            },
            error: function(data){ 
              errorFunc(data);
              this.loaded();
            },
            complete: function(data){
              this.loaded();
            }
      };
  }
  this.getAjaxExternalParam = function(url, type, data, successFunc, errorFunc){
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
  this.doAjax = function(url, formData, successFunc, errorFunc){
    $.ajax(this.getAjaxParam(url, formData, successFunc, errorFunc));
  }
  this.doAjaxExternal = function(url, type, data, successFunc, errorFunc){
    $.ajax(this.getAjaxExternalParam(url, type, data, successFunc, errorFunc));
  }
  this.doMaskForMoney = function(elmId){
      $('#'+elmId).maskMoney({symbol:"R$",decimal:",",thousands:"."});
  }
  this.getUserLabel = function(user_id, user_id_label){
    return ($.Solves.PERFIL_LOGADO.user_id==user_id ? 'Eu' :user_id_label);
  }
  this.getIdade = function(date) {
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
  this.escapeTextField = function(str){
    return escape(str);
  }
  this.apenasNumeros = function(string){
      var numsStr = string.replace(/[^0-9]/g,'');
      return parseInt(numsStr);
  }
  this.getDoubleValue = function(string){
      var numsStr = string.replace(/[^0-9,.]/g,'');
      if(numsStr.indexOf('.')>0 && numsStr.indexOf(',')>0){
        numsStr = numsStr.replace(/[.]/g,'');
      }
      numsStr = numsStr.replace(",", ".");
      return parseFloat(numsStr);
  }
  this.formatMoneyByCountry = function(float){
    return 'R$ '+this.formatMoney(float);
  }
  this.formatMoney = function(float){
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
  this.getDataAtualFormatada = function(){
    var data = new Date(),
    dia  = data.getDate().toString(),
    diaF = (dia.length == 1) ? '0'+dia : dia,
    mes  = (data.getMonth()+1).toString(), //+1 pois no getMonth Janeiro começa com zero.
    mesF = (mes.length == 1) ? '0'+mes : mes,
    anoF = data.getFullYear();
    return diaF+"/"+mesF+"/"+anoF;
  }
  this.removeEspacos = function(str){
    return (str!==undefined && str!=null ? str.replace( /\s/g, '' ) : null);
  }
  this.substituiEspacos = function(str, replace){
    return (str!==undefined && str!=null ? str.replace( /\s/g, replace) : null);
  }
  this.getSiteUrl = function(){
    return this.siteUrl;
  }
  this.getSiteUrlRest = function(modulo){
    return this.siteUrl+'rest/';
  }
  this.getSubObjetos = function(classe){
    return this.subObjetos[classe];
  }
  this.setSubObjetos = function(classe, arr){
    this.subObjetos[classe] = arr;
  }
  this.getSubObjeto = function(classe, id){
    return this.subObjetos[classe][id];
  }
  this.setSubObjeto = function(classe, id, obj){
    this.subObjetos[classe][id] = obj;
  }
  this.removeSubObjeto = function(classe, id, obj){
    this.subObjetos[classe][id].remove();
  }
  this.getPalavraPrimeiraLetraMaiuscula = function(word){
    if(word!=null){if(word.length>1){
      word = (word.substring(0,1)).toUpperCase()+word.substring(1,word.length);}else{word = word.toUpperCase();}
    }
    return word;
  }
  this.getTempoPassadoFormatado = function(dateFormated, minutos){
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
  this.getMinutosLabel = function(minutos){
    if(minutos==undefined || minutos==null || minutos<1){
       return '';
    }else { 
      var v = Math.floor(minutos);
      return v+' minuto'+(v>1?'s':'');
    }
    return '';
  }
  this.getExtensao = function(nomeArquivo){
    return (nomeArquivo==null || nomeArquivo.indexOf('.') < 1 ? '' : nomeArquivo.split('.').pop());
  }
  this.getClassByExtension = function(extensao){
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
  this.htmlDecode = function(str){
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
  this.htmlDecodePuro = function(str){
    if(this.isNotEmpty(str)){ 
      $('<div>', {id: 'hiddenHtmlDecode',class: 'hidden'}).appendTo('body');
      str = $('#hiddenHtmlDecode').html(this.htmlDecode(str)).text();
      $('#hiddenHtmlDecode').html('').remove();
    } else{
      str = '';
    } 
    return str;
  }
  this.getFormData = function(dados){
    var formData = new FormData();
    formData.append(this.PARAM_NAME_DADOS, this.getJsonData(dados));
    return formData;
  }
  this.getTokenUrlParam = function(){
      if(this.isLogado()){
        var pluginStorage = this.getSolvesPlugin('SolvesStorage');
        if(pluginStorage!=null){
          var token = pluginStorage.getStorageAuthToken();
          var userData = pluginStorage.getStorageAuthUserData();
          return this.PARAM_NAME_TOKEN+'='+token+'&'+this.PARAM_NAME_USERDATA+'='+userData;
        }else{
          console.log('logoff sem SolvesStorage.');
        }
      }
      return '';
  }
  this.getJsonData = function(dados){
    var json = this.getTokenUrlParam();
    var pluginStorage = this.getSolvesPlugin('SolvesStorage');
    var pluginGeo = this.getSolvesPlugin('SolvesGeo');
    if(pluginStorage!=null && pluginGeo!=null){
      if(pluginGeo.addressData!=undefined && pluginGeo.addressData!=null){
        json += (json.length>0 ? '&' : '?')+this.PARAM_NAME_ADDRESS_DATA+'='+escapeTextField(JSON.stringify(pluginGeo.addressData));
      }
      if(pluginGeo.geoData!=undefined && pluginGeo.geoData!=null){
      json += (json.length>0 ? '&' : '?')+this.PARAM_NAME_GEO_DATA+'='+escapeTextField(JSON.stringify(pluginGeo.geoData));
      }
    }
    if(dados!=undefined){
      json+= (json.length>0 ? '&' : '?')+this.PARAM_NAME_DADOS+'='+escapeTextField(JSON.stringify(dados));
    }
    return json;
  }
  this.refreshUrlBrowser = function(url, title){
    window.history.pushState(url, this.siteTitulo+(isNotEmpty(title)?' '+title:''), url);
  }
  this.logoff = function(){
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
  this.isLogado = function(){
    var pluginStorage = this.getSolvesPlugin('SolvesStorage');
    if(pluginStorage!=null){
      return this.isNotEmpty(pluginStorage.getStorageAuthUsuario());
    }else{
      console.log('logoff sem SolvesStorage.');
    }
    return false;
  }
  this.getPerfilLogado = function(){
    if(!this.isLogado()){
      $.Solves.PERFIL_LOGADO=null;
    }
    else if($.Solves.PERFIL_LOGADO==null){
      //store
      var pluginStorage = this.getSolvesPlugin('SolvesStorage');
      if(pluginStorage!=null){
        $.Solves.PERFIL_LOGADO = pluginStorage.getStorageAuthUsuario();
      }else{
        console.log('logoff sem SolvesStorage.');
      }
    }
    return $.Solves.PERFIL_LOGADO;
  }
  this.loaded = function(){
    $.Solves.submiting = false;
    var pluginUi = this.getSolvesPlugin('SolvesUi');
    if(pluginUi!=null){
      return pluginUi.loaded();
    }
  }
  this.atualizaPerfilLogado = function(obj){
    $.Solves.getPerfilLogado().data_nascimento = obj.data_nascimento;
    $.Solves.getPerfilLogado().email_confirmado = $.Solves.isTrue(obj.email_confirmado);
    $.Solves.getPerfilLogado().email = obj.email;
    $.Solves.getPerfilLogado().nome = obj.nome;
    $.Solves.getPerfilLogado().avatar = obj.avatar;
    $.Solves.getPerfilLogado().idade = getIdade($.Solves.getPerfilLogado().data_nascimento);  

    //TODO atualiza usuario logado. 
    $.Solves.PERFIL_LOGADO = $.Solves.getPerfilLogado();
    var pluginStorage = this.getSolvesPlugin('SolvesStorage');
    if(pluginStorage!=null){
      pluginStorage.setStorageAuthUsuario(JSON.stringify( $.Solves.PERFIL_LOGADO));
    }
    
    var pluginUi = this.getSolvesPlugin('SolvesUi');
    if(pluginUi!=null){
      pluginUi.preencheHtmlUsuarioLogado();
    }
  }
  this.clearDataActualPage = function(){
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
  this.refreshOffline = function(lastPage){
    window.location.href = lastPage;
  }
}
$.Solves = new Solves();


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