/**
 * External dependencies
 */
import config from 'config';
import page from 'page';

/**
 * Internal dependencies
 */
import { sidebar } from 'me/controller';
import {
	password,
	twoStep,
	connectedApplications,
	connectedApplication,
	securityCheckup
} from './controller';

export default function() {
	if ( config.isEnabled( 'me/security' ) ) {
		page( '/me/security', sidebar, password );
		page( '/me/security/two-step', sidebar, twoStep );
		page( '/me/security/connected-applications', sidebar, connectedApplications );
		page( '/me/security/connected-applications/:application_id', sidebar, connectedApplication );
	}

	if ( config.isEnabled( 'me/security/checkup' ) ) {
		page( '/me/security/checkup', sidebar, securityCheckup );
	}
}
