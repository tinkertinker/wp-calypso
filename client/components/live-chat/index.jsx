import React from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import { isArray, isEmpty } from 'lodash/lang';

import GridIcon from 'components/gridicon';
import Spinner from 'components/spinner';
import {
	first,
	any,
	all,
	when,
	propExists,
	propEquals,
	// actionDispatcher,
	compose
} from 'lib/functional';
import {
	openChat,
	closeChat,
	// minimizeChat,
	updateChatMessage,
	sendChatMessage,
	setLiveChatAutoScroll,
	openChatURL
} from 'state/live-chat/actions';

const debug = require( 'debug' )( 'calypso:live-chat:component' );

const returnPressed = ( e ) => e.which === 13;
const preventDefault = ( e ) => e.preventDefault();

const isAvailable = propExists( 'available' );
const isConnecting = propEquals( 'connectionStatus', 'connecting' );
const isConnected = propEquals( 'connectionStatus', 'connected' );
const isChatOpen = all(
	isAvailable,
	any( isConnected, isConnecting )
);
const timelineHasContent = ( { timeline } ) => isArray( timeline ) && !isEmpty( timeline );

/*
 * Renders chat title message to display when chat is not active.
 * Allows for different messages depending on whether live chats are available.
 */
const availabilityTitle = when(
	isAvailable,
	( { onOpenChat, user } ) => {
		const onClick = () => onOpenChat( user );
		return <div onClick={ onClick }>Help</div>;
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

/*
 * Renders a textarea to be used to comopose a message for the chat.
 */
const renderComposer = ( { message, onUpdateChatMessage, onSendChatMessage } ) => {
	const sendMessage = () => onSendChatMessage( message );
	const onChange = ( { target: { value } } ) => onUpdateChatMessage( value );
	const onKeyDown = when( returnPressed, compose( preventDefault, sendMessage ) );
	return (
		<div className="live-chat-composer">
			<div className="live-chat-message">
				<textarea
					type="text"
					placeholder="Ask a question..."
					onChange={ onChange }
					onKeyDown={ onKeyDown }
					value={ message } />
			</div>
			<div className="live-chat-submit"
					tabIndex="-1"
					onClick={ sendMessage }>
					<svg viewBox="0 0 24 24" width="24" height="24"><path d="M2 21l21-9L2 3v7l15 2-15 2z"/></svg>
			</div>
		</div>
	);
};

/*
 * Renders a single line of message text prefixed by the provided `nick`.
 */
const messageTextWithNick = ( { message, nick, key } ) => (
	<p key={ key }><span className="message-nick">{ nick }</span> { message }</p>
);

/*
 * Renders a single line of message text.
 */
const linksNotEmpty = ( { links } ) => !isEmpty( links );
const messageParagraph = ( { message, key } ) => <p key={ key }>{ message }</p>;
const messageWithLinks = ( { message, key, links, onOpenChatUrl } ) => {
	// extract the links and replace with components?
	let children = links.reduce( ( { parts, last }, [ url, startIndex, length ] ) => {
		if ( last < startIndex ) {
			parts = parts.concat( <span>{ message.slice( last, startIndex ) }</span> );
		}
		parts = parts.concat( <a href="#" onClick={ compose( preventDefault, () => onOpenChatUrl( url ) ) }>{ url }</a> );
		return { parts, last: startIndex + length };
	}, { parts: [], last: 0 } );

	if ( children.last < message.length ) {
		children.parts = children.parts.concat( <span>{ message.slice( children.last ) }</span> );
	}

	return <p key={ key }>{ children.parts }</p>;
};
const messageText = when( linksNotEmpty, messageWithLinks, messageParagraph );
const messageAvatar = when( propExists( 'meta.image' ), ( { meta } ) => <img alt={ meta.nick } src={ meta.image } /> );

/*
 * Picks which message render function to call based on whether the message is from the currently logged in
 * user.
 */
const renderMessage = when( propExists( 'isCurrentUser' ), messageText, messageTextWithNick );

const renderGroupedMessages = ( { item, isCurrentUser, onOpenChatUrl }, index ) => {
	let [ initial, ... rest ] = item;
	let [ message, meta ] = initial;
	return (
		<div className={ classnames( 'live-chat-timeline-message', { userMessage: isCurrentUser } ) } key={ meta.id || index }>
			<div className="message-text">
				{ renderMessage( {
					isCurrentUser,
					message,
					nick: meta.nick,
					key: meta.id,
					links: meta.links,
					onOpenChatUrl
				} ) }
				{ rest.map( ( [ remaining, remaining_meta ] ) => messageText( {
					message: remaining,
					key: remaining_meta.id,
					links: remaining_meta.links
				} ) ) }
			</div>
			<div className="message-meta">
				<div className="message-avatar">{ messageAvatar( { meta } ) }</div>
			</div>
		</div>
	);
};

const nick = ( [ , meta ] ) => <strong>{ meta.nick }</strong>;
const nickComma = ( ... args ) => ( <span>{ nick( ... args ) }, </span> );

const andRest = ( { rest } ) => <div>
	{ rest.slice( 0, -1 ).map( nickComma ) }
	and
	{ rest.slice( -1 ).map( nick ) }
	joined.
</div>;

const andRestWhenMoreThanOne = when( ( { rest } ) => rest.length > 0, andRest );

const renderJoinMessage = ( { item }, index ) => {
	const [ initial, ... rest ] = item;
	return (
		<div className="live-chat-timeline-join-message" key={ index }>
			<div>{ nick( initial ) }{ andRestWhenMoreThanOne( { rest: rest } ) } joined.</div>
		</div>
	);
};
const itemTypeIs = ( type ) => ( { item } ) => item[0][1].type === type;

/*
 * Renders a chat bubble with multiple messages grouped by user.
 */
const renderGroupedTimelineItem = first(
	when( itemTypeIs( 'message' ), renderGroupedMessages ),
	when( itemTypeIs( 'join' ), renderJoinMessage ),
	( { item } ) => debug( 'no handler for message type', item[0][1].type, item )
);
/*
 * Renders a spinner in a flex-box context so it is centered vertically and horizontally
 */
const renderLoading = () => (
	<div className="live-chat-loading">
		<Spinner />
	</div>
);

const groupMessages = ( messages ) => {
	let grouped = messages.reduce( ( { user_id, type, group, groups }, [ message, meta ] ) => {
		const message_user_id = meta.user_id;
		const message_type = meta.type;
		if ( user_id !== message_user_id || message_type !== type ) {
			return {
				user_id: message_user_id,
				type: message_type,
				group: [ [ message, meta ] ],
				groups: group ? groups.concat( [ group ] ) : groups
			};
		}
		// it's the same user so group it together
		return { user_id, group: group.concat( [ [ message, meta ] ] ), groups, type };
	}, { groups: [] } );

	return grouped.groups.concat( [ grouped.group ] );
};

/*
 * Returns a function for a component's ref property to enable autoscroll detection
 */
const autoScroll = ( { onSetAutoscroll, isAutoscrollActive } ) => ( ref ) => {
	if ( !ref ) return;

	// Scroll to the bottom of the chat transcript if autoscroll is enabled
	if ( isAutoscrollActive ) {
		ref.scrollTop = Math.max( 0, ref.scrollHeight - ref.offsetHeight );
	}

	ref.addEventListener( 'scroll', () => {
		onSetAutoscroll( ref.scrollTop + ref.offsetHeight >= ref.scrollHeight );
	} );
};

const renderTimeline = ( { timeline, isCurrentUser, isAutoscrollActive, onOpenChatUrl, onSetAutoscroll } ) => (
	<div ref={ autoScroll( { onSetAutoscroll, isAutoscrollActive } ) } className="live-chat-conversation">
		{ groupMessages( timeline ).map( ( item ) => renderGroupedTimelineItem( {
			onOpenChatUrl,
			item,
			isCurrentUser: isCurrentUser( item[0] )
		} ) ) }
	</div>
);

const welcomeMessage = () => (
	<div className="live-chat-welcome">
		This is the beginning of your chat history with WordPress.com support. A chat history will be stored here.
	</div>
);

const liveChatTimeline = first(
	when( isConnecting, renderLoading ),
	when( isConnected, when( timelineHasContent, renderTimeline, welcomeMessage ) )
);

const liveChatTitle = first(
	when( isConnected, connectedTitle ),
	when( isConnecting, connectingTitle ),
	availabilityTitle
);

const liveChatComposer = when( isConnected, renderComposer );

/*
 * Main chat UI component
 */
const LiveChat = React.createClass( {
	render() {
		const {
			available,
			connectionStatus,
			message,
			timeline,
			isCurrentUser,
			user,
			isAutoscrollActive,
			onCloseChat,
			onOpenChat,
			onSendChatMessage,
			onUpdateChatMessage,
			onOpenChatUrl,
			onSetAutoscroll,
		} = this.props;

		return (
			<div className="live-chat-container">
				<div className={ classnames( 'live-chat', { open: isChatOpen( { connectionStatus, available } ) } ) }>
					<div className="live-chat__title">
						{ liveChatTitle( {
							available,
							connectionStatus,
							user,
							onCloseChat,
							onOpenChat
						} ) }
					</div>
					{ liveChatTimeline( {
						connectionStatus,
						isCurrentUser,
						isAutoscrollActive,
						timeline,
						onOpenChatUrl,
						onSetAutoscroll
					} ) }
					{ liveChatComposer( {
						connectionStatus,
						message,
						onSendChatMessage,
						onUpdateChatMessage
					} ) }
				</div>
			</div>
		);
	}
} );

function mapStateToProps( { liveChat, currentUser, users } ) {
	return {
		available: liveChat.available,
		connectionStatus: liveChat.status,
		message: liveChat.message,
		timeline: liveChat.timeline,
		isCurrentUser: ( [ , meta ] ) => meta.user_id === currentUser.id,
		user: users.items[currentUser.id],
		isAutoscrollActive: liveChat.autoscroll
	};
}

function mapDispatchToProps( dispatch ) {
	return {
		onOpenChat( user ) {
			dispatch( openChat( user ) );
		},
		onCloseChat() {
			dispatch( closeChat() );
		},
		onUpdateChatMessage( message ) {
			dispatch( updateChatMessage( message ) );
		},
		onSendChatMessage( message ) {
			dispatch( sendChatMessage( message ) );
		},
		onOpenChatUrl( url ) {
			dispatch( openChatURL( url ) );
		},
		onSetAutoscroll( isAuto ) {
			dispatch( setLiveChatAutoScroll( isAuto ) );
		}
	};
}

/*
 * Export redux connected component
 */
export default connect( mapStateToProps, mapDispatchToProps )( LiveChat );
