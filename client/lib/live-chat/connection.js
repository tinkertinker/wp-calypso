import IO from 'socket.io-client';
import { EventEmitter } from 'events';
import { pick, mapKeys, get, assign } from 'lodash/object';
import config from 'config';
import { v4 as uuid } from 'uuid';

const debug = require( 'debug' )( 'calypso:live-chat:connection' );

const USER_KEY_MAP = {
	avatar_URL: 'picture',
	ID: 'id',
	display_name: 'name'
};

const mapWPComUserKeys = ( value, key ) => get( USER_KEY_MAP, key, key );

const emitMessage = ( connection ) => ( { id, text, timestamp, user } ) => {
	debug( 'received message', text );
	connection.emit( 'event', { id, type: 'message', timestamp, message: text, user: {
		nick: user.displayName,
		picture: user.avatarURL,
		id: user.id
	} } );
};


const p = ( ... args ) => new Promise( ... args );

class Connection extends EventEmitter {

	connect( user ) {
		if ( this.socket ) {
			return p( ( resolve ) => resolve() );
		}
		return p( ( resolve ) => {
			const socket = this.socket = new IO( config( 'live_chat_server_url' ) );
			socket
				.once( 'connect', () => resolve( socket ) )
				.on( 'init', ( ... args ) => debug( 'initialized', ... args ) )
				.on( 'identify', () => socket.emit( 'user',
					mapKeys( pick( user, [ 'ID', 'avatar_URL', 'display_name', 'username' ] ), mapWPComUserKeys )
				) )
				.on( 'token', ( handler ) => handler( user ) )
				.on( 'message', emitMessage( this ) );
		} );
	}

	getSocket() {
		return p( ( resolve, reject ) => {
			if ( !this.socket ) return reject( new Error( 'not connected' ) );
			resolve( this.socket );
		} );
	}

	open( user ) {
		debug( 'open connection for user', user, config( 'live_chat_server_url' ) );

		return this.connect( user ).then( ( socket ) => p( ( resolve ) => {
			debug( 'connected', socket );
			resolve();
		} ) );
	}

	typing( message ) {
		this.getSocket()
		.then( ( socket ) => socket.emit( 'typing', { message } ) )
		.catch( debug );
	}

	send( message ) {
		this.getSocket()
		.then( ( socket ) => new Promise( ( resolve ) => {
			const id = uuid();
			socket.emit( 'action', { message, type: 'message', id }, resolve );
			socket.emit( 'message', { text: message, id }, resolve );
		} ) );
	}

}

export default () => new Connection();
