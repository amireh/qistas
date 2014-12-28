/** @jsx React.DOM */
define(function(require) {
  var React = require('react');
  var t = require('i18n!editor/dhuhr');
  var Checkbox = require('jsx!components/checkbox');

  var Dhuhr = React.createClass({
    render: function() {
      return(
        <div>
          <Checkbox
            checkedLink={this.props.linkState('withPrecedingSunnah')}
            label={t('checkboxes.with_preceding_sunnah', "With the preceding Sunnah")} />

          {this.props.linkState('withPrecedingSunnah').value &&
            <div className="ig-indent">
              <Checkbox
                checkedLink={this.props.linkState('withFullPrecedingSunnah')}
                label={t('checkboxes.with_full_preceding_sunnah', "Conducted all four raka'āt")} />
            </div>
          }

          <Checkbox
            checkedLink={this.props.linkState('withSubsequentSunnah')}
            label={t('checkboxes.with_subsequent_sunnah', "With the subsequent (two-rak'ah‎) Sunnah")} />
        </div>
      );
    }
  });

  return Dhuhr;
});