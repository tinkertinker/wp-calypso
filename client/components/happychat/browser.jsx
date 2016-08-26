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
import { openChatURL } from 'state/happychat/actions';
import GridIcon from 'components/gridicon';

const Browser = ( { url, closeBrowser } ) => (
	<div className={ classnames( 'happychat__support-browser', { disabled: isEmpty( url ) } ) }>
		<div className="happychat__browser-bar">
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

const mapState = ( { happychat: { supportURL: url } } ) => ( { url } );

export default connect( mapState, mapDispatch )( Browser );
