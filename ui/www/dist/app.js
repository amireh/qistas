/**
 * THIS FILE IS AUTO-GENERATED. DO NOT EDIT.
 */
requirejs.config({"baseUrl":"/src/js","map":{"*":{"underscore":"lodash","promise":"core/promise"}},"bundles":{"pixy":["pixy","pixy/ext/react","pixy/mixins/filterable_collection","pixy/mixins/routes","pixy/mixins/events","rsvp","router"]},"paths":{"react":"../../node_modules/react/dist/react-with-addons","jquery":"../../vendor/js/jquery/jquery-2.0.2","jquery.jquerypp":"../../vendor/js/jquery/jquerypp.custom","jquery.scrollintoview":"../../vendor/js/jquery/jquery.scrollintoview","jquery.qtip":"../../vendor/js/jquery/jquery.qtip","chosen":"../../vendor/js/chosen","store":"../../vendor/js/store","lodash":"../../vendor/js/lodash/lodash.custom","pikaday":"../../vendor/js/pikaday","shortcut":"../../node_modules/kandie-shortcut/dist/shortcut","inflection":"../../vendor/js/inflection","moment":"../../vendor/js/moment.min","d3":"../../vendor/js/d3.v3","md5":"../../vendor/js/md5","humane":"../../vendor/js/humane","dropzone":"../../vendor/js/dropzone-amd-module","accounting":"../../vendor/js/accounting","fastclick":"../../vendor/js/FastClick-0.6.9","enquire":"../../vendor/js/enquire","snap":"../../vendor/js/snap","pixy":"../../node_modules/pixy/dist/pixy","psync":"../../node_modules/psync/dist/psync","faye":"../../vendor/js/faye","mixpanel":"../../vendor/js/mixpanel/mixpanel","mixpanel-snippet":"../../vendor/js/mixpanel/mixpanel-snippet","i18next":"../../vendor/js/i18next/i18next.amd-1.6.3","text":"../../vendor/js/require/text","i18n":"../../vendor/js/require/i18n","jsx":"../../vendor/js/require/jsx","json":"../../vendor/js/require/json","apps":"../../apps","JSXTransformer":"../../vendor/js/require/JSXTransformer","diff":"../../vendor/js/deep-diff-0.1.4.min","available_apps":"config/available_apps.json"},"shim":{"jquery.jquerypp":["jquery"],"jquery.scrollintoview":["jquery"],"jquery.slider":["jquery"],"jquery.qtip":["jquery"],"chosen":{"deps":["jquery"],"exports":"Chosen"},"lodash":{"exports":"_"},"store":{"exports":"store"},"shortcut":{"exports":"shortcut"},"moment":{"exports":"moment"},"md5":{"exports":"md5"},"inflection":[],"pikaday":{"exports":"Pikaday","deps":["lodash","moment"]},"d3":{"exports":"d3"},"accounting":{"exports":"accounting"},"faye":{"exports":"Faye"},"enquire":{"exports":"enquire"},"snap":{"exports":"Snap"},"fastclick":{"exports":"FastClick"},"mixpanel-snippet":[],"mixpanel":{"deps":["mixpanel-snippet"]},"defaultLocale":[],"diff":{"exports":"DeepDiff"}},"jsx":{"fileExtension":".jsx"},"config":{"core/app_loader":{"loadDevelopmentApps":true}},"waitSeconds":20});

require([ 'config' ], function() {
  require([ 'boot' ]);
});