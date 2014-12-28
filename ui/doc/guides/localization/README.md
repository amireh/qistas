# Localization

**Referencing arguments in the translation string**

Surround the variable name you passed with `__` like this:

    some_key: Hello __username__

**Long strings (aka line groups)**

Defining a string to hold a group of lines in YAML is done by using the `>` denoter:

    some_key: >
      A very
      long
      translation string.

Remember that YAML is whitespace-sensitive, so once you start a group with `>`
all related lines must be indented at the same level.

**Mixing in some HTML**

    visit_settings: >
      Go to your <a href="/settings">settings</a> page.

**Pluralizing**

Suffix the key with `_plural_` and follow that by the count group:

    Transactions: 'ﺣﺮﻛﺔ'
    Transactions_plural_2: 'ﺣﺮﻛﺘﻴﻦ'
    Transactions_plural_3: '__count__ ﺣﺮﻛﺎﺕ'
    Transactions_plural_11: '__count__ ﺣﺮﻛﺔ'
    Transactions_plural_100: '__count__ ﺣﺮﻛﺔ'

Pluralization is strictly language-specific, refer to the library guide for
more information.

**More**

To exploit the i18n interface, refer to [i18next](http://i18next.com/); the library
Pibi.js uses for localization.

### Using i18n in Handlebars

Invoking the i18n helpers in Handlebars templates is similar to invoking other
helpers. Anyway, here are some examples:

**Case 1: a key inside a namespace**

     {{t "ns_section.some_key"}}

**Case 2: passing an argument**

    {{t "ns_section.some_key" count=1}}

**Case 3: passing multiple arguments**

    {{t "ns_section.some_key" count=1 foo="bar"}}

Sticking to the [style guide](#!/guide/style_guide), use double
quotes to reference i18n keys.
