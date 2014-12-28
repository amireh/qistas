**Creating a Chosen dropdown and binding with Rivets**

```html
<select
  name="currency"
  rv-value="tx:currency"
  rv-chosen="user:preferences.currencies"
  class="with-arrow">
  <option rv-each-currency="user:preferences.currencies" rv-value="currency">
    {currency}
  </option>
</select>
```