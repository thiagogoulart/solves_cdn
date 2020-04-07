/**
@Author Thiago Gonçalves da Silva Goulart (SOLVES SOlUÇÕES EM SOFTWARE)
* 11/04/2019.)
**/
function SolvesGeo() {
  this.solvesPluginName = 'SolvesGeo';
  this.versionId = 2;
  this.version = '1.1';
  this.addressData = null;
  this.geoData = null;
  this.gotUserPosition = false;
  this.lat = null;
  this.long = null;
  this.emailOrigin = null;
  this.STORAGE_KEY_LATITUDE='SOLVES_GEO_LAST_LATITUDE';
  this.STORAGE_KEY_LONGITUDE='SOLVES_GEO_LAST_LONGITUDE';

  this.init = function(){
    $.Solves.addSolvesPlugin(this.solvesPluginName, $.SolvesGeo);
  };
  this.afterSolvesInit = function(){
    let pluginStorage = $.Solves.getSolvesPlugin('SolvesStorage');
    if(pluginStorage!=null){
      this.lat = pluginStorage.getCache(this.STORAGE_KEY_LATITUDE);
      this.long = pluginStorage.getCache(this.STORAGE_KEY_LONGITUDE);
      this.geoData = pluginStorage.getStorageGeoData();
      this.addressData = pluginStorage.getStorageAddressData();
    }else{
      console.log(this.solvesPluginName+' não encontrou SolvesStorage');
    }
  };
  this.destroy = function(){
    let pluginStorage = $.Solves.getSolvesPlugin('SolvesStorage');
    if(pluginStorage!=null){
      pluginStorage.clearGeoData();
      pluginStorage.clearCache(this.STORAGE_KEY_LATITUDE);
      pluginStorage.clearCache(this.STORAGE_KEY_LONGITUDE);
    }else{
      console.log(this.solvesPluginName+' não encontrou SolvesStorage');
    }
  };
  this.setEmailOrigin = function(e){
    this.emailOrigin = e;
  }
  this.getGpsLocation = function (force,sucFuntion,errorFunc){
    if(!this.gotUserPosition || force){     
      if (navigator && navigator.geolocation) {
        //Check if browser supports W3C Geolocation API
          navigator.geolocation.getCurrentPosition(geoSuccessFunction, geoErrorFunction);
      } 
      //Get latitude and longitude;
      let _self = this;
      function geoSuccessFunction(position) {
        _self.setUserPosition(position, sucFuntion,errorFunc);
      }
      function geoErrorFunction(){errorFunc();}
    }
  }; 
  this.setUserPosition = function(position, sucFuntion,errorFunc){
    this.gotUserPosition = true;
    this.lat = position.coords.latitude;
    this.long = position.coords.longitude;
    this.storeLastPosition(this.lat, this.long);
    this.getGpsDetails(sucFuntion,errorFunc);
  };   
  this.getGpsDetails = function(sucFuntion,errorFunc,alwaysFunc){
    let _self = this;
    let jqxhr = $.getJSON('https://nominatim.openstreetmap.org/reverse?'+
      'format=jsonv2&lat='+this.lat+'&lon='+this.long+'&polygon_svg=1&addressdetails=1', 
    function(data) {
      _self.setGeoData(data); 
      if(sucFuntion && (typeof sucFuntion == "function")){sucFuntion(data);}
    }).fail(function() {
        if(errorFunc && (typeof errorFunc == "function")){errorFunc();}
      }).always(function() {
        if(alwaysFunc && (typeof alwaysFunc == "function")){alwaysFunc();}
      });
  };
  this.setAddressDataByGeoData = function(p_numero, p_complemento){
    let p_uf_id;
    let p_cidade_id;
    let p_cep = this.geoData.address.postcode;
    let p_country = this.geoData.address.country;
    let p_country_code= this.geoData.address.country_code;
    let p_uf = this.geoData.address.state;
    let p_uf_distrito = this.geoData.address.state_district;
    let p_cidade = this.geoData.address.city;
    let p_cidade_distrito = this.geoData.address.city_district;
    let p_cidade_microregiao = this.geoData.address.county;
    let p_bairro = this.geoData.address.neighbourhood;
    let p_suburb = this.geoData.address.suburb;
    let p_logradouro = this.geoData.address.road;
    if(!$.Solves.isNotEmpty(p_logradouro)){
      p_logradouro = this.geoData.address.footway;
    }
    let p_universidade = this.geoData.address.university;
    let p_lat = this.geoData.lat;
    let p_long = this.geoData.lon;
    let p_name = this.geoData.name;
    let p_display_name = this.geoData.display_name;
    let p_place_id = this.geoData.place_id;
    let p_type = this.geoData.type;
    let p_osm_id = this.geoData.osm_id;
    let p_osm_type = this.geoData.osm_type;
    this.addressData = {cep:p_cep, country:p_country, country_code:p_country_code, uf_id:p_uf_id, uf:p_uf, uf_distrito:p_uf_distrito, 
      cidade_id:p_cidade_id, cidade_distrito: p_cidade_distrito, cidade_microregiao: p_cidade_microregiao, cidade: p_cidade, 
      bairro:p_bairro, suburb:p_suburb, logradouro:p_logradouro, universidade:p_universidade, 
      numero:p_numero, complemento:p_complemento, latitude:p_lat, longitude:p_long, name:p_name, display_name:p_display_name, place_id:p_place_id, type:p_type,
      osm_id:p_osm_id, osm_type:p_osm_type};
    this.storeAddressData();
  };
  this.setAddressData = function(p_cep, p_uf_id, p_uf, p_cidade_id, p_cidade, p_logradouro, p_numero, p_complemento){
    this.addressData = {cep:p_cep, uf_id:p_uf_id, uf:p_uf, cidade_id:p_cidade_id, cidade: p_cidade, logradouro:p_logradouro, numero:p_numero, complemento:p_complemento};
    this.storeAddressData();
  };
  this.setGeoData = function(data){
    this.geoData = data;
    this.storeGeoData();
  };
  this.storeAddressData = function(){
    let pluginStorage = $.Solves.getSolvesPlugin('SolvesStorage');
    if(pluginStorage!=null){
      pluginStorage.setStorageAddressData(this.addressData);
    }else{
      console.log(this.solvesPluginName+' não encontrou SolvesStorage');
    }
  };
  this.storeGeoData = function(){
    let pluginStorage = $.Solves.getSolvesPlugin('SolvesStorage');
    if(pluginStorage!=null){
      pluginStorage.setStorageGeoData(this.geoData);
    }else{
      console.log(this.solvesPluginName+' não encontrou SolvesStorage');
    }
  };
  this.storeLastPosition = function(latitude, longitude){
    let pluginStorage = $.Solves.getSolvesPlugin('SolvesStorage');
    if(pluginStorage!=null){
      pluginStorage.setCache(this.STORAGE_KEY_LATITUDE, latitude, false);
      pluginStorage.setCache(this.STORAGE_KEY_LONGITUDE, longitude, false);
    }else{
      console.log(this.solvesPluginName+' não encontrou SolvesStorage');
    }
  };
}
$.SolvesGeo = new SolvesGeo();
$.SolvesGeo.init();