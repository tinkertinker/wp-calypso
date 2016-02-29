/**
 * External dependencies
 */
import { expect } from 'chai';
import { fromJS } from 'immutable';
import deepFreeze from 'deep-freeze';

/**
 * Internal dependencies
 */
import {
	SERIALIZE,
	DESERIALIZE,
	SERVER_DESERIALIZE
} from 'state/action-types';
import reducer, { initialState } from '../reducer';

describe( 'current-theme reducer', () => {
	describe( 'persistence', () => {
		it( 'persists state and converts to a plain JS object', () => {
			const jsObject = deepFreeze( {
				isActivating: true,
				hasActivated: false,
				currentThemes: {
					123456: {
						name: 'my test theme',
						id: 'testtheme',
						cost: {
							currency: 'USD',
							number: 0,
							display: ''
						}
					}
				}
			} );
			const state = fromJS( jsObject );
			const persistedState = reducer( state, { type: SERIALIZE } );
			expect( persistedState ).to.eql( jsObject );
		} );
		it( 'loads valid persisted state and converts to immutable.js object', () => {
			const jsObject = deepFreeze( {
				isActivating: true,
				hasActivated: false,
				currentThemes: {
					123456: {
						name: 'my test theme',
						id: 'testtheme',
						cost: {
							currency: 'USD',
							number: 0,
							display: ''
						}
					}
				}
			} );
			const state = reducer( jsObject, { type: DESERIALIZE } );
			expect( state ).to.eql( fromJS( jsObject ) );
		} );

		it( 'converts initial state from server to immutable.js object', () => {
			const jsObject = deepFreeze( {
				isActivating: true,
				hasActivated: false,
				currentThemes: {
					123456: {
						name: 'my test theme',
						id: 'testtheme',
						cost: {
							currency: 'USD',
							number: 0,
							display: ''
						}
					}
				}
			} );
			const state = reducer( jsObject, { type: SERVER_DESERIALIZE } );
			expect( state ).to.eql( fromJS( jsObject ) );
		} );

		it.skip( 'should ignore loading data with invalid keys ', () => {
			const jsObject = deepFreeze( {
				missingKey: true,
				hasActivated: false,
				currentThemes: {
					foo: {
						name: 'my test theme',
						id: 'testtheme',
						cost: {
							currency: 'USD',
							number: 0,
							display: ''
						}
					}
				}
			} );
			const state = reducer( jsObject, { type: DESERIALIZE } );
			expect( state ).to.eql( initialState );
		} );

		it.skip( 'should ignore loading data with invalid values ', () => {
			const jsObject = deepFreeze( {
				isActivating: true,
				hasActivated: 'foo',
				currentThemes: {
					123456: {
						name: 'my test theme',
						id: 'testtheme',
						cost: {
							currency: 'USD',
							number: 0,
							display: ''
						}
					}
				}
			} );
			const state = reducer( jsObject, { type: DESERIALIZE } );
			expect( state ).to.eql( initialState );
		} );
	} );
} );
