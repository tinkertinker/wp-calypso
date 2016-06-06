/*
	External Deps
*/
import React from 'react';
import page from 'page';

/*
	Internal deps
*/
import { renderWithReduxStore } from 'lib/react-helpers';
import { sidebar } from 'me/controller';

const debug = require( 'debug' )( 'calypso:live-chat:section' );

const Chat = React.createClass( {
	render() {
		return <div>Hi</div>;
	}
} );

export default () => {
	page( '/me/chat', sidebar, ( context, next ) => {
		renderWithReduxStore(
			<Chat context={ context } />,
			document.getElementById( 'primary' ),
			context.store
		);
		next();
	} );
};
