/**
 * External dependencies
 */
import React from 'react';
import { localize } from 'i18n-calypso';
import { connect } from 'react-redux';

/**
 * Internal dependencies
 */
import Gridicon from 'components/gridicon';
import Button from 'components/button';
import { openChat } from 'state/live-chat/actions';

const SidebarFooter = ( { translate, children, onOpenChat } ) => (
	<div className="sidebar__footer">
		{ children }
		<Button compact borderless href="/help" onClick={ onOpenChat }>
			<Gridicon icon="help-outline" /> { translate( 'Help' ) }
		</Button>
	</div>
);

const mapStateToProps = () => {
	return {};
};

const mapDispatchToProps = ( dispatch ) => {
	return {
		onOpenChat() {
			dispatch( openChat() );
		}
	};
};

export default connect( mapStateToProps, mapDispatchToProps )( localize( SidebarFooter ) );
