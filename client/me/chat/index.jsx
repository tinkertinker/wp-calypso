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
import LiveChat from 'components/live-chat/page';

const debug = require( 'debug' )( 'calypso:live-chat:section' );

const renderChat = ( context, next ) => {
	renderWithReduxStore(
		<LiveChat />,
		document.getElementById( 'primary' ),
		context.store
	);
	next();
};

export default () => {
	page( '/me/chat', sidebar, renderChat );
};
