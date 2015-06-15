var _ = require('underscore'),
    fs = require('fs'),
    assert = require('assert');

describe('preparing math expressions', function() {
    function prepareMath(markup) {
        var regex = /\.\. math::(.+?)(?=<|\.\. math::)/g,
            mathPrefix = '<div class="math"> \\begin{equation*} ',
            mathPostfix = ' \\end{equation*} </div>';
        return markup.replace(regex, mathPrefix + '$1' + mathPostfix);
    }

    it('should prepare math expressions for blog post from string', function() {
        var testMarkup = '<p>.. math::Z_j \mid X_{1j},\dots,X_{L_jj} = \sum_{l=1}^{L_j} X_{lj} + \varepsilon_j</p>';
        assert.deepEqual(prepareMath(testMarkup.toString()), '<p><div class="math"> \\begin{equation*} Z_j \mid X_{1j},\dots,X_{L_jj} = \sum_{l=1}^{L_j} X_{lj} + \varepsilon_j \\end{equation*} </div></p>' ,'complete test');
    });

    it('should prepare math expressions for blog post from file', function(){
        var externalMarkup = fs.readFileSync('test/src/mathExpression.txt');
        assert.deepEqual(prepareMath(externalMarkup.toString()), '<p><div class="math"> \\begin{equation*} Z_j mid X_{1j},dots,X_{L_jj} = sum_{l=1}^{L_j} X_{lj} + varepsilon_j \\end{equation*} </div></p>' ,'complete test');
    });

    it('should prepare math expressions for blog post from string - more than one math expression', function() {
        var testMarkup = '<p>.. math::Z_j mid X_{1j}{L_j} X_{lj}.. math::Z_j mid X_{1j}{L_j} X_{lj}</p>';
        assert.deepEqual(prepareMath(testMarkup.toString()), '<p><div class="math"> \\begin{equation*} Z_j mid X_{1j}{L_j} X_{lj} \\end{equation*} </div><div class="math"> \\begin{equation*} Z_j mid X_{1j}{L_j} X_{lj} \\end{equation*} </div></p>' ,'complete test');
    });

    it('should prepare math expressions for blog post from file - more than one math expression', function(){
        var externalMarkup = fs.readFileSync('test/src/mathExpression2.txt');
        assert.deepEqual(prepareMath(externalMarkup.toString()), '<p><div class="math"> \\begin{equation*} Z_j mid X_{1j}{L_j} X_{lj} \\end{equation*} </div><div class="math"> \\begin{equation*} Z_j mid X_{1j}{L_j} X_{lj} \\end{equation*} </div></p>' ,'complete test');
    });
});
