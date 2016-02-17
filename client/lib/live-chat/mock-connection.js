const debug = require( 'debug' )( 'calypso:live-chat:mock' )
import { EventEmitter } from 'events'
import { v4 as uuid } from 'uuid'
import { any, times, everyCount } from 'lib/functional'

const alternate = ( ... options ) => () => {
	const [ current, ... rest ] = options
	options = rest.concat( current )
	return current
}

const createMessage = alternate(
	'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
	'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut',
	'aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
	'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
)

const matches = ( regexp, map = ( { message } ) => message ) => ( fn ) => ( ... args ) => {
	const results = regexp.exec( map( ... args ) )
	if ( results ) {
		debug( 'found', results )
		fn( ... args.concat( [results] ) )
		return true
	}
}

const delay = ( ms, fn ) => ( ... args ) => setTimeout( () => fn( ...args ), ms )
const delayedMatch = ( regex, fn, ms = 1000 ) => matches( regex )( delay( ms, fn ) )

const cheekyHelp = delayedMatch( /\bhelp\b/, ( { connection } ) => fakeMessage( { connection, message: 'Did you try turning it off and on again?' } ) )
const replyWithCount = delayedMatch( /^reply with ([\d])/i, ( { connection }, results ) => times( parseInt( results[1] ), () => fakeMessage( { connection } ) )() )
const getMeCoffee = delayedMatch( /\bcoffee\b/i, ( { connection } ) => fakeMessage( { connection, message: 'I could really use a cup of coffee' } ) )
const reply = delayedMatch( /\breply\b/i, ( { connection } ) => setTimeout( () => fakeMessage( { connection } ) ) )
const dontKnow = everyCount( 5, delay( 1000, ( { connection } ) => fakeMessage( { connection, message: 'I have no clue what you\'re talking about' } ) ) )
const hello = delayedMatch( /^hello$/i, ( { connection } ) => {
	[ 'Hello', 'It\'s me', 'I was wondering if after all this time you\'d like to meet ...', 'to go over', 'ev-er-y-thing' ].forEach( ( message, i ) => {
		setTimeout( () => fakeMessage( { connection, message } ), i * 2000 + 400 )
	} )
} )

const detectors = any(
	replyWithCount,
	cheekyHelp,
	getMeCoffee,
	reply,
	hello
)

export class MockConnection extends EventEmitter {

	open( user ) {
		this.user = user
		return new Promise( ( resolve ) => setTimeout( resolve, 500 ) )
	}

	send( message ) {
		setTimeout( () => this.emitMessage( message ), 10 )
		detectors( { message, connection: this } )
	}

	emitMessage( message ) {
		this.emit( 'event', {
			id: uuid(),
			type: 'message',
			message: message,
			user: {
				// TODO: get current user's details
				nick: this.user.display_name,
				picture: this.user.avatar_URL,
				id: this.user.ID
			}
		} )
	}

}

export function fakeMessage( { connection, message } ) {
	connection.emit( 'event', {
		id: uuid(),
		type: 'message',
		message: message || createMessage(),
		user: { nick: 'Smeagol', picture: 'https://cldup.com/3yiF9JyZr0.jpeg', id: 12345 }
	} )
}

export default () => new MockConnection()

export { detectors as bot }
