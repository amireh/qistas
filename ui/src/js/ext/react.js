define(function(require) {
  var React = require('pixy/ext/react');
  var LinkUtils = require('./react/link_utils');
  var FormErrorsMixin = require('mixins/form_errors');
  var ErrorNotifierMixin = require('mixins/components/error_notifier');
  var AutoFocusChildMixin = require('mixins/components/auto_focus_child');
  var FormKeySubmissionMixin = require('mixins/components/form_key_submission');
  var SingleSelectionMixin = require('mixins/single_selection');
  var DraftStateMixin = require('mixins/components/draft_state');
  var ItemActivatorMixin = require('mixins/components/item_activator');
  var ResponsiveMixin = require('mixins/components/responsive');
  var SelectableMixin = require('mixins/selectable');
  var TooltipsMixin = require('mixins/components/tooltips');

  React.addons.ErrorNotifierMixin = ErrorNotifierMixin;
  React.addons.AutoFocusChildMixin = AutoFocusChildMixin;
  React.addons.FormKeySubmissionMixin = FormKeySubmissionMixin;
  React.addons.FormErrorsMixin = FormErrorsMixin;
  React.addons.SingleSelectionMixin = SingleSelectionMixin;
  React.addons.DraftStateMixin = DraftStateMixin;
  React.addons.ItemActivatorMixin = ItemActivatorMixin;
  React.addons.ResponsiveMixin = ResponsiveMixin;
  React.addons.SelectableMixin = SelectableMixin;
  React.addons.TooltipsMixin = TooltipsMixin;

  React.LinkUtils = LinkUtils;

  return React;
});