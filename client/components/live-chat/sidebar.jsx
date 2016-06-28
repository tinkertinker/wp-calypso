import React from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';

import GridIcon from 'components/gridicon';
import Spinner from 'components/spinner';
import {
	first,
	any,
	all,
	when
} from 'lib/functional';
import {
	openChat,
	closeChat,
	connectChat
} from 'state/live-chat/actions';
import {
	isConnected,
	isConnecting,
	isAvailable
} from './helpers';
import Timeline from './timeline';
import Composer from './composer';

const isChatOpen = all(
	isAvailable,
	any( isConnected, isConnecting )
);

/*
 * Renders a spinner in a flex-box context so it is centered vertically and horizontally
 */
const renderLoading = () => (
	<div className="live-chat__loading">
		<Spinner />
	</div>
);

const liveChatTimeline = when(
	isConnecting,
	renderLoading,
	( { onScrollContainer } ) => <Timeline onScrollContainer={ onScrollContainer } />
);

/*
 * Renders chat title message to display when chat is not active.
 * Allows for different messages depending on whether live chats are available.
 */
const availabilityTitle = when(
	isAvailable,
	( { onOpenChat } ) => {
		const onClick = () => onOpenChat();
		return <div onClick={ onClick }>Support Chat</div>;
	},
	() => <div>Live Support Unavailable</div>
);

const connectingTitle = ( { onCloseChat } ) => {
	return (
		<div className="live-chat__active-toolbar">
			<span>Starting chat</span>
			<div onClick={ onCloseChat }>
				<GridIcon icon="cross" />
			</div>
		</div>
	);
};

const connectedTitle = ( { onCloseChat } ) => (
	<div className="live-chat__active-toolbar">
		<h4>Support Chat</h4>
		<div onClick={ onCloseChat }>
			<GridIcon icon="cross" />
		</div>
	</div>
);

const liveChatTitle = first(
	when( isConnected, connectedTitle ),
	when( isConnecting, connectingTitle ),
	availabilityTitle
);

const liveChatComposer = when( isConnected, () => <Composer /> );

/*
 * Main chat UI component
 */
const LiveChat = React.createClass( {

	componentDidMount() {
		this.props.connectChat();
	},

	render() {
		const {
			available,
			connectionStatus,
			user,
			onCloseChat,
			onOpenChat
		} = this.props;

		return (
			<div className="live-chat__container">
				<div
					className={ classnames( 'live-chat', { open: isChatOpen( { connectionStatus, available } ) } ) }>
					<div className="live-chat__title">
						{ liveChatTitle( {
							available,
							connectionStatus,
							user,
							onCloseChat,
							onOpenChat
						} ) }
					</div>
					{ liveChatTimeline( { connectionStatus } ) }
					{ liveChatComposer( { connectionStatus } ) }
				</div>
			</div>
		);
	}
} );

const mapState = ( { liveChat: { available, status: connectionStatus } } ) => {
	return {
		available,
		connectionStatus
	};
};

const mapDispatch = ( dispatch ) => {
	return {
		onOpenChat() {
			dispatch( openChat() );
		},
		onCloseChat() {
			dispatch( closeChat() );
		},
		connectChat() {
			dispatch( connectChat() );
		}
	};
};

/*
 * Export redux connected component
 */
export default connect( mapState, mapDispatch )( LiveChat );
