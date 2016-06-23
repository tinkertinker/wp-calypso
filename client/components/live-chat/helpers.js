import {
	propExists,
	propEquals
} from 'lib/functional';

export const isAvailable = propExists( 'available' );
export const isConnecting = propEquals( 'connectionStatus', 'connecting' );
export const isConnected = propEquals( 'connectionStatus', 'connected' );
