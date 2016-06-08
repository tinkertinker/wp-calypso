import React from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import viewport from 'lib/viewport';

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
	closeChat
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
	<div className="live-chat-loading">
		<Spinner />
	</div>
);

const liveChatTimeline = when( isConnecting, renderLoading, () => <Timeline /> );

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

const liveChatComposer = when( isConnected, ( props ) => <Composer { ... props } /> );

/*
 * Main chat UI component
 */
const LiveChat = React.createClass( {

	componentDidMount() {
		this.scrollToBottom();
		window.addEventListener( 'resize', this.scrollToBottom );
	},

	componentWillUnmount() {
		window.removeEventListener( 'resize', this.scrollToBottom );
	},

	componentDidUpdate() {
		this.scrollToBottom();
	},

	onScrollContainer( scrollContainer ) {
		this.scrollContainer = scrollContainer;
		this.scrollToBottom();
	},

	scrollToBottom() {
		const { isAutoscrollActive } = this.props;
		if ( ! isAutoscrollActive ) {
			return;
		}

		if ( ! this.scrollContainer ) {
			return;
		}

		const { scrollHeight, offsetHeight } = this.scrollContainer;
		this.scrollContainer.scrollTop = Math.max( 0, scrollHeight - offsetHeight );
	},

	detectAutoScroll() {
		const { onSetAutoscroll, isAutoscrollActive } = this.props;
		const { scrollTop, offsetHeight, scrollHeight } = this.scrollContainer;
		const enableAutoScroll = scrollTop + offsetHeight >= scrollHeight;
		if ( enableAutoScroll === isAutoscrollActive ) {
			return;
		}
		onSetAutoscroll( enableAutoScroll );
	},

	handleScroll( e ) {
		var delta = null;
		if ( ! this.scrollContainer ) {
			return;
		}

		e = e || window.event;
		if ( e.preventDefault )
			e.preventDefault();
		e.returnValue = false;

		// scroll the window itself using JS
		// this is not perfect, we're basically guessing at how much your wheel usually scrolls
		if ( e === 'DOMMouseScroll' ) { // old FF
			delta = e.detail * -10;
		} else if ( e.wheelDelta ) { // webkit
			delta = e.wheelDelta / 8;
		} else if ( e.deltaY ) { // new FF
			if ( e.deltaMode && e.deltaMode === 0 )	{			// scrolling pixels
				console.log( "scrolling pixels" );
				delta = -1 * e.deltaY;
			} else if ( e.deltaMode && e.deltaMode === 1 ) { 	// scrolling lines
				delta = -1 * e.deltaY * 15;
			} else { 											// fallback
				delta = -1 * e.deltaY * 10;
			}
		}

		this.scrollContainer.scrollTop -= delta;
	},

	lockScroll() {
		if ( window.addEventListener ) // older FF
			window.addEventListener( 'DOMMouseScroll', this.handleScroll, false );
		window.onwheel = this.handleScroll;
		window.onmousewheel = document.onmousewheel = this.handleScroll;
	},

	unlockScroll() {
		if ( window.removeEventListener )	// older FF
			window.removeEventListener( 'DOMMouseScroll', this.handleScroll, false );
		window.onwheel = null;
		window.onmousewheel = document.onmousewheel = null;
	},

	render() {
		const {
			available,
			connectionStatus,
			user,
			onCloseChat,
			onOpenChat,
			floating
		} = this.props;

		return (
			<div className={ classnames( 'live-chat-container', { floating } ) }>
				<div
					className={ classnames( 'live-chat', { open: floating && isChatOpen( { connectionStatus, available } ) } ) }
					onMouseEnter={ this.lockScroll }
					onMouseLeave={ this.unlockScroll }>
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
					{ liveChatComposer( {
						connectionStatus
					} ) }
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
		}
	};
};

/*
 * Export redux connected component
 */
export default connect( mapState, mapDispatch )( LiveChat );
