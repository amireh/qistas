/** @jsx React.DOM */
define(function(require) {
  var React = require('react');
  var t = require('i18n!member/navigation');
  var linkTo = require('util/link_to');
  var AVAILABLE_APPS = require('json!config/available_apps');

  /**
   * @internal
   *
   * The [href] attribute of the active .navbar-link.
   *
   * See constants/navigation.js
   */
  var activeLink;

  /**
   * @internal
   *
   * The [href] attribute of the active .navbar-subnav link
   *
   * This will only make sense if activeLink is set.
   */
  var activeChild;

  /**
   * @internal Test if a link is currently active.
   */
  var isActive = function(href, isChild) {
    return href === (isChild ? activeChild : activeLink);
  };

  var Link = React.createClass({
    render: function() {
      var klasses = {
        'navbar-link': !this.props.isChild,
        'active': isActive(this.props.href, this.props.isChild),
        'pull-right': this.props.pullRight
      };

      if (this.props.icon) {
        klasses[this.props.icon] = true;
      }

      return (
        <a
          className={React.addons.classSet(klasses)}
          href={this.props.href}
          title={this.props.title}
          children={this.props.children} />
      );
    }
  });

  var SubNav = React.createClass({
    render: function() {
      var style = {};

      if (!isActive(this.props.for)) {
        style.display = 'none';
      }

      return (
        <ul className="navbar-subnav" style={style}>
          {this.props.children}
        </ul>
      );
    }
  });

  var SubLink = React.createClass({
    render: function() {
      return (
        <li>
          <Link href={this.props.href} isChild={true}>{this.props.children}</Link>
        </li>
      );
    }
  });

  var Places = React.createClass({
    componentDidUpdate: function() {
    },

    render: function() {
      activeLink = this.props.active;
      activeChild = this.props.activeChild;

      return(
        <div className="group">
          <Link
            icon="icon-home"
            href={linkTo('/dashboard')}
            children={t('overview', 'Overview')} />

          <Link
            icon="icon-calendar"
            href={linkTo('/scoreboard')}
            children={t('scoreboard', 'Scoreboard')} />

          <Link
            icon="icon-power"
            href={linkTo('/logout')}
            pullRight
            children={t('logout', 'Logout')} />
        </div>
      );
    }
  });

  return Places;
});