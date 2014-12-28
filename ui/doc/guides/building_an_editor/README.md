# Building an Editor

Markup required by the editor to function is broken off into pieces as small
as possible to allow you to customize the appearance as needed. See the partials in markup/mixins/editor/form for what they are.

Here's an example form that includes the necessary markup for the editor to
function:

```html
<form class="sidebar tx-editor" novalidate>
  <div class="sidebar-content renderable row-fluid">
    <fieldset>
      {{> mixins/editor/form/amount_and_currency}}

      <div>
        {{> mixins/editor/form/note_editor}}
      </div>

      <div>
        {{> mixins/editor/form/payment_method_picker}}
        {{> mixins/editor/form/category_picker}}
        {{> mixins/editor/form/attachment_editor}}
      </div>
    </fieldset>
  </div>

  <div class="sidebar-actions renderable row-fluid">
    {{> mixins/editor/actions}}
  </div>
</form>
```