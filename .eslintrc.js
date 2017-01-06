module.exports = {
    "extends": "airbnb",
    "plugins": [
        "react",
        "jsx-a11y",
        "import"
    ],
    "rules": {
        "react/prefer-es6-class": "off",
        "no-mixed-operators": "off",
        "no-unused-expressions": ["error", {"allowShortCircuit": true}]
    }
};