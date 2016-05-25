const debug = require( 'debug' )( 'calypso:live-chat:actions' )

import buildConnection from 'lib/live-chat/connection'
import { throttle } from 'lodash/function'
import { propExists, when } from 'lib/functional'
import {
	LIVE_CHAT_CONNECTING,
	LIVE_CHAT_CONNECTED,
	LIVE_CHAT_SET_MESSAGE,
	LIVE_CHAT_CLOSING,
	LIVE_CHAT_RECEIVE_EVENT,
	LIVE_CHAT_SET_AUTOSCROLL,
	LIVE_CHAT_OPEN_URL,
	LIVE_CHAT_OPEN
} from 'state/action-types'

export const checkAvailability = () => () => {
	debug( 'check for availability' )
}

const connection = buildConnection()

const setChatConnecting = () => {
	const action = { type: LIVE_CHAT_CONNECTING }
	debug( 'setChatConnecting', action )
	return action
}

const setChatConnected = () => ( { type: LIVE_CHAT_CONNECTED } )
const setChatClosing = () => ( { type: LIVE_CHAT_CLOSING } )
const setChatMessage = ( message ) => ( { type: LIVE_CHAT_SET_MESSAGE, message } )

const clearChatMessage = () => setChatMessage( '' )

const receiveChatEvent = ( event ) => ( { type: LIVE_CHAT_RECEIVE_EVENT, event } )

const setChatOpen = ( isOpen ) => {
	return { type: LIVE_CHAT_OPEN, isOpen }
}

export const openChat = () => ( dispatch, getState ) => {
	const { users, currentUser } = getState();
	const user = users.items[currentUser.id];

	dispatch( setChatConnecting() )
	dispatch( setChatOpen( true ) )
	debug( 'connecting, now attempt to connect' )
	connection.open( user ).then( () => {
		debug( 'connected' )
		dispatch( setChatConnected() )
		connection.on( 'event', ( event ) => dispatch( receiveChatEvent( event ) ) )
	} )
}

const throttleTyping = when( propExists( 'message' ), throttle( ( { message } ) => {
	debug( 'send typing indicator' )
	connection.typing( message )
}, 1000, { leading: true, trailing: false } ) )

export const updateChatMessage = ( message ) => ( dispatch ) => {
	dispatch( setChatMessage( message ) )
	// TODO: send a typing indicator?
	throttleTyping( { message } )
}

export const sendChatMessage = ( message ) => ( dispatch ) => {
	debug( 'sending message', message )
	dispatch( clearChatMessage() )
	connection.send( message )
}

export const closeChat = () => ( dispatch ) => {
	debug( 'time to close the current chat session' )
	dispatch( setChatOpen( false ) )
	dispatch( setChatClosing() )
}

export const setLiveChatAutoScroll = ( auto ) => ( { type: LIVE_CHAT_SET_AUTOSCROLL, auto } )

export const openChatURL = ( url ) => ( { type: LIVE_CHAT_OPEN_URL, url } )
