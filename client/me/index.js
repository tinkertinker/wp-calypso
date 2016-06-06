/**
 * External dependencies
 */
import config from 'config';
import page from 'page';

/**
 * Internal dependencies
 */
import {
	sidebar,
	profile,
	profileRedirect,
	nextSteps,
	nextStepsWelcomeRedirect,
	trophiesRedirect,
	findFriendsRedirect,
	apps
} from './controller';

export default function() {
	if ( config.isEnabled( 'me/my-profile' ) ) {
		page( '/me', sidebar, profile );

		// Redirect previous URLs
		page( '/me/profile', profileRedirect );
		page( '/me/public-profile', profileRedirect );
	}

	if ( config.isEnabled( 'me/next-steps' ) ) {
		page( '/me/next/:welcome?', sidebar, nextStepsWelcomeRedirect, nextSteps );
	}

	// Trophies and Find-Friends only exist in Atlas
	// Using a reverse config flag here to try to reflect that
	// If they're "not enabled", then the router should not redirect them, so they will be handled in Atlas
	if ( ! config.isEnabled( 'me/trophies' ) ) {
		page( '/me/trophies', trophiesRedirect );
	}

	if ( ! config.isEnabled( 'me/find-friends' ) ) {
		page( '/me/find-friends', findFriendsRedirect );
	}

	page( '/me/get-apps', sidebar, apps );
}
