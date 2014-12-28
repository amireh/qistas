/** @jsx React.DOM */
define([ 'react', 'i18n!not_found', 'jsx!components/dialog' ],
function(React, t, Dialog) {
  var NotFound = React.createClass({
    render: function() {
      return (
        Dialog({
          thin: true,
          scrollable: false,
          title: t('heading', '404 - Not Found'),
          children: (
            <p>
              {t('message', 'We were unable to find the page you were looking for.')}
            </p>
          ),
          onClose: this.props.onClose,
          footer: (
            <button
              onClick={this.props.onClose}
               className="btn btn-default">
              {t('buttons.go_back', 'Go Back')}
            </button>
          )
        })
      );
    }
  });

  return NotFound;
});