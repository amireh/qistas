define(function() {
  return {
    defaultLocale: 'en',
    precision: 2,

    /**
     * The set of available locales, automatically generated by the locale
     * generation module.
     */
    availableLocales: [
      'en',
      'ar',
      'es',
      'ro'
    ],

    localeNames: {
      'en': 'English',
      'ar': 'العربية',
      'es': 'Espagnol',
      'ro': 'Romanian'
    },

    apiDateFormat: 'MM[/]DD[/]YYYY',

    defaultPreferences: {
      "user": {
        "dateFormat": 'DD[/]MM[/]YYYY',

        "theme": "vanilla",

        // The starting set of currencies.
        "currencies": [
          "USD",
          "EUR"
        ]
      }
    }
  };
});