const debug = require( 'debug' )( 'calypso:live-chat:connection' )

import IO from 'socket.io-client'
import { EventEmitter } from 'events'
import { pick, mapKeys, get } from 'lodash/object'
import { bot } from './mock-connection'
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

class Connection extends EventEmitter {

	connect( user ) {
		if ( this.socket ) return new Promise( ( resolve ) => resolve() )
		return new Promise( ( resolve ) => {
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

	open( user ) {
		debug( 'open connection for user', user, config( 'live_chat_server_url' ) )

		return this.connect( user ).then( ( socket ) => new Promise( ( resolve ) => {
			debug( 'connected', socket )
			resolve()
		} ) )
	}

	send( message ) {
		return new Promise( ( resolve, reject ) => {
			bot( { message, connection: this } )
			if ( !this.socket ) return reject( new Error( 'socket not connected' ) )
			debug( 'emit message', message )
			this.socket.emit( 'action', { message, type: 'message' }, resolve )
		} )
	}

}

export default () => new Connection()
