import { get } from 'lodash/object'
import { isFunction } from 'lodash/lang'

export const pure = ( value ) => () => value

/*
 * Returns a function that checks for props that have a truthy `propkey` (uses lodash/object/get
 * to check for key). Example:
 *
 * const nameExists = propExists( 'name' )
 * nameExists( { name: 'Gabrielle' } ) // => true
 * nameExists( { name: true } ) // true
 * nameExists( {} ) // false
 * nameExists() // false
 */
export const propExists = ( propKey ) => ( props ) => get( props, propKey )

/*
 * Returns a function that returns true if `propKey` of props is equal to `propValue` (uses ===).
 *
 * const userNameIsSam = propEquals( 'user.name', 'Sam' )
 * const userNameIsSam( { user: { name: 'Sam' } } ) // => true
 * const userNameIsSam( { user: { name: 'Frodo' } } ) // => false
 * const userNameIsSam() // => false
 */
export const propEquals = ( propKey, propValue ) => ( props ) => get( props, propKey ) === propValue

/*
 * Returns a function that calls condition and checks for truthiness and calls `ifTrue`, other wise calls
 * `ifFalse` which defaults to a function that returns `null`. Example:
 *
 * const logRealNumbers = when(
 *		( msg ) => /^[\d]+$/.test( msg ),
 *		console.log.bind( console, 'is a real number' ),
 *		console.log.bind( console, 'is not a real number' )
 * )
 *
 * logRealNumbers( 5.1 ) // => 5.1 'is not a real number'
 * logReslNumbers( 5 ) // => 5 'is a real number'
 */
export const when = ( condition, ifTrue, ifFalse = () => null ) => ( ... args ) => (
	condition( ... args ) ? ifTrue( ... args ) : ifFalse( ... args )
)

/*
 * Returns the result of the first function to return a truthy value
 */

export const first = ( ... fns ) => ( ... args ) => {
	var i, result
	for ( i = 0; i < fns.length; i++ ) {
		result = fns[i]( ... args )
		if ( result ) return result
	}
}

/*
 * Returns a function that returns true if any of the provided `fns` return a truthy value. Example:
 *
 * const oddOrLessThan10 = any(
 *		( n ) => n % 2 === 1,
 *		( n ) => n < 10
 * )
 *
 * oddOrLessThan10( 15 ) // => true
 * oddOrLessThan10( 8 ) // => true
 * oddOrLessThan10( 12 ) // => false
 */
export const any = ( ... fns ) => ( ... args ) => fns.find( ( fn ) => fn( ... args ) )

/*
 * Returns a function that returns true when all provided functions return a truthy value. Example:
 *
 * const lessThan10AndGreaterThan4AndEven = all(
 *		( n ) => n < 10,
 *		( n ) => n > 4,
 *		( n ) => n % 2 === 0
 * )
 * lessThan10AndGreaterThan2AndEven( 7 ) // => false
 * lessThan10AndGreaterThan2AndEven( 8 ) // => true
 * lessThan10AndGreaterThan2AndEven( 2 ) // => false
 */
export const all = ( ... fns ) => ( ... args ) => !fns.find( ( fn ) => !fn( ... args ) )

/*
 * Returns a function that iterates through each function and calls it. Example:
 *
 *	const log = console.log.bind( console )
 *	const maths = each(
 *		( n ) => log( '*2', n * 2),
 *		( n ) => log( '+2', n + 2 )
 *	)
 *
 *  maths( 3 )
 *  // => '*2', 6
 *  // => '+2', 5
 */
export const each = ( ... fns ) => ( ... args ) => fns.forEach( ( fn ) => fn( ... args ) )

export const actionDispatcher = ( action ) => ( mapArgs = ( ... args ) => [ args ] ) => ( dispatch ) => ( ... args ) => {
	return dispatch( action( mapArgs( ... args ) ) )
}

/*
 * Executes provided function ( `fn` ) `count` times. Example:
 *
 *	const log5 = times( console.log.bind( log, 'hello' ), 5 )
 *	log5() // => 'hello', 'hello', 'hello', 'hello', 'hello'
 */
export const times = ( count, fn ) => ( ... args ) => {
	let results = []
	var i
	for ( i = 0; i < count; i ++ ) {
		results = results.concat( fn( ... args ) )
	}
	return results
}

/*
 * Returns a function that will call the wrapped `fn` every `count` times the function is called.
 *
 * Example:
 *	const log = everyCount( 3, console.log.bind( console, 'hello' ) )
 *  // first and second `log` call, nothing logged
 *  log()
 *  log()
 *  // third log call logs the message
 *  log() // => 'hello'
 *  // fourth and fifth, nothing called, then sixth logs ( etc. )
 *  log(); log(); log(); // => 'hello'
 */
export const everyCount = ( count, fn ) => {
	let current = 1
	return ( ... args ) => {
		if ( current % count === 0 ) fn( ... args )
		current ++
	}
}

/*
 * Given a logger or tag, returns a function that wraps a function and logs the
 * arguments and return value of the wrapped function.
 *
 * Example:
 *
 * 	const debug = require( 'debugger' )( 'my:tag' )
 * 	const hello = ( name ) => `hello ${ name }`
 * 	const logger = log( debug )
 * 	const debugHello = logger( hello )
 *
 * 	debugHello( 'Janelle' )
 *
 * Will result in a console debug message of:
 * => 'my:tag', 'input': [ 'Janelle' ], 'output', 'hello Janelle'
 */
export const log = ( tag ) => {
	const d = isFunction( tag ) ? tag : console.log.bind( console, tag )
	return ( msg, fn ) => ( ... args ) => {
		const result = fn( ... args )
		d( msg, 'input', args, 'output', result )
		return result
	}
}
