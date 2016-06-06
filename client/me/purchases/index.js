/**
 * External Dependencies
 */
import page from 'page';

/**
 * Internal Dependencies
 */
import { sidebar } from 'me/controller';
import {
	noSitesMessage,
	cancelPurchase,
	cancelPrivateRegistration,
	confirmCancelDomain,
	editCardDetails,
	list,
	listNotice,
	managePurchase
} from './controller';
import paths from './paths';

export default function() {
	page(
		paths.cancelPurchase(),
		sidebar,
		noSitesMessage,
		cancelPurchase
	);

	page(
		paths.cancelPrivateRegistration(),
		sidebar,
		noSitesMessage,
		cancelPrivateRegistration
	);

	page(
		paths.confirmCancelDomain(),
		sidebar,
		noSitesMessage,
		confirmCancelDomain
	);

	page(
		paths.editCardDetails(),
		sidebar,
		noSitesMessage,
		editCardDetails
	);

	page(
		paths.list(),
		sidebar,
		noSitesMessage,
		list
	);

	page(
		paths.listNotice(),
		listNotice
	);

	page(
		paths.managePurchase(),
		sidebar,
		noSitesMessage,
		managePurchase
	);
}
