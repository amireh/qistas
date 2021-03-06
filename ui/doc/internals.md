# Internals

## Separation of Concerns

The engine is built of four distinct types of components, and two singletons, the dispatcher, and the master layout.

### 1. Routes

    - Loads initial data
    - Injects layout with data
    - Listens to stores for updated data:
        + Repeats the injection process

### 2. The Master Layout

    - Renders views into regions:
        - Usually done using sub-layouts
    - Controls visibility of regions based on application state

### 3. Views

    - Translate user input into actions
    - Present action outcome

### 4. Action Handlers

    - Validate action parameters (user input)
    - Build an optionally decorated "action payload"
    - Pass action payload to the stores to process via the Dispatcher:
        - Perform any post-processing after the store(s) are done
    - Maintain a link between the view's action request and the result of the action

### 5. The Dispatcher

    - Maintains a unique index (`actionIndex`) for every action made
    - Injects stores with action payload
    - Maintains a link with the stores
    - Maintains a link with the actionHandler

### 6. Stores

    - Accept subscriptions for data updates and processing errors
    - Process actions

## Authentication

    1. AppRoute subscribes to SessionStore as a listener to change events
    2. User takes an action that calls SessionActions#create, e.g, in a Login dialog
    3. SessionStore attempts to authenticate the session
        1. If successful, a change event is emitted
            1. AppRoute picks up the change and:
                1. sets the AppLayout into loading state
                2. transitions to the member index (`dashboardIndex`)
                    1. resets the AppLayout from the loading state
                    2. tells AppLayout that we're authenticated
                        1. AppLayout changes the child layout from GuestLayout to MemberLayout
        2. Otherwise, an error event of type `storeError` is emitted
            1. error gets propagated up to AppRoute#error event handler
            2. AppRoute injects the event into AppLayout
            3. AppLayout forwards the event down the chain looking for the initiator for that action (identified by `actionIndex`)
                1. initiator handles the error as needed
            4. AppLayout consumes the event on the next `render` pass

## Action Initiation Workflow

    - View receives input from user
    - View performs a specific action defined in `actions/*.js`
        - An `actionIndex` is returned to the view
    - ActionHandler in `actions/*.js` receives action parameters from view, builds the payload for the store, and decorates it as needed
    - ActionHandler dispatches payload to the store and receives a promise
        - Waits on the dispatcher for the store to finish processing
    - Store picks up action and processes it:
        - Emits a store change event
        - Resolves its promise with the dispatcher
    - Dispatcher resolves its promise with the action handler
        - ActionHandler can now post-process if it needs to, or chain with another action handler

## Action Result Processing Workflow

### Data change events

    - Route subscribes to the store for change events
    - Store emits a change event, signalling that it has new data
    - Route injects the data it needs from the store's state into the layout
    - Layout updates with new data

### Action error events

    - Route subscribes to the store for action error events
    - View initiaties an action and receives an `actionIndex`
        - View keeps a reference to the index in its state
    - Action processing fails, store emits an action error event that contains:
        + action identifier (in `constants.js`)
        + action index (generated by the dispatcher)
        + the error object
    - Route receives the event, and injects the layout with the `actionIndex` and the error object as a `StoreError`
    - Layout passes the error down the chain
        + Each view that is an "action initiator" tests the error's actionIndex against its own actionIndex
        + The view that identifies the error to be for the action it initiated can now represent it to the user
    - Layout "consumes" the storeError event after the pass of render is done, ready for more events in the next pass