const debug = require( 'debug' )( 'calypso:live-chat:actions' )

import buildConnection from 'lib/live-chat/connection'
import throttle from 'lodash/function/throttle'
import { propExists, when } from 'lib/functional'
import {
	LIVE_CHAT_CONNECTING,
	LIVE_CHAT_CONNECTED,
	LIVE_CHAT_SET_MESSAGE,
	LIVE_CHAT_MINIMIZE,
	LIVE_CHAT_CLOSING,
	LIVE_CHAT_RECEIVE_EVENT,
	LIVE_CHAT_SET_AUTOSCROLL
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

export const openChat = ( user ) => ( dispatch ) => {
	dispatch( setChatConnecting() )
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

export const minimizeChat = () => ( { type: LIVE_CHAT_MINIMIZE } )
export const closeChat = () => ( dispatch ) => {
	debug( 'time to close the current chat session' )
	dispatch( setChatClosing() )
}

export const setLiveChatAutoScroll = ( auto ) => ( { type: LIVE_CHAT_SET_AUTOSCROLL, auto } )
