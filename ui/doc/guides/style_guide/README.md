# Style Guide

## JavaScript

**Variables should be `camelCased`**

    var bugCount; // good
    var bug_count; // bad
    var BugCount; // bad
    var Bug_count; // omg

**Methods should be `camelCased`**

    function exterminateBugs() {}; // good
    function exterminate_bugs() {}; // bad
    function ExterminateBugs() {}; // bad
    function Exterminate_bugs() {}; // omg

**Classes should be capitalized**

    var BugBuster = {}; // good
    var bugBuster = {}; // not good

**ENUMs and Constants should be `UPPERCASED`**

    // an enum
    var EC_OK = 0;
    var EC_SOME_FAILURE = 1;

    // a constant
    var API_HOST = 'http://api.com';

**Strings should be `'single-quoted'`**

    alert('Hello.'); // good
    alert("Hello."); // bad

**Object IDs should be `snake_cased`**

    <div id="main_menu"></div> <!-- good -->
    <div id="main-menu"></div> <!-- bad -->
    <div id="mainmenu"></div> <!-- ouch -->

**CSS classes should be `dash-delimited`**:

    <img class="no-highlight" /> <!-- good -->
    <img class="no_highlight" /> <!-- bad -->
    <img class="nohighlight" /> <!-- terrible -->

**Self-references are defined in a `that` variable**:

    var that = this;
    var someClosure = function() {
      that.something();
    };

### jQuery

**Use `$` as a prefix for cached jQuery selectors**

    var anchor = $('a.some-anchor'); // bad
    var $anchor = $('a.some-anchor'); // good

### Backbone.js

**Events should be `snake_cased`**

    this.trigger('did_something'); // good
    this.trigger('didSomething'); // bad

**Events should be spoken from the 1st-person narrative**

    this.trigger('something_done'); // bad
    this.trigger('did_something'); // good

**Don't use `this.$el.find` in Backbone.View methods**

Utilize the `this.$` helper instead:

    this.$el.find('a'); // bad
    this.$('a'); // good

### More

The [jQuery style guide](http://contribute.jquery.org/style-guide/js/) is
sensible and mostly adhered to by Pibi.js, please read it for further coverage.

## CSS

*TBD*

## Locales

*TBD*