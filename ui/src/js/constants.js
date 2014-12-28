define([], function() {
  var baseURL = '';

  var K = {
    NEW_MODEL_ID: 'new',

    ACCESS_POLICY_PUBLIC: 'public',
    ACCESS_POLICY_PRIVATE: 'private',

    APP_PRIMARY_LAYER: 'APP_PRIMARY_LAYER',
    APP_SECONDARY_LAYER: 'APP_SECONDARY_LAYER',

    NAVIGATION_DASHBOARD: baseURL + '/dashboard',

    // Needed by guest layout navigation to tell whether we're currently on the
    // landing page or not:
    GUEST_PRIMARY_ROUTE: '/welcome',

    USER_CREATE: 'USER_CREATE',
    USER_RESET_PASSWORD: 'USER_RESET_PASSWORD',
    USER_SAVE_PREFERENCES: 'USER_SAVE_PREFERENCES',

    // Use strings for i18n
    ERROR_ACCESS_UNAUTHORIZED: 'Unauthorized',
    ERROR_ACCESS_OVERAUTHORIZED: 'Overauthorized',
    ERROR_NOT_FOUND: 'ERROR_NOT_FOUND',

    DEFAULT_PUBLIC_ROUTE: 'guestIndex',
    DEFAULT_PRIVATE_ROUTE: 'dashboardIndex',

    PUBLIC_LAYOUT_NAME: 'guest',
    PRIVATE_LAYOUT_NAME: 'member',

    API_DATE_FORMAT: 'MM/DD/YYYY',

    DAYS_OF_WEEK: [
      'sunday',
      'monday',
      'tuesday',
      'wednesday',
      'thursday',
      'friday',
      'saturday'
    ],

    PLATFORM_MOBILE: 'mobile',
    PLATFORM_TABLET: 'tablet',
    PLATFORM_DESKTOP: 'desktop',

    DRILLDOWN_TODAY: 'today',
    DRILLDOWN_YESTERDAY: 'yesterday',
    DRILLDOWN_DAYS: 'days',
    DRILLDOWN_SINGLE_MONTH: 'single_month',
    DRILLDOWN_MONTHS: 'months',
    DRILLDOWN_YEARS: 'years',

    LAYOUT_DIALOGS: 'dialogs',
    LAYOUT_GUEST: 'guest',
    LAYOUT_MAIN: 'member',
    LAYOUT_DRAWER: 'drawer',

    PRAYER_FAJR: 'fajr',
    PRAYER_DUHA: 'duha',
    PRAYER_DHUHR: 'dhuhr',
    PRAYER_ASR: 'asr',
    PRAYER_MAGHRIB: 'maghrib',
    PRAYER_ISHAA: 'ishaa',
    PRAYER_WITR: 'witr',

    PRAYER_TIMELINE: [
      'fajr',
      'duha',
      'dhuhr',
      'asr',
      'maghrib',
      'ishaa',
      'witr'
    ],

    PRAYER_OUTBOUND_ATTRS: [
      'type',
      'date',
      'on_time',
      'in_congregation',
      'in_mosque',
      'with_dhikr',
      'with_sunnah',
      'with_preceding_sunnah',
      'with_full_preceding_sunnah', // Dhuhr, 4 rakaat
      'with_subsequent_sunnah',
      'with_sunnah_on_time', // for Fajr
      'in_last_third', // Witr
    ]
  };

  return K;
});