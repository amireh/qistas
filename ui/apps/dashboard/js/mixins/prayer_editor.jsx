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
          this.showEditor(this.state.editedElement);
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
        canUntrack: !!editedPrayer,
        onClose: this.stopEditing,
        onChange: this.repositionPopup
      });
    },

    edit: function(type, date, e) {
      var target = e.currentTarget || e.target;

      e.preventDefault();

      if (this.state.editedElement === target) {
        this.stopEditing();
      }
      else if (type === this.state.editedPrayerType && date === this.state.editedPrayerDate) {
        this.stopEditing();
      }
      else {
        this.setState({
          editedPrayerType: type,
          editedPrayerDate: date,
          editedElement: target
        });
      }
    },

    editOnReturn: function(type, date, e) {
      if (e.which === 13) {
        this.edit(type, date, e);
      }
    },

    showEditor: function(el) {
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