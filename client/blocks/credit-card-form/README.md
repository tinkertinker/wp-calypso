Credit Card Form
=========

This component is used to display a credit card form.

#### How to use:

```js
import CreditCardForm from 'blocks/credit-card-form';

render() {
	return (
		<CreditCardForm
			initialValues={ { name: 'John Doe' } }
			recordFormSubmitEvent={ () => {} }
			saveStoredCard={ () => Promise.reject( { message: 'This is only example!' } ) }
			successCallback={ () => {} } />
	);
}
```

#### Props

* `initialValues`: Optional object containing initial values for the form fields. At the moment only `name` is supported.
* `recordFormSubmitEvent`: Function to be executed when the user clicks the _Save Card_ button.
* `saveStoredCard`: Optional function returning _Promise_ to be executed when a Paygate token is created after the user clicked the _Save Card_ button. By default `wpcom.updateCreditCard` Redux action is executed because of legacy reasons.
* `successCallback`: Function to be executed when a credit card is successfully stored.
