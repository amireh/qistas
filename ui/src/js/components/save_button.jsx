/** @jsx React.DOM */
define([ 'react' ], function(React) {
  var classSet = React.addons.classSet;
  var STATE_IDLE = 1;
  var STATE_LOADING = 2;
  var STATE_SUCCESS = 3;
  var STATE_ERROR = 4;

  function activate(e) {
    if (this.props.onClick) {
      this.props.onClick(e);
    }

    if (!e.isDefaultPrevented()) {
      this.markLoading();
    }
  }

  /**
   * @class Components.SaveButton
   *
   * A button that turns into a loading indicator when pushed.
   */
  var SaveButton = React.createClass({
    propTypes: {
      children: React.PropTypes.renderable,
      className: React.PropTypes.oneOf([ 'default', 'primary', 'success', 'danger' ]),
      onClick: React.PropTypes.func,
      resetTimer: React.PropTypes.number
    },

    getInitialState: function() {
      return {
        buttonState: STATE_IDLE
      };
    },

    getDefaultProps: function() {
      return {
        className: 'default',
        resetTimer: 500,
        overlay: false,
        paddedOverlay: false,
        onClick: null,
        prependedIcon: false
      };
    },

    componentDidUpdate: function() {
      if (this.state.buttonState === STATE_IDLE) {
        if (this.__resetTimer) {
          clearTimeout(this.__resetTimer);
          this.__resetTimer = null;
        }
      }
    },

    render: function() {
      var isIdle = this.state.buttonState === STATE_IDLE;
      var isLoading = this.state.buttonState === STATE_LOADING;
      var className = {
        'btn': true,
        'save-button': true,
        'overlay': this.props.overlay,
        'padded-overlay': this.props.paddedOverlay,
        'state-loading': this.state.buttonState === STATE_LOADING,
        'state-success': this.state.buttonState === STATE_SUCCESS,
        'state-error': this.state.buttonState === STATE_ERROR,
        'prepended-icon': this.props.prependedIcon
      };

      className['btn-' + this.props.className] = true;

      return (
        <button
          data-primary={this.props.primary}
          onClick={activate.bind(this)}
          disabled={isLoading}
          title={this.props.title}
          className={classSet(className)}>
          {!isIdle && <span className="indicator"></span>}
          <span className="content">
            {this.props.children || 'Save'}
          </span>
        </button>);
    },

    _mark: function(state) {
      if (this.isMounted()) {
        this.setState({
          buttonState: state
        });
      }
    },

    reset: function() {
      this._mark(STATE_IDLE);
    },

    isIdle: function() {
      return this.__resetTimer || this.state === STATE_IDLE;
    },

    markLoading: function() {
      this._mark(STATE_LOADING);
    },

    markDone: function(success) {
      this._mark(success ? STATE_SUCCESS : STATE_ERROR);

      this.__resetTimer = setTimeout(this.reset, this.props.resetTimer);
    },

    bindToService: function(service) {
      var markDone = this.markDone;

      service.then(function() {
        markDone(true);
      }, function() {
        markDone(false);
      });
    }
  });

  return SaveButton;
});