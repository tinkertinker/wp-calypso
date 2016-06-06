/**
 * External dependencies
 */
import page from 'page';

/**
 * Internal dependencies
 */
import { sidebar } from 'me/controller';
import {
	notifications,
	comments,
	updates,
	notificationSubscriptions
} from './controller';

export default function() {
	page( '/me/notifications', sidebar, notifications );
	page( '/me/notifications/comments', sidebar, comments );
	page( '/me/notifications/updates', sidebar, updates );
	page( '/me/notifications/subscriptions', sidebar, notificationSubscriptions );
}
