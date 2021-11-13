/**
 * @Author: zuokangsheng
 * @Date:   2021-11-13 11:44:17
 * @Last Modified by:   zuokangsheng
 * @Last Modified time: 2021-11-13 12:31:23
 */
module.exports = {
    'env': {
        'commonjs': true,
        'es2021': true,
        'node': true
    },
    'extends': 'eslint:recommended',
    'parserOptions': {
        'ecmaVersion': 12
    },
    'rules': {
        'indent': [
            'error',
            4
        ],
        'linebreak-style': [
            'error',
            'unix'
        ],
        'quotes': [
            'error',
            'single'
        ],
        'semi': [
            'error',
            'always'
        ]
    }
};
