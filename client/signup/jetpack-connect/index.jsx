import React from 'react';

import Card from 'components/card';
import ConnectHeader from './connect-header';
import Dialog from 'components/dialog';
import LoggedOutFormLinks from 'components/logged-out-form/links';
import LoggedOutFormLinkItem from 'components/logged-out-form/link-item';
import Main from 'components/main';
import JetpackConnectNotices from './jetpack-connect-notices';
import SiteURLInput from './site-url-input';

const pluginURL = '/wp-admin/plugin-install.php?tab=plugin-information&plugin=jetpack';

export default React.createClass( {
	displayName: 'JetpackConnectSiteURLStep',

	getInitialState() {
		return {
			showDialog: false,
			siteStatus: false
		};
	},

	onCloseDialog() {
		this.setState( { showDialog: false } );
	},

	onShowDialog() {
		this.setState( { showDialog: true } );
	},

	goToPluginInstall() {
		window.location = 'http://' + this.refs.siteUrlInputRef.state.value + pluginURL;
	},

	onURLEnter() {
		const stepToShow = Math.floor( ( Math.random() * 5 ) + 1 );

		if ( stepToShow === 1 ) {
			this.setState( { siteStatus: 'notExist' } );
		} else if ( stepToShow === 2 ) {
			this.setState( {
				siteStatus: 'jetpackNotInstalled',
				showDialog: true
			} );
		} else if ( stepToShow === 3 ) {
			this.setState( { siteStatus: 'jetpackIsDeactivated' } );
		} else if ( stepToShow === 4 ) {
			this.setState( { siteStatus: 'jetpackIsDisconnected' } );
		} else if ( stepToShow === 5 ) {
			this.setState( { siteStatus: 'jetpackIsValid' } );
		}
	},

	onDismissClick() {
		this.setState( {
			siteStatus: false
		} );
	},

	getDialogButtons() {
		return [ {
			action: 'cancel',
			label: this.translate( 'Cancel' )
		}, {
			action: 'install',
			label: this.translate( 'Connect Now' ),
			onClick: this.goToPluginInstall,
			isPrimary: true
		} ];
	},

	renderDialog() {
		if ( this.state.showDialog ) {
			return (
				<Dialog
					isVisible={ true }
					onClose={ this.onCloseDialog }
					additionalClassNames="jetpack-connect__wp-admin-dialog"
					buttons={ this.getDialogButtons() } >

					<h1>{ this.translate( 'Hold on there, Sparky.' ) }</h1>
					<img className="jetpack-connect__install-wp-admin"
						src="/calypso/images/jetpack/install-wp-admin.svg"
						width={ 400 }
						height={ 294 } />
					<p>{ this.translate( 'We need to send you to your WordPress install so you can approve the Jetpack installation. Click the button in the bottom-right corner on the next screen to continue.' ) }</p>
				</Dialog>
			);
		};
	},

	render() {
		return (
			<Main className="jetpack-connect">
				{ this.renderDialog() }

				<div className="jetpack-connect__site-url-entry-container">
					<ConnectHeader headerText={ this.translate( 'Connect a self-hosted WordPress' ) }
						subHeaderText={ this.translate( 'We\'ll be installing the Jetpack plugin so WordPress.com can connect to your self-hosted WordPress site.' ) }
						step={ 1 }
						steps={ 3 } />

					<Card className="jetpack-connect__site-url-input-container">
						{ this.state.siteStatus
							? <JetpackConnectNotices noticeType={ this.state.siteStatus } onDismissClick={ this.onDismissClick } />
							: null
						}

						<SiteURLInput ref="siteUrlInputRef"
							onClick={ this.onURLEnter }
							onDismissClick={ this.onDismissClick }
							isError={ this.state.isError } />
					</Card>

					<LoggedOutFormLinks>
						<LoggedOutFormLinkItem href="http://jetpack.com">{ this.translate( 'Install Jetpack Manually' ) }</LoggedOutFormLinkItem>
						<LoggedOutFormLinkItem href="/start">{ this.translate( 'Start a new site on WordPress.com' ) }</LoggedOutFormLinkItem>
					</LoggedOutFormLinks>
				</div>
			</Main>
		);
	}
} );
