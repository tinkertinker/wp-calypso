/**
 * External dependencies
 */
import page from 'page';

/**
 * Internal dependencies
 */
import { sidebar } from 'me/controller';
import { account } from './controller';

export default function() {
	page( '/me/account', sidebar, account );
}
