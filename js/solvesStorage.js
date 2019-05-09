/**
@Author Thiago Gonçalves da Silva Goulart (SOLVES SOlUÇÕES EM SOFTWARE)
* 11/04/2019.)
**/
function SolvesStorage() {
  this.solvesPluginName = 'SolvesStorage';
  this.versionId = 1;
  this.version = '1.0';
  /*DEFAULT KEYS*/
  this.STORAGE_KEY_PERFIL = $.Solves.siteShortName+'_'+$.Solves.PARAM_NAME_PERFIL;
  this.STORAGE_KEY_USUARIO = $.Solves.siteShortName+'_'+$.Solves.PARAM_NAME_USUARIO;
  this.STORAGE_KEY_USERDATA = $.Solves.siteShortName+'_'+$.Solves.PARAM_NAME_USERDATA;
  this.STORAGE_KEY_TOKEN = $.Solves.siteShortName+'_'+$.Solves.PARAM_NAME_TOKEN;
  this.STORAGE_KEY_ADDRESS_DATA = $.Solves.PARAM_NAME_ADDRESS_DATA;
  this.STORAGE_KEY_GEO_DATA = $.Solves.PARAM_NAME_GEO_DATA;

  this.init = function(){
    $.Solves.addSolvesPlugin(this.solvesPluginName, $.SolvesStorage);
  };
  this.destroy = function(){
    this.clearAuthData();
    this.clearGeoData();
  };
  this.clearAuthData = function(){
    this.clearCache(this.STORAGE_KEY_USUARIO);
    this.setEmptyCache(this.STORAGE_KEY_USERDATA);
    this.setEmptyCache(this.STORAGE_KEY_TOKEN);
    this.setEmptyCache(this.STORAGE_KEY_PERFIL);
  }
  this.clearGeoData = function(){
    this.clearCache(this.STORAGE_KEY_ADDRESS_DATA);
    this.clearCache(this.STORAGE_KEY_GEO_DATA);
  }
  this.getStorageAuthPerfil = function(){
    return this.getCache(this.STORAGE_KEY_PERFIL, true);
  }
  this.setStorageAuthPerfil = function(p){
    return this.setCache(this.STORAGE_KEY_PERFIL, p, true);
  }
  this.getStorageAuthUsuario = function(){
    return this.getCache(this.STORAGE_KEY_USUARIO, true);
  }
  this.setStorageAuthUsuario = function(p){
    return this.setCache(this.STORAGE_KEY_USUARIO, p, true);
  }
  this.getStorageAuthUserData = function(){
    return this.getCache(this.STORAGE_KEY_USERDATA, true);
  }
  this.setStorageAuthUserData = function(p){
    return this.setCache(this.STORAGE_KEY_USERDATA, p, true);
  }
  this.getStorageAuthToken = function(){
    return this.getCache(this.STORAGE_KEY_TOKEN);
  }
  this.setStorageAuthToken = function(p){
    return this.setCache(this.STORAGE_KEY_TOKEN, p);
  }
  this.getStorageAddressData = function(){
    return this.getCache(this.STORAGE_KEY_ADDRESS_DATA);
  }
  this.setStorageAddressData = function(json){
    return this.setCache(this.STORAGE_KEY_ADDRESS_DATA, json, true);
  }
  this.getStorageGeoData = function(){
    return this.getCache(this.STORAGE_KEY_GEO_DATA);
  }
  this.setStorageGeoData = function(json){
    return this.setCache(this.STORAGE_KEY_GEO_DATA, p, true);
  }
  this.setCookieData = function(cookieName,cookieValue,isJson){
    var daysToExpire = 2;
    var date = new Date();
    date.setTime(date.getTime()+(daysToExpire*24*60*60*1000));
    if($.Solves.isTrue(isJson) && cookieValue!==undefined && cookieValue!=null){cookieValue = $.Solves.escapeTextField(JSON.stringify(cookieValue));}
    var val = cookieName + "=" + cookieValue + "; expires=" + date.toGMTString()+"; path=/";
    document.cookie = val;
  }
  this.getCookieData = function(cookieName,isJson) {
    var result;
    var name = cookieName + "=";
    var allCookieArray = document.cookie.split(';');
    for(var i=0; i!=allCookieArray.length; i++){
      var temp = allCookieArray[i].trim();
      if (temp.indexOf(name)==0){
        result = temp.substring(name.length,temp.length);
        break;
      }
    }
    if(result!=null){
      return ($.Solves.isTrue(isJson) ? jQuery.parseJSON(unescape(result)) : result);
    }
    return null;
  }
  this.decodeExistingCookies = function(){
    //TODO
  }
  this.decodeExistingStorages = function(){
    var pluginGeo = $.Solves.getSolvesPlugin('SolvesGeo');
    if(pluginGeo!=null){
      pluginGeo.addressData = this.getStorageAddressData();
      pluginGeo.geoData = this.getStorageGeoData();
    }else{
      console.log(this.solvesPluginName+' não encontrou SolvesGeo');
    }
  }
  this.getCache = function(key,isJson){
    result = window.localStorage[key];
    if(result!=null){
      return ($.Solves.isTrue(isJson) ? jQuery.parseJSON(unescape(result)) : result);
    }
    return null;
  }
  this.setCache = function(key, value,isJson){
    if($.Solves.isTrue(isJson) && value!==undefined && value!=null){value = $.Solves.escapeTextField(JSON.stringify(value));}
    window.localStorage[key] = value;
  }
  this.clearCache = function(key){
    window.localStorage[key] = null;
  }
  this.setEmptyCache = function(key){
    window.localStorage[key] = null;
  }
}
$.SolvesStorage = new SolvesStorage();
$.SolvesStorage.init();