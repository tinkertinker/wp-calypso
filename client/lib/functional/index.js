import { get } from 'lodash/object'
import { isFunction } from 'lodash/lang'
import debug from 'debug'

export const log = ( tag ) => {
	const d = isFunction( tag ) ? tag : debug( tag )
	return ( msg, fn ) => ( ... args ) => {
		d( msg, args )
		return fn( ... args )
	}
}

export const pure = ( value ) => () => value
export const propExists = ( propKey ) => ( props ) => get( props, propKey )
export const propEquals = ( propKey, propValue ) => ( props ) => get( props, propKey ) === propValue

export const when = ( condition, ifTrue, ifFalse = () => false ) => ( ... args ) => (
	condition( ... args ) ? ifTrue( ... args ) : ifFalse( ... args )
)
export const any = ( ... fns ) => ( ... args ) => fns.find( ( fn ) => fn( ... args ) )
export const all = ( ... fns ) => ( ... args ) => !fns.find( ( fn ) => !fn( ... args ) )

export const first = ( ... fns ) => ( ... args ) => {
	var i = 0, result
	for ( i = 0; i < fns.length; i++ ) {
		result = fns[i]( ... args )
		if ( result ) {
			return result
		}
	}
}

export const each = ( ... fns ) => ( ... args ) => fns.forEach( ( fn ) => fn( ... args ) )

export const actionDispatcher = ( action ) => ( mapArgs = ( ... args ) => [ args ] ) => ( dispatch ) => ( ... args ) => {
	return dispatch( action( mapArgs( ... args ) ) )
}

export const times = ( count, fn ) => ( ... args ) => {
	let results = []
	var i
	for ( i = 0; i < count; i ++ ) {
		results = results.concat( fn( ... args ) )
	}
	return results
}

export const everyCount = ( count, fn ) => {
	let current = 1
	return ( ... args ) => {
		if ( current % count === 0 ) fn( ... args )
		current ++
	}
}
