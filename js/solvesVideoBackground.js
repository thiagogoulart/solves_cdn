/**
@Author Thiago Gonçalves da Silva Goulart (SOLVES SOlUÇÕES EM SOFTWARE)
* 22/04/2019.)
**/
function SolvesVideoBackground() {
  this.solvesPluginName = 'SolvesVideoBackground';
  this.versionId = 1;
  this.version = '1.0';

  this.videoBackgroundElmId = null;

  this.init = function(){
    $.Solves.addSolvesPlugin(this.solvesPluginName, $.SolvesVideoBackground);      
  };
  this.destroy = function(){

  };
  this.setVideoBackgroundElmId = function(elmId){
    this.videoBackgroundElmId = elmId;
    $("#"+this.videoBackgroundElmId).YTPlayer({
      addRaster: true,
      showControls: false
    });
  }

}
$.SolvesVideoBackground = new SolvesVideoBackground();
$.SolvesVideoBackground.init();