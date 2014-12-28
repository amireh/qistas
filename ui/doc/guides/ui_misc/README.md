## Displaying notifications

The {#Flash} module is responsible for displaying "flash" messages that can
be used to notify the user of an action's progress and status.

To display a notification, use {@link State#notify}:

    @example
    Pibi.notify('action_complete', 'good')