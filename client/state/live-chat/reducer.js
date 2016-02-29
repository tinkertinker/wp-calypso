import { combineReducers } from 'redux'
import {
	LIVE_CHAT_CONNECTING,
	LIVE_CHAT_CONNECTED,
	LIVE_CHAT_SET_MESSAGE,
	LIVE_CHAT_CLOSING,
	LIVE_CHAT_RECEIVE_EVENT,
	LIVE_CHAT_SET_AUTOSCROLL,
	LIVE_CHAT_OPEN_URL
} from 'state/action-types'

const debug = require( 'debug' )( 'calypso:live-chat:reducer' )

const available = ( state = true ) => state

const timeline_event = ( state = [], action ) => {
	switch ( action.type ) {
		case LIVE_CHAT_RECEIVE_EVENT:
			const event = action.event
			return [
				event.message,
				Object.assign( {}, {
					id: event.id,
					nick: event.user.nick,
					image: event.user.picture,
					user_id: event.user.id,
					type: event.type,
					links: event.links
				} )
			]
		default:
			return state
	}
}

const timeline = ( state = [], action ) => {
	switch ( action.type ) {
		case LIVE_CHAT_RECEIVE_EVENT:
			return state.concat( [ timeline_event( action.event, action ) ] )
		default:
			return state
	}
}

const status = ( state = 'disconnected', action ) => {
	debug( 'status', action )
	switch ( action.type ) {
		case LIVE_CHAT_CONNECTING:
			debug( 'connecting' )
			return 'connecting'
		case LIVE_CHAT_CONNECTED:
			return 'connected'
		case LIVE_CHAT_CLOSING:
			return 'closing'
		default:
			return state
	}
}

const message = ( state = '', action ) => {
	switch ( action.type ) {
		case LIVE_CHAT_SET_MESSAGE:
			return action.message
		default:
			return state
	}
}

const autoscroll = ( state = true, action ) => {
	switch ( action.type ) {
		case LIVE_CHAT_SET_AUTOSCROLL:
			return action.auto
		default:
			return state
	}
}

const supportURL = ( state = null, action ) => {
	switch ( action.type ) {
		case LIVE_CHAT_OPEN_URL:
			return action.url
		default:
			return state
	}
}

export default combineReducers( { timeline, available, status, message, autoscroll, supportURL } )
