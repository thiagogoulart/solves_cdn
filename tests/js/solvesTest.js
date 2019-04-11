$.Solves.init('https://solves.com.br/', 'Solves', 'solves', 'https://solves.com.br/images/logo_solves_2016_white.png');

QUnit.test("Solves init", function( assert ) {

  assert.equal($.Solves.siteUrl, 'https://solves.com.br/', "Site URL obtido com sucesso!" );
  assert.equal($.Solves.siteTitulo, 'Solves', "Site Título obtido com sucesso!" );
  assert.equal($.Solves.siteShortName, 'solves', "Site Short Name obtido com sucesso!" );
  assert.equal($.Solves.icon, 'https://solves.com.br/images/logo_solves_2016_white.png', "icon obtido com sucesso!" );

});