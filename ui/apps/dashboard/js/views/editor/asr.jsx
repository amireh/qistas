/** @jsx React.DOM */
define(function(require) {
  var React = require('react');
  var t = require('i18n!editor/asr');
  var Checkbox = require('jsx!components/checkbox');

  var Asr = React.createClass({
    render: function() {
      return(
        <div>
          <Checkbox
            checkedLink={this.props.linkState('withSunnah')}
            label={t('checkboxes.with_sunnah', "With the Sunnah")} />

          {this.props.linkState('with_sunnah').value &&
            <div className="ig-indent">
              <Checkbox
                checkedLink={this.props.linkState('withFullSunnah')}
                label={t('checkboxes.with_full_sunnah', "Conducted all four raka'āt")} />
            </div>
          }
        </div>
      );
    }
  });

  return Asr;
});