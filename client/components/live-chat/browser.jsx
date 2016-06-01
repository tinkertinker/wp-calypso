/*
 * External dependencies
 */
import React from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import isEmpty from 'lodash/isEmpty';

/*
 * Internal dependencies
 */
import { openChatURL } from 'state/live-chat/actions';
import GridIcon from 'components/gridicon';

const Browser = ( { url, closeBrowser } ) => (
	<div className={ classnames( 'support-browser', { disabled: isEmpty( url ) } ) }>
		<div className="browser-bar">
			{ url }
			<div onClick={ closeBrowser }><GridIcon icon="cross" /></div>
		</div>
		<iframe src={ url } />
	</div>
);

const mapDispatch = ( dispatch ) => ( {
	closeBrowser() {
		dispatch( openChatURL( null ) );
	}
} );

const mapState = ( { liveChat: { supportURL: url } } ) => ( { url } );

export default connect( mapState, mapDispatch )( Browser );
