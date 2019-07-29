$.Solves.init('https://solves.com.br/', 'Solves', 'solves', 'https://solves.com.br/images/logo_solves_2016_white.png');

//UNIT TEST
QUnit.test("Solves init", function( assert ) {
  assert.equal($.Solves.siteUrl, 'https://solves.com.br/', "Site URL obtido com sucesso!" );
  assert.equal($.Solves.siteTitulo, 'Solves', "Site Título obtido com sucesso!" );
  assert.equal($.Solves.siteShortName, 'solves', "Site Short Name obtido com sucesso!" );
  assert.equal($.Solves.icon, 'https://solves.com.br/images/logo_solves_2016_white.png', "icon obtido com sucesso!" );
});

//UNIT TEST
QUnit.test("Solves isTrue", function( assert ) {
  assert.equal($.Solves.isTrue(0), false, "0 é falso" );
  assert.equal($.Solves.isTrue('0'), false, "'0' é falso" );
  assert.equal($.Solves.isTrue('f'), false, "'f' é falso" );
  assert.equal($.Solves.isTrue('false'), false, "'false' é falso" );
  assert.equal($.Solves.isTrue(false), false, "false é falso" );

  assert.equal($.Solves.isTrue(1), true, "1 é verdadeiro" );
  assert.equal($.Solves.isTrue('1'), true, "'1' é verdadeiro" );
  assert.equal($.Solves.isTrue('t'), true, "'t' é verdadeiro" );
  assert.equal($.Solves.isTrue('v'), true, "'v' é verdadeiro" );
  assert.equal($.Solves.isTrue('on'), true, "'on' é verdadeiro" );
  assert.equal($.Solves.isTrue('checked'), true, "'checked' é verdadeiro" );
  assert.equal($.Solves.isTrue('true'), true, "'true' é verdadeiro" );
  assert.equal($.Solves.isTrue(true), true, "true é verdadeiro" );
});

//UNIT TEST
QUnit.test("Solves isNotEmpty", function( assert ) {
  assert.equal($.Solves.isNotEmpty('abc'), true, "'abc' é verdadeiro" );
  assert.equal($.Solves.isNotEmpty('a'), true, "'a' é verdadeiro" );
  assert.equal($.Solves.isNotEmpty('1'), true, "'1' é verdadeiro" );
  assert.equal($.Solves.isNotEmpty('0'), true, "'0' é verdadeiro" );

  assert.equal($.Solves.isNotEmpty(''), false, "'' é falso" );
  assert.equal($.Solves.isNotEmpty(' '), false, "' ' é falso" ); 
  assert.equal($.Solves.isNotEmpty('   '), false, "'   ' é falso" );
  assert.equal($.Solves.isNotEmpty('null'), false, "'null' é falso" );
  assert.equal($.Solves.isNotEmpty(null), false, "null é falso" );
  assert.equal($.Solves.isNotEmpty(undefined), false, "undefined é falso" );
});