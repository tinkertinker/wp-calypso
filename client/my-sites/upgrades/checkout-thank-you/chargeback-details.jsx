/**
 * External dependencies
 */
import React from 'react';

/**
 * Internal dependencies
 */
import i18n from 'lib/mixins/i18n';
import paths from 'lib/paths';
import PurchaseDetail from 'components/purchase-detail';

const ChargebackDetails = ( { selectedSite } ) => {
	return (
		<PurchaseDetail
			icon="create"
			title={ i18n.translate( 'Get back to posting' ) }
			description={ i18n.translate( 'You can now use the full features of your site, without limits.' ) }
			buttonText={ i18n.translate( 'Write a Post' ) }
			href={ paths.newPost( selectedSite ) } />
	);
};

ChargebackDetails.propTypes = {
	selectedSite: React.PropTypes.object.isRequired
};

export default ChargebackDetails;
