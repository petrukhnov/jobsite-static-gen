var viewmodel = require('../lib/filters/viewmodel'),
    assert = require('assert');

describe('preparing math expressions', function() {
    it('should prepare math expressions for blog post from string', function() {
        var testMarkup = '<p>.. math::Z_j \mid X_{1j},\dots,X_{L_jj} = \sum_{l=1}^{L_j} X_{lj} + \varepsilon_j</p>';
        assert.deepEqual(viewmodel.prepareMath(testMarkup), '<p><div class="math"> \\begin{equation*} Z_j \mid X_{1j},\dots,X_{L_jj} = \sum_{l=1}^{L_j} X_{lj} + \varepsilon_j \\end{equation*} </div></p>' ,'complete test');
    });

    it('should prepare math expressions for blog post from string - more than one math expression', function() {
        var testMarkup = '<p>.. math::Z_j mid X_{1j}{L_j} X_{lj}.. math::Z_j mid X_{1j}{L_j} X_{lj}</p>';
        assert.deepEqual(viewmodel.prepareMath(testMarkup), '<p><div class="math"> \\begin{equation*} Z_j mid X_{1j}{L_j} X_{lj} \\end{equation*} </div><div class="math"> \\begin{equation*} Z_j mid X_{1j}{L_j} X_{lj} \\end{equation*} </div></p>' ,'complete test');
    });
});
