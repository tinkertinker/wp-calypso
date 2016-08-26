import { combineReducers } from 'redux';
import {
	HAPPYCHAT_CONNECTING,
	HAPPYCHAT_CONNECTED,
	HAPPYCHAT_SET_MESSAGE,
	HAPPYCHAT_CLOSING,
	HAPPYCHAT_RECEIVE_EVENT,
	HAPPYCHAT_SET_AUTOSCROLL,
	HAPPYCHAT_OPEN,
	HAPPYCHAT_OPEN_URL
} from 'state/action-types';

const debug = require( 'debug' )( 'calypso:happychat:reducer' );

const available = ( state = true ) => state;

const timeline_event = ( state = [], action ) => {
	switch ( action.type ) {
		case HAPPYCHAT_RECEIVE_EVENT:
			const event = action.event;
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
			];
		default:
			return state;
	}
};

const timeline = ( state = [], action ) => {
	switch ( action.type ) {
		case HAPPYCHAT_RECEIVE_EVENT:
			return state.concat( [ timeline_event( action.event, action ) ] );
		default:
			return state;
	}
};

const status = ( state = 'disconnected', action ) => {
	debug( 'status', action );
	switch ( action.type ) {
		case HAPPYCHAT_CONNECTING:
			debug( 'connecting' );
			return 'connecting';
		case HAPPYCHAT_CONNECTED:
			return 'connected';
		case HAPPYCHAT_CLOSING:
			return 'closing';
		default:
			return state;
	}
};

const message = ( state = '', action ) => {
	switch ( action.type ) {
		case HAPPYCHAT_SET_MESSAGE:
			return action.message;
		default:
			return state;
	}
};

const autoscroll = ( state = true, action ) => {
	switch ( action.type ) {
		case HAPPYCHAT_SET_AUTOSCROLL:
			return action.auto;
		default:
			return state;
	}
};

const supportURL = ( state = null, action ) => {
	switch ( action.type ) {
		case HAPPYCHAT_OPEN_URL:
			return action.url;
		default:
			return state;
	}
};

const isOpen = ( state = false, action ) => {
	switch ( action.type ) {
		case HAPPYCHAT_OPEN:
			return action.isOpen !== undefined ? action.isOpen : state;
	}
	return state;
};

export default combineReducers( { timeline, available, status, message, autoscroll, supportURL, isOpen } );
