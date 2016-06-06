/**
 * External dependencies
 */
import config from 'config';
import page from 'page';

/**
 * Internal dependencies
 */
import { sidebar } from 'me/controller';
import controller from './controller';

export default function() {
	if ( config.isEnabled( 'me/billing-history' ) ) {
		page( '/me/billing', sidebar, controller.billingHistory );
		page( '/me/billing/:transaction_id', sidebar, controller.transaction );
	}
}
