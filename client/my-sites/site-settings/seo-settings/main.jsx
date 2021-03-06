/**
 * External dependencies
 */
import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import debugFactory from 'debug';

/**
 * Internal dependencies
 */
import Main from 'components/main';
import notices from 'notices';
import QuerySitePurchases from 'components/data/query-site-purchases';
import { getSitePurchases, hasLoadedSitePurchasesFromServer, getPurchasesError } from 'state/purchases/selectors';
import { getSelectedSiteId } from 'state/ui/selectors';
import SeoForm from './form';
import SiteSettingsNavigation from 'my-sites/site-settings/navigation';
import SidebarNavigation from 'my-sites/sidebar-navigation';

/**
 * Module vars
 */
const debug = debugFactory( 'calypso:my-sites:site-settings' );

export class SeoSettings extends Component {
	constructor( props ) {
		super( props );

		// bound methods
		this.updateSite = this.updateSite.bind( this );

		this.state = {
			site: this.props.sites.getSelectedSite()
		};
	}

	componentWillMount() {
		debug( 'Mounting SiteSettings React component.' );
		this.props.sites.on( 'change', this.updateSite );
	}

	componentWillUnmount() {
		this.props.sites.off( 'change', this.updateSite );
	}

	componentWillReceiveProps( nextProps ) {
		if ( nextProps.purchasesError ) {
			notices.error( nextProps.purchasesError );
		}
	}

	render() {
		const { site } = this.state;
		const { upgradeToBusiness } = this.props;

		return (
			<Main className="site-settings">
				<SidebarNavigation />
				<SiteSettingsNavigation site={ site } section="seo" />
				{ site && <QuerySitePurchases siteId={ site.ID } /> }
				{ site && <SeoForm { ...{ site, upgradeToBusiness } } /> }
			</Main>
		);
	}

	updateSite() {
		this.setState( { site: this.props.sites.getSelectedSite() } );
	}
}

SeoSettings.propTypes = {
	hasLoadedSitePurchasesFromServer: PropTypes.bool.isRequired,
	purchasesError: PropTypes.object,
	section: PropTypes.string,
	sitePurchases: PropTypes.array.isRequired,
	sites: PropTypes.object.isRequired
};

export default connect(
	( state ) => {
		return {
			hasLoadedSitePurchasesFromServer: hasLoadedSitePurchasesFromServer( state ),
			purchasesError: getPurchasesError( state ),
			sitePurchases: getSitePurchases( state, getSelectedSiteId( state ) )
		};
	}
)( SeoSettings );
