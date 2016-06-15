const debug = require( 'debug' )( 'calypso:live-chat:actions' );

import wpcom from 'lib/wp';
import buildConnection from 'lib/live-chat/connection';
import { throttle } from 'lodash/function';
import { propExists, when } from 'lib/functional';
import {
	LIVE_CHAT_CONNECTING,
	LIVE_CHAT_CONNECTED,
	LIVE_CHAT_SET_MESSAGE,
	LIVE_CHAT_CLOSING,
	LIVE_CHAT_RECEIVE_EVENT,
	LIVE_CHAT_SET_AUTOSCROLL,
	LIVE_CHAT_OPEN_URL,
	LIVE_CHAT_OPEN
} from 'state/action-types';

const request = ( ... args ) => new Promise( ( resolve, reject ) => {
	wpcom.request( ... args, ( error, response ) => {
		if ( error ) return reject( error );
		resolve( response );
	} );
} );

const sign = ( payload ) => request( { method: 'POST', path: '/jwt/sign', body: { payload: JSON.stringify( payload ) } } );

const connection = buildConnection();

const setChatConnecting = () => ( { type: LIVE_CHAT_CONNECTING } );
const setChatConnected = () => ( { type: LIVE_CHAT_CONNECTED } );
const setChatClosing = () => ( { type: LIVE_CHAT_CLOSING } );
const setChatMessage = message => ( { type: LIVE_CHAT_SET_MESSAGE, message } );

const clearChatMessage = () => setChatMessage( '' );

const receiveChatEvent = event => ( { type: LIVE_CHAT_RECEIVE_EVENT, event } );

const setChatOpen = isOpen => ( { type: LIVE_CHAT_OPEN, isOpen } );

export const connectChat = () => ( dispatch, getState ) => {
	const { users, currentUser } = getState();
	const { id: user_id } = currentUser;
	const user = users.items[ user_id ];
	dispatch( setChatConnecting() );
	// get signed identity data for authenticating
	debug( 'requesting' );
	sign( { user } ).then( ( { jwt } ) => {
		connection.open( user_id, jwt ).then( () => {
			dispatch( setChatConnected() );
			connection.on( 'event', ( event ) => dispatch( receiveChatEvent( event ) ) );
		} );
	} )
	.catch( ( e ) => {
		// TODO: notify of failure in UI?
		debug( 'failed', e );
	} );
};

export const openChat = () => dispatch => {
	dispatch( setChatOpen( true ) );
};

const throttleTyping = when( propExists( 'message' ), throttle( ( { message } ) => {
	debug( 'send typing indicator' );
	connection.typing( message );
}, 1000, { leading: true, trailing: false } ) );

export const updateChatMessage = message => dispatch => {
	dispatch( setChatMessage( message ) );
	// TODO: send a typing indicator?
	throttleTyping( { message } );
};

export const sendChatMessage = message => dispatch => {
	debug( 'sending message', message );
	dispatch( clearChatMessage() );
	connection.send( message );
};

export const closeChat = () => ( dispatch ) => {
	debug( 'time to close the current chat session' );
	dispatch( setChatOpen( false ) );
	dispatch( setChatClosing() );
};

export const setLiveChatAutoScroll = auto => ( { type: LIVE_CHAT_SET_AUTOSCROLL, auto } );

export const openChatURL = url => ( { type: LIVE_CHAT_OPEN_URL, url } );
