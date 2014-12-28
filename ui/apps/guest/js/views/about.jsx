/** @jsx React.DOM */
define(function(require) {
  var React = require('react');
  var t = require('i18n!guest/about');
  var version = require('version');
  var Dialog = require('jsx!components/dialog');
  var GuestAbout = React.createClass({
    getDefaultProps: function() {
      return {
      };
    },

    render: function() {
      return Dialog({
        title: t('dialog_title', 'About Pibi'),
        onClose: this.props.onClose
      }, this.renderContent());
    },

    renderContent: function() {
      return(
        <div className="text-center about">
          <div className="icon-pibi-icon icon-blue icon-128" />
          <strong>{t('pibi', 'Pibi')}</strong><br />{version}
          <p>
            Copyright &copy; 2014 <a href="http://www.algollabs.com">Algol Labs</a>.<br />
            All Rights Reserved
          </p>
          <p className="actions">
            <a className="btn btn-small btn-primary icon-facebook" href="https://www.facebook.com/pibiapp" target="_blank"> Like </a>
            {' '}
            <a className="btn btn-small btn-primary icon-twitter" href="https://www.twitter.com/pibiapp" target="_blank"> Follow </a>
            {' '}
            <a className="btn btn-small btn-success emblem-lamp" href="http://support.pibiapp.com" target="_blank"> Get Help </a>
          </p>

          <hr />

          <h3>{t('licenses', 'Licenses')}</h3>

          <div className="acknowledgement">
            <h4 className="title">RequireJS</h4>
            <p className="library-info">
              Copyright &copy; 2010-2011 The Dojo Foundation<br />
              License: <a href="https://github.com/jrburke/requirejs/blob/master/LICENSE"
                 target="_blank">BSD, MIT</a>
            </p>

            <h4 className="title">jQuery</h4>
            <p className="library-info">
              Copyright &copy; 2012 jQuery Foundation and other contributors<br />
              License: <a href="http://jquery.org/license"
                 target="_blank">jquery.org/license</a>
            </p>

            <h4 className="title">jQuery ScrollIntoView</h4>
            <p className="library-info">
              Copyright &copy; 2011 Robert Koritnik
              <br />
              License: <a href="http://www.opensource.org/licenses/mit-license.php"
                 target="_blank">MIT</a>
            </p>

            <h4 className="title">jQuery Flot</h4>
            <p className="library-info">
              Copyright &copy; 2007-2013 IOLA and Ole Laursen
              <br />
              License: <a href="https://github.com/flot/flot/blob/master/LICENSE.txt"
                 target="_blank">MIT</a>
            </p>

            <h4 className="title">BJQS</h4>
            <p className="library-info">
              Copyright 2011, John Cobb
              <br />
              License: <a href="http://www.opensource.org/licenses/gpl-3.0.html"
                 target="_blank">GPL-3.0</a>
            </p>

            <h4 className="title">FastClick</h4>
            <p className="library-info">
              Copyright &copy; 2013 The Financial Times Limited
              <br />
              License: <a href="http://www.opensource.org/licenses/mit-license.php"
                 target="_blank">MIT</a>
            </p>

            <h4 className="title">Chosen.js</h4>
            <p className="library-info">
              Copyright &copy; 2011 Harvest
              <br />
              License: <a href="https://github.com/harvesthq/chosen/blob/master/LICENSE.md"
                 target="_blank">MIT</a>
            </p>

            <h4 className="title">EventSource.js</h4>
            <p className="library-info">
              Copyright &copy; 2012 vic99999@yandex.ru
              <br />
              License: <a href="http://www.opensource.org/licenses/mit-license.php"
                 target="_blank">MIT</a>
            </p>

            <h4 className="title">inflection.js</h4>
            <p className="library-info">
              Copyright &copy; 2010 Ryan Schuft
              <br />
              License: <a href="http://www.opensource.org/licenses/mit-license.php"
                 target="_blank">MIT</a>
            </p>

            <h4 className="title">Pikaday</h4>
            <p className="library-info">
              Copyright &copy; 2013 David Bushell
              <br />
              License: <a href="http://www.opensource.org/licenses/mit-license.php"
                 target="_blank">MIT</a>
            </p>

            <h4 className="title">shortcut.js</h4>
            <p className="library-info">
              Copyright &copy; 2013 Binny V A
              <br />
              License: <a href="http://opensource.org/licenses/BSD-3-Clause"
                 target="_blank">BSD</a>
            </p>

            <h4 className="title">Store.js</h4>
            <p className="library-info">
              Copyright &copy; 2010-2013 Marcus Westin
              <br />
              License: <a href="https://github.com/marcuswestin/store.js/blob/master/LICENSE"
                 target="_blank">MIT</a>
            </p>

            <h4 className="title">Backbone.js</h4>
            <p className="library-info">
              Copyright &copy; 2010-2012 Jeremy Ashkenas, DocumentCloud<br />
              License: <a href="https://github.com/documentcloud/backbone/blob/master/LICENSE"
                 target="_blank">github.com/documentcloud/backbone</a>
            </p>

            <h4 className="title">Backbone.stickit</h4>
            <p className="library-info">
              Copyright &copy; 2012 The New York Times, CMS Group, Matthew DeLamb<br />
              License: <a href="https://github.com/NYTimes/backbone.stickit/blob/master/LICENSE"
                 target="_blank">MIT</a>
            </p>

            <h4 className="title">Backbone DeepModel</h4>
            <p className="library-info">
              Copyright &copy; 2013 Charles Davison<br />
              License: <a href="https://github.com/powmedia/backbone-deep-model/blob/master/LICENSE"
                 target="_blank">github.com/powmedia/backbone-deep-model</a>
            </p>

            <h4 className="title">Lo-Dash</h4>
            <p className="library-info">
              Copyright &copy; 2012 John-David Dalton<br />
              License: <a href="https://github.com/bestiejs/lodash/blob/master/LICENSE.txt"
                 target="_blank">MIT</a>
            </p>

            <h4 className="title">jQuery++</h4>
            <p className="library-info">
              Copyright &copy; 2012 Bitovi<br />
              License: <a href="https://github.com/bitovi/jquerypp/blob/master/license.md"
                 target="_blank">github.com/bitovi/jquerypp</a>
            </p>
            <h4 className="title">
              handlebars.js
            </h4>
            <p className="library-info">
              Copyright &copy; 2011 by Yehuda Katz<br />
              License: <a href="https://github.com/wycats/handlebars.js/blob/master/LICENSE"
                 target="_blank">github.com/wycats/handlebars.js</a>
            </p>
            <h4 className="title">
              Moment.js
            </h4>
            <p className="library-info">
              Copyright &copy; 2011-2012 Tim Wood<br />
              License: <a href="https://github.com/timrwood/moment/blob/master/LICENSE"
                 target="_blank">github.com/timrwood/moment</a>
            </p>

            <h4 className="title">tinysort.js</h4>
            <p className="library-info">
               Copyright &copy; 2008-2013 Ron Valstar<br />
              License: <a href="https://raw.github.com/Sjeiti/TinySort/master/src/jquery.tinysort.js"
                 target="_blank">github.com/Sjeiti/TinySort</a>
            </p>


            <h4 className="title">Bootstrap</h4>
            <p className="library-info">
              Copyright &copy; 2012 Twitter, Inc.<br />
              License: <a href="http://www.apache.org/licenses/LICENSE-2.0"
                 target="_blank">twitter.github.com/bootstrap</a>
            </p>
          </div>

          <h3>Wallpapers</h3>
          <div className="acknowledgement">
            <h4>Subtle Patterns</h4>
            <p>
              Copyright 2013 &copy; Atle Mo<br />
              License: Subtle Patterns (<a rel="cc:attributionURL" property="cc:attributionName" href="http://subtlepatterns.com">Subtle Patterns</a>) / <a rel="license" href="http://creativecommons.org/licenses/by-sa/3.0/">CC BY-SA 3.0</a>
            </p>

            <h4>Jakub Nowaczyk</h4>
            <p>License: <a href="http://creativecommons.org/licenses/by-nc-nd/3.0/">CCA 3.0</a><br />
              deviantart: <a href="http://miguel-santos.deviantart.com">miguel-santos.deviantart.com</a>
            </p>

            <h4>Savannah</h4>
            <p>deviantart: <a href="http://photobysavannah.deviantart.com">
              photobysavannah.deviantart.com
            </a>
            </p>

            <h4>Jakub Nowaczyk</h4>
            <p>deviantart: <a href="http://kano89.deviantart.com/">kano89.deviantart.com</a></p>

          </div>

        </div>


      );
    }
  });

  return GuestAbout;
});