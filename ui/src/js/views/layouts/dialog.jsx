/** @jsx React.DOM */
define([
  'ext/react',
  'jquery',
  'actions/routes',
  'i18n!dialogs',
  'jsx!components/journal',
  'jsx!components/dialog',
], function(React, $, Actions, t, Journal, Dialog) {
  var DialogLayout = React.createClass({
    mixins: [ React.addons.StackedLayoutMixin, React.addons.ActorMixin ],

    propTypes: {
      /**
       * @cfg {Boolean} [largeDialog=false]
       *      Set this global property to true if you know the dialog is very
       *      large and will require scrolling. This will make the layout span
       *      to cover almost the entire screen vertically.
       */
      largeDialog: React.PropTypes.bool
    },

    getDefaultProps: function() {
      return {
        largeDialog: false,

        backlog: {
          showingJournal: false
        }
      };
    },

    componentDidMount: function() {
      $(document.body).toggleClass('with-dialog', this.hasDialog());
    },

    componentDidUpdate: function() {
      $(document.body).toggleClass('with-dialog', this.hasDialog());
    },

    componentWillUnmount: function() {
      $(document.body).removeClass('with-dialog');
    },

    hasDialog: function() {
      return this.props.backlog.showingJournal || !!this.getNextComponentType();
    },

    render: function() {
      var className = React.addons.classSet({
        'large-dialog': this.props.largeDialog
      });

      return(
        <aside id="dialogs" className={className}>
          {this.props.backlog.showingJournal ?
            this.renderJournal() :
            this.renderComponent({
              onClose: this.closeDialog
            })
          }
        </aside>
      );
    },

    renderJournal: function() {
      return Dialog({
        onClose: this.hideJournal,
        title: t('journal.title', 'Pibi Journal'),
        scrollable: true,
        noPadding: true,
        children: Journal({
          title: false,
          pending: this.props.backlog.pending,
          dropped: this.props.backlog.dropped
        })
      });
    },

    closeDialog: function() {
      Actions.backToPrimaryView();
    },

    hideJournal: function() {
      this.sendAction('backlog:hideJournal');
    }
  });

  return DialogLayout;
});