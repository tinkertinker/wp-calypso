/**
 * External dependencies
 */
import { expect } from 'chai';
import deepFreeze from 'deep-freeze';
import sinon from 'sinon';

/**
 * Internal dependencies
 */
import {
	POST_REQUEST,
	POST_REQUEST_SUCCESS,
	POST_REQUEST_FAILURE,
	POSTS_RECEIVE,
	POSTS_REQUEST,
	POSTS_REQUEST_FAILURE,
	POSTS_REQUEST_SUCCESS,
	SERIALIZE,
	DESERIALIZE
} from 'state/action-types';
import {
	items,
	queryRequests,
	queries,
	queriesLastPage,
	siteRequests
} from '../reducer';

describe( 'reducer', () => {
	before( () => {
		sinon.stub( console, 'warn' );
	} );

	after( () => {
		console.warn.restore();
	} );

	describe( '#items()', () => {
		it( 'should default to an empty object', () => {
			const state = items( undefined, {} );

			expect( state ).to.eql( {} );
		} );

		it( 'should index posts by global ID', () => {
			const state = items( null, {
				type: POSTS_RECEIVE,
				posts: [
					{ ID: 841, site_ID: 2916284, global_ID: '3d097cb7c5473c169bba0eb8e3c6cb64', title: 'Hello World' },
					{ ID: 413, site_ID: 2916284, global_ID: '6c831c187ffef321eb43a67761a525a3', title: 'Ribs & Chicken' }
				]
			} );

			expect( state ).to.eql( {
				'3d097cb7c5473c169bba0eb8e3c6cb64': { ID: 841, site_ID: 2916284, global_ID: '3d097cb7c5473c169bba0eb8e3c6cb64', title: 'Hello World' },
				'6c831c187ffef321eb43a67761a525a3': { ID: 413, site_ID: 2916284, global_ID: '6c831c187ffef321eb43a67761a525a3', title: 'Ribs & Chicken' }
			} );
		} );

		it( 'should accumulate posts', () => {
			const original = deepFreeze( {
				'3d097cb7c5473c169bba0eb8e3c6cb64': { ID: 841, site_ID: 2916284, global_ID: '3d097cb7c5473c169bba0eb8e3c6cb64', title: 'Hello World' }
			} );
			const state = items( original, {
				type: POSTS_RECEIVE,
				posts: [ { ID: 413, site_ID: 2916284, global_ID: '6c831c187ffef321eb43a67761a525a3', title: 'Ribs & Chicken' } ]
			} );

			expect( state ).to.eql( {
				'3d097cb7c5473c169bba0eb8e3c6cb64': { ID: 841, site_ID: 2916284, global_ID: '3d097cb7c5473c169bba0eb8e3c6cb64', title: 'Hello World' },
				'6c831c187ffef321eb43a67761a525a3': { ID: 413, site_ID: 2916284, global_ID: '6c831c187ffef321eb43a67761a525a3', title: 'Ribs & Chicken' }
			} );
		} );

		it( 'should override previous post of same ID', () => {
			const original = deepFreeze( {
				'3d097cb7c5473c169bba0eb8e3c6cb64': { ID: 841, site_ID: 2916284, global_ID: '3d097cb7c5473c169bba0eb8e3c6cb64', title: 'Hello World' }
			} );
			const state = items( original, {
				type: POSTS_RECEIVE,
				posts: [ { ID: 841, site_ID: 2916284, global_ID: '3d097cb7c5473c169bba0eb8e3c6cb64', title: 'Ribs & Chicken' } ]
			} );

			expect( state ).to.eql( {
				'3d097cb7c5473c169bba0eb8e3c6cb64': { ID: 841, site_ID: 2916284, global_ID: '3d097cb7c5473c169bba0eb8e3c6cb64', title: 'Ribs & Chicken' }
			} );
		} );

		describe( 'persistence', () => {
			it( 'persists state', () => {
				const original = deepFreeze( {
					'3d097cb7c5473c169bba0eb8e3c6cb64': {
						ID: 841,
						site_ID: 2916284,
						global_ID: '3d097cb7c5473c169bba0eb8e3c6cb64',
						title: 'Hello World'
					}
				} );
				const state = items( original, { type: SERIALIZE } );
				expect( state ).to.eql( original );
			} );

			it( 'loads valid persisted state', () => {
				const original = deepFreeze( {
					'3d097cb7c5473c169bba0eb8e3c6cb64': {
						ID: 841,
						site_ID: 2916284,
						global_ID: '3d097cb7c5473c169bba0eb8e3c6cb64',
						title: 'Hello World'
					}
				} );
				const state = items( original, { type: DESERIALIZE } );
				expect( state ).to.eql( original );
			} );

			it( 'loads default state when schema does not match', () => {
				const original = deepFreeze( {
					'3d097cb7c5473c169bba0eb8e3c6cb64': {
						ID: 841,
						site_ID: 'foo',
						global_ID: '3d097cb7c5473c169bba0eb8e3c6cb64',
						title: 'Hello World'
					}
				} );
				const state = items( original, { type: DESERIALIZE } );
				expect( state ).to.eql( {} );
			} );
		} );
	} );

	describe( '#queryRequests()', () => {
		it( 'should default to an empty object', () => {
			const state = queryRequests( undefined, {} );

			expect( state ).to.eql( {} );
		} );

		it( 'should track post query request fetching', () => {
			const state = queryRequests( undefined, {
				type: POSTS_REQUEST,
				siteId: 2916284,
				query: { search: 'Hello' }
			} );

			expect( state ).to.eql( {
				'2916284:{"search":"hello"}': true
			} );
		} );

		it( 'should track post queries without specified site', () => {
			const state = queryRequests( undefined, {
				type: POSTS_REQUEST,
				query: { search: 'Hello' }
			} );

			expect( state ).to.eql( {
				'{"search":"hello"}': true
			} );
		} );

		it( 'should accumulate queries', () => {
			const original = deepFreeze( {
				'2916284:{"search":"hello"}': true
			} );

			const state = queryRequests( original, {
				type: POSTS_REQUEST,
				siteId: 2916284,
				query: { search: 'Hello W' }
			} );

			expect( state ).to.eql( {
				'2916284:{"search":"hello"}': true,
				'2916284:{"search":"hello w"}': true
			} );
		} );

		it( 'should track post query request success', () => {
			const state = queryRequests( undefined, {
				type: POSTS_REQUEST_SUCCESS,
				siteId: 2916284,
				query: { search: 'Hello' },
				found: 1,
				posts: [
					{ ID: 841, site_ID: 2916284, global_ID: '3d097cb7c5473c169bba0eb8e3c6cb64', title: 'Hello World' }
				]
			} );

			expect( state ).to.eql( {
				'2916284:{"search":"hello"}': false
			} );
		} );

		it( 'should track post query request failure', () => {
			const state = queryRequests( undefined, {
				type: POSTS_REQUEST_FAILURE,
				siteId: 2916284,
				query: { search: 'Hello' },
				error: new Error()
			} );

			expect( state ).to.eql( {
				'2916284:{"search":"hello"}': false
			} );
		} );

		it( 'should never persist state', () => {
			const original = deepFreeze( {
				'2916284:{"search":"hello"}': true
			} );

			const state = queryRequests( original, { type: SERIALIZE } );

			expect( state ).to.eql( {} );
		} );

		it( 'should never load persisted state', () => {
			const original = deepFreeze( {
				'2916284:{"search":"hello"}': true
			} );

			const state = queryRequests( original, { type: DESERIALIZE } );

			expect( state ).to.eql( {} );
		} );
	} );

	describe( '#queries()', () => {
		it( 'should default to an empty object', () => {
			const state = queries( undefined, {} );

			expect( state ).to.eql( {} );
		} );

		it( 'should track post query request success', () => {
			const state = queries( undefined, {
				type: POSTS_REQUEST_SUCCESS,
				siteId: 2916284,
				query: { search: 'Hello' },
				found: 1,
				posts: [
					{ ID: 841, site_ID: 2916284, global_ID: '3d097cb7c5473c169bba0eb8e3c6cb64', title: 'Hello World' }
				]
			} );

			expect( state ).to.eql( {
				'2916284:{"search":"hello"}': [ '3d097cb7c5473c169bba0eb8e3c6cb64' ]
			} );
		} );

		it( 'should accumulate query request success', () => {
			const original = deepFreeze( {
				'2916284:{"search":"hello"}': [ '3d097cb7c5473c169bba0eb8e3c6cb64' ]
			} );
			const state = queries( original, {
				type: POSTS_REQUEST_SUCCESS,
				siteId: 2916284,
				query: { search: 'Hello W' },
				posts: [
					{ ID: 841, site_ID: 2916284, global_ID: '3d097cb7c5473c169bba0eb8e3c6cb64', title: 'Hello World' }
				]
			} );

			expect( state ).to.eql( {
				'2916284:{"search":"hello"}': [ '3d097cb7c5473c169bba0eb8e3c6cb64' ],
				'2916284:{"search":"hello w"}': [ '3d097cb7c5473c169bba0eb8e3c6cb64' ]
			} );
		} );

		it( 'should persist state', () => {
			const original = deepFreeze( {
				'2916284:{"search":"hello"}': [ '3d097cb7c5473c169bba0eb8e3c6cb64' ]
			} );

			const state = queries( original, { type: SERIALIZE } );

			expect( state ).to.eql( {
				'2916284:{"search":"hello"}': [ '3d097cb7c5473c169bba0eb8e3c6cb64' ]
			} );
		} );

		it( 'should load persisted state', () => {
			const original = deepFreeze( {
				'2916284:{"search":"hello"}': [ '3d097cb7c5473c169bba0eb8e3c6cb64' ]
			} );

			const state = queries( original, { type: DESERIALIZE } );

			expect( state ).to.eql( {
				'2916284:{"search":"hello"}': [ '3d097cb7c5473c169bba0eb8e3c6cb64' ]
			} );
		} );

		it( 'should not load invalid persisted state', () => {
			const original = deepFreeze( {
				2916284: [ '3d097cb7c5473c169bba0eb8e3c6cb64' ]
			} );

			const state = queries( original, { type: DESERIALIZE } );

			expect( state ).to.eql( {} );
		} );
	} );

	describe( '#queriesLastPage()', () => {
		it( 'should default to an empty object', () => {
			const state = queriesLastPage( undefined, {} );

			expect( state ).to.eql( {} );
		} );

		it( 'should track post query request success last page', () => {
			const state = queriesLastPage( undefined, {
				type: POSTS_REQUEST_SUCCESS,
				siteId: 2916284,
				query: { search: '', number: 1 },
				found: 2,
				posts: [
					{ ID: 841, site_ID: 2916284, global_ID: '3d097cb7c5473c169bba0eb8e3c6cb64', title: 'Hello World' }
				]
			} );

			expect( state ).to.eql( {
				'2916284:{"number":1}': 2
			} );
		} );

		it( 'should track last page without specified site', () => {
			const state = queriesLastPage( undefined, {
				type: POSTS_REQUEST_SUCCESS,
				query: { search: '', number: 1 },
				found: 2,
				posts: [
					{ ID: 841, site_ID: 2916284, global_ID: '3d097cb7c5473c169bba0eb8e3c6cb64', title: 'Hello World' }
				]
			} );

			expect( state ).to.eql( {
				'{"number":1}': 2
			} );
		} );

		it( 'should track last page regardless of page param', () => {
			const state = queriesLastPage( undefined, {
				type: POSTS_REQUEST_SUCCESS,
				siteId: 2916284,
				query: { search: '', number: 1, page: 2 },
				found: 2,
				posts: [
					{ ID: 413, site_ID: 2916284, global_ID: '6c831c187ffef321eb43a67761a525a3', title: 'Ribs & Chicken' }
				]
			} );

			expect( state ).to.eql( {
				'2916284:{"number":1}': 2
			} );
		} );

		it( 'should consider no results as having last page of 1', () => {
			const state = queriesLastPage( undefined, {
				type: POSTS_REQUEST_SUCCESS,
				siteId: 2916284,
				query: { search: 'none', number: 1 },
				found: 0,
				posts: []
			} );

			expect( state ).to.eql( {
				'2916284:{"search":"none","number":1}': 1
			} );
		} );

		it( 'should accumulate site post request success', () => {
			const original = deepFreeze( {
				'2916284:{"search":"hello"}': 1
			} );
			const state = queriesLastPage( original, {
				type: POSTS_REQUEST_SUCCESS,
				siteId: 2916284,
				query: { search: 'Ribs' },
				found: 1,
				posts: [
					{ ID: 413, site_ID: 2916284, global_ID: '6c831c187ffef321eb43a67761a525a3', title: 'Ribs & Chicken' }
				]
			} );

			expect( state ).to.eql( {
				'2916284:{"search":"hello"}': 1,
				'2916284:{"search":"ribs"}': 1
			} );
		} );

		it( 'never persists state', () => {
			const original = deepFreeze( {
				'2916284:{"search":"hello"}': 1
			} );
			const state = queriesLastPage( original, { type: SERIALIZE } );
			expect( state ).to.eql( {} );
		} );

		it( 'never loads persisted state', () => {
			const original = deepFreeze( {
				'2916284:{"search":"hello"}': 1
			} );
			const state = queriesLastPage( original, { type: DESERIALIZE } );
			expect( state ).to.eql( {} );
		} );
	} );

	describe( '#siteRequests()', () => {
		it( 'should default to an empty object', () => {
			const state = siteRequests( undefined, {} );

			expect( state ).to.eql( {} );
		} );

		it( 'should map site ID, post ID to true value if request in progress', () => {
			const state = siteRequests( undefined, {
				type: POST_REQUEST,
				siteId: 2916284,
				postId: 841
			} );

			expect( state ).to.eql( {
				2916284: {
					841: true
				}
			} );
		} );

		it( 'should accumulate mappings', () => {
			const state = siteRequests( deepFreeze( {
				2916284: {
					841: true
				}
			} ), {
				type: POST_REQUEST,
				siteId: 2916284,
				postId: 413
			} );

			expect( state ).to.eql( {
				2916284: {
					841: true,
					413: true
				}
			} );
		} );

		it( 'should map site ID, post ID to false value if request finishes successfully', () => {
			const state = siteRequests( deepFreeze( {
				2916284: {
					841: true
				}
			} ), {
				type: POST_REQUEST_SUCCESS,
				siteId: 2916284,
				postId: 841
			} );

			expect( state ).to.eql( {
				2916284: {
					841: false
				}
			} );
		} );

		it( 'should map site ID, post ID to false value if request finishes with failure', () => {
			const state = siteRequests( deepFreeze( {
				2916284: {
					841: true
				}
			} ), {
				type: POST_REQUEST_FAILURE,
				siteId: 2916284,
				postId: 841
			} );

			expect( state ).to.eql( {
				2916284: {
					841: false
				}
			} );
		} );

		it( 'never persists state', () => {
			const state = siteRequests( deepFreeze( {
				2916284: {
					841: true
				}
			} ), {
				type: SERIALIZE
			} );

			expect( state ).to.eql( {} );
		} );

		it( 'never loads persisted state', () => {
			const state = siteRequests( deepFreeze( {
				2916284: {
					841: true
				}
			} ), {
				type: DESERIALIZE
			} );

			expect( state ).to.eql( {} );
		} );
	} );
} );
