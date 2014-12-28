/** @jsx React.DOM */
define(function(require) {
  var React = require('react');
  var Editor = require('jsx!../views/editor');
  var Popup = require('jsx!components/popup');
  var $ = require('jquery');
  var moment = require('moment');

  var PrayerEditor = {
    getInitialState: function() {
      return {
        editedPrayerType: null,
        editedPrayerDate: null,
        editedElement: null
      };
    },

    componentDidMount: function() {
      if (typeof this.getPrayer !== 'function') {
        throw new Error("You must define #getPrayer() to use the PrayerEditor mixin.");
      }

      if (!this.refs.editorPopup) {
        throw new Error(
          "You must render the editor popup using #renderEditor() " +
          "to use the PrayerEditor mixin."
        );
      }
    },

    componentDidUpdate: function(prevProps, prevState) {
      if (!this.state.editedElement) {
        this.hideEditor();
      }
      else if (
        this.state.editedPrayerType !== prevState.editedPrayerType ||
        this.state.editedPrayerDate !== prevState.editedPrayerDate
      ) {
        if (this.state.editedPrayerType && this.state.editedPrayerDate) {
          this.showEditor(
            this.state.editedPrayerType,
            this.state.editedPrayerDate,
            this.state.editedElement
          );
        }
      }
    },

    renderEditor: function() {
      var state = this.state;
      var editedPrayer;
      var editorProps;

      if (this.state.editedPrayerType) {
        editedPrayer = this.getPrayer(state.editedPrayerType, state.editedPrayerDate);
      }

      return Popup({
        ref: "editorPopup",
        reactivePositioning: true,
        content: Editor,
        type: this.state.editedPrayerType,
        date: this.state.editedPrayerDate,
        children: <span hidden />,
        prayer: editedPrayer,
        onClose: this.stopEditing,
        onChange: this.repositionPopup
      });
    },

    edit: function(prayerId, date, e) {
      e.preventDefault();

      if (this.state.editedElement === e.target) {
        this.stopEditing();
      }
      else {
        this.setState({
          editedPrayerType: prayerId,
          editedPrayerDate: date,
          editedElement: e.target
        });
      }
    },

    showEditor: function(prayerId, date, el) {
      var popup = this.refs.editorPopup;
      var api = popup.proxy('getApi');

      api.set('position.target', $(el));
      api.show();
      api.reposition();
    },

    stopEditing: function() {
      this.replaceState({});
    },

    hideEditor: function() {
      this.refs.editorPopup.close();
    },

    repositionPopup: function() {
      this.refs.editorPopup.reposition();
    }
  };

  return PrayerEditor;
});