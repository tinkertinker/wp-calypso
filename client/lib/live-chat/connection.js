const debug = require( 'debug' )( 'calypso:live-chat:connection' )

import IO from 'socket.io-client'
import { EventEmitter } from 'events'
import { pick, mapKeys, get } from 'lodash/object'
import config from 'config'

const USER_KEY_MAP = {
	avatar_URL: 'picture',
	ID: 'id',
	display_name: 'name'
}

const mapWPComUserKeys = ( value, key ) => get( USER_KEY_MAP, key, key )

const emitActionMessage = ( connection ) => ( { id, type, user, message, timestamp } ) => {
	debug( 'received socket action', { id, type } )
	connection.emit( 'event', { id, type, user: {
		nick: user.name,
		picture: user.picture,
		id: user.id
	}, timestamp, message } )
}

const p = ( ... args ) => new Promise( ... args )

class Connection extends EventEmitter {

	connect( user ) {
		if ( this.socket ) return p( ( resolve ) => resolve() )
		return p( ( resolve ) => {
			const socket = this.socket = new IO( config( 'live_chat_server_url' ) )
			socket
				.once( 'connect', () => resolve( socket ) )
				.on( 'init', ( ... args ) => debug( 'initialized', ... args ) )
				.on( 'identify', () => socket.emit( 'user',
					mapKeys( pick( user, [ 'ID', 'avatar_URL', 'display_name', 'username' ] ), mapWPComUserKeys )
				) )
				.on( 'action', emitActionMessage( this ) )
		} )
	}

	getSocket() {
		return p( ( resolve, reject ) => {
			if ( !this.socket ) return reject( new Error( 'not connected' ) )
			resolve( this.socket )
		} )
	}

	open( user ) {
		debug( 'open connection for user', user, config( 'live_chat_server_url' ) )

		return this.connect( user ).then( ( socket ) => p( ( resolve ) => {
			debug( 'connected', socket )
			resolve()
		} ) )
	}

	typing( message ) {
		this.getSocket()
		.then( ( socket ) => socket.emit( 'typing', { message } ) )
		.catch( debug )
	}

	send( message ) {
		this.getSocket()
		.then( ( socket ) => new Promise( ( resolve ) => {
			socket.emit( 'action', { message, type: 'message' }, resolve )
		} ) )
	}

}

export default () => new Connection()
