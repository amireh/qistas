define([
  'require',
  'config',
  'underscore',
  'i18next',
  'text!config/default_locale.json',
  'rsvp',
  './locale'
], function(require, Config, _, i18n, defaultLocale, RSVP, locale) {

  /**
   * @class  Pibi.Util.i18n
   *
   * i18n provider.
   */
  function init(userLocale, resolve, reject) {
    var namespaceRegex = /([\w|_]+\.)+/;
    // The locale data that will be available for use by the application.
    var locales = {};

    // Localization namespace, used internally by i18next and not by us.
    var namespace = 'translation';

    // i18next config.
    var config  = {
      lng: locale,
      fallbackLng: 'en',
      supportedLngs: Config.availableLocales,
      load: false,
      ns: { namespaces: [ namespace ], defaultNs: namespace },
      useCookie: false,
      useLocalStorage: false,
      lowerCaseLng: true,
      getAsync: false,
      fallbackOnNull: true,
      resGetPath: 'assets/locales/__lng__/__ns__.json',
      detectLngFromHeaders: false,
      dynamicLoad: false,
      postProcess: 'ensureFallback'
    };

    locales.en = {};
    locales.en[namespace] = JSON.parse(defaultLocale).en;

    if (userLocale) {
      try {
        locales[locale] = {};
        locales[locale][namespace] = JSON.parse(userLocale)[locale];
      } catch(e) {
        console.log('Locale error! Unable to parse locale data: ', userLocale);

        // Die hard on development, this is most probably a missing locale.
        //
        //>>excludeStart("production", pragmas.production);
        reject(e.message);
        //>>excludeEnd("production");

        // Gracefully fallback to 'en'
        config.lng = locale = 'en';
      }
    }

    config.resStore = locales;

    //>>excludeStart("production", pragmas.production);
    config.debug = true;
    //>>excludeEnd("production");

    i18n.init(config);

    var t = i18n.t;
    i18n.t = function(key, defaultValue, options) {
      if (_.isString(defaultValue)) {
        return t(key, _.extend({}, options, { defaultValue: defaultValue }));
      }

      return t.apply(this, arguments);
    };

    console.log('I18n engine ready.');
    resolve();
  }

  return function loadLocale() {
    var service = RSVP.defer();

    if (locale !== 'en') {
      require([ 'text!/assets/locales/' + locale + '/locale.json' ], function(userLocale) {
        init(userLocale, service.resolve, service.reject);
      });
    } else {
      init(null, service.resolve, service.reject);
    }

    return service.promise;
  }
});