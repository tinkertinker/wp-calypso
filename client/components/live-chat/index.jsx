import React from 'react'
import { connect } from 'react-redux'
import classnames from 'classnames'
import { isArray, isEmpty } from 'lodash/lang'

import GridIcon from 'components/gridicon'
import Spinner from 'components/spinner'
import { pure, log, first, any, all, when, propExists, propEquals, actionDispatcher, each } from 'lib/functional'
import { openChat, closeChat, minimizeChat, updateChatMessage, sendChatMessage, setLiveChatAutoScroll } from 'state/live-chat/actions'

const debug = require( 'debug' )( 'calypso:live-chat:component' )
const logger = log( debug )

const dispatchOpenChat = actionDispatcher( openChat )
const dispatchCloseChat = actionDispatcher( closeChat )()
const dispatchMinimizeChat = actionDispatcher( minimizeChat )()
const dispatchUpdateChatMessageOnChange = actionDispatcher( updateChatMessage )( ( event ) => event.target.value )
const dispatchSendMessage = actionDispatcher( sendChatMessage )

const returnPressed = ( e ) => e.which === 13
const preventDefault = ( e ) => e.preventDefault()

const isAvailable = propExists( 'available' )
const isConnecting = propEquals( 'connectionStatus', 'connecting' )
const isConnected = propEquals( 'connectionStatus', 'connected' )
const isChatOpen = all(
	isAvailable,
	any( isConnected, isConnecting )
)
const timelineHasContent = ( { timeline } ) => isArray( timeline ) && !isEmpty( timeline )

/*
 * Renders chat title message to display when chat is not active.
 * Allows for different messages depending on whether live chats are available.
 */
const availabilityTitle = when(
	isAvailable,
	( { dispatch, user } ) => <div onClick={ dispatchOpenChat( pure( user ) )( dispatch ) }>Help</div>,
	() => <div>Live Support Unavailable</div>
)

const connectingTitle = () => <div>Starting chat</div>
const connectedTitle = ( { dispatch } ) => (
	<div className="live-chat-active-toolar">
		<div>Howdy, how may we help?</div>
		<div onClick={ dispatchMinimizeChat( dispatch ) }><GridIcon icon="minus" /></div>
		<div onClick={ dispatchCloseChat( dispatch ) }><GridIcon icon="cross" /></div>
	</div>
)

const title = first(
	when( isConnected, connectedTitle ),
	when( isConnecting, connectingTitle ),
	availabilityTitle
)

/*
 * Renders a textarea to be used to comopose a message for the chat.
 */
const renderComposer = ( { dispatch, message } ) => (
	<div className="live-chat-composer">
		<div className="live-chat-message">
			<textarea
				type="text"
				onChange={ dispatchUpdateChatMessageOnChange( dispatch ) }
				onKeyDown={ when( returnPressed, each( preventDefault, dispatchSendMessage( pure( message ) )( dispatch ) ) ) }
				value={ message } />
		</div>
		<div
				tabIndex="-1"
				className="live-chat-submit"
				onClick={ dispatchSendMessage( pure( message ) )( dispatch ) }
				>Send</div>
	</div>
)

/*
 * Renders a single line of message text prefixed by the provided `nick`.
 */
const messageTextWithNick = ( { message, nick, key } ) => <p key={ key }><span className="message-nick">{ nick }</span> { message }</p>

/*
 * Renders a single line of message text.
 */
const messageText = ( { message, key } ) => <p key={ key }>{ message }</p>

const messageAvatar = when( propExists( 'meta.image' ), ( { meta } ) => <img alt={ meta.nick } src={ meta.image } /> )

/*
 * Picks which message render function to call based on whether the message is from the currently logged in
 * user.
 */
const renderMessage = when( propExists( 'isCurrentUser' ), messageText, messageTextWithNick )

/*
 * Renders a chat bubble with multiple messages grouped by user.
 */
const renderGroupedTimelineItem = ( { item, isCurrentUser } ) => {
	let [ initial, ... rest ] = item
	let [ message, meta ] = initial
	return (
		<div className={ classnames( 'live-chat-timeline-message', { userMessage: isCurrentUser } ) } key={ meta.id }>
			<div className="message-text">
				{ renderMessage( { isCurrentUser, message, nick: meta.nick, key: meta.id } ) }
				{ rest.map( ( [ remaining, remaining_meta ] ) => <p key={ remaining_meta.id }>{ remaining } </p> ) }
			</div>
			<div className="message-meta">
				<div className="message-avatar">{ messageAvatar( { meta } ) }</div>
			</div>
		</div>
	)
}

/*
 * Renders a spinner in a flex-box context so it is centered vertically and horizontally
 */
const renderLoading = () => (
	<div className="live-chat-loading">
		<Spinner />
	</div>
)

const groupMessages = ( messages ) => {
	let grouped = messages.reduce( ( { user_id, group, groups }, [ message, meta ] ) => {
		const message_user_id = meta.user_id
		if ( user_id !== message_user_id ) {
			return { user_id: message_user_id, group: [ [ message, meta ] ], groups: group ? groups.concat( [ group ] ) : groups }
		}
		// it's the same user so group it together
		return { user_id, group: group.concat( [ [ message, meta ] ] ), groups }
	}, { groups: [] } )

	return grouped.groups.concat( [ grouped.group ] )
}

/*
 * Returns a function for a component's ref property to enable autoscroll detection
 */
const autoScroll = ( { dispatch, autoscroll } ) => ( ref ) => {
	if ( !ref ) return

	// Scroll to the bottom of the chat transcript if autoscroll is enabled
	if ( autoscroll ) ref.scrollTop = Math.max( 0, ref.scrollHeight - ref.offsetHeight )

	ref.addEventListener( 'scroll', () => {
		dispatch( setLiveChatAutoScroll( ref.scrollTop + ref.offsetHeight >= ref.scrollHeight ) )
	} )
}

const renderConversation = ( { timeline, isCurrentUser, autoscroll, dispatch } ) => (
	<div ref={ autoScroll( { dispatch, autoscroll } ) } className="live-chat-conversation">
		{ groupMessages( timeline ).map( ( item ) => renderGroupedTimelineItem( { item, isCurrentUser: isCurrentUser( item[0] ) } ) ) }
	</div>
)

const welcomeMessage = () => (
	<div className="live-chat-welcome">This is the beginning of your chat history with WordPress.com support. A chat history will be stored here.</div>
)

const renderTimeline = first(
	when( isConnecting, renderLoading ),
	when( isConnected, when( timelineHasContent, renderConversation, welcomeMessage ) )
)

/*
 * Main chat UI component
 */
const component = ( { available, connectionStatus, message, dispatch, timeline, isCurrentUser, user, autoscroll } ) => (
	<div className={ classnames( 'live-chat', { open: isChatOpen( { connectionStatus, available } ) } ) }>
		<div className="live-chat-title">{ title( { available, connectionStatus, user, dispatch } ) }</div>
		{ renderTimeline( { connectionStatus, timeline, isCurrentUser, dispatch, autoscroll } ) }
		{ when( isConnected, renderComposer )( { connectionStatus, dispatch, message } ) }
	</div>
)

/*
 * Container that wraps the live chat component and anchors it to the bottom of the page
 */
const container = logger( 'rendering chat', ( ... args ) => <div className="live-chat-container">{ component( ... args ) }</div> )

/*
 * Export redux connected component
 */
export default connect( logger( 'connect', ( { liveChat, currentUser, users } ) => ( {
	available: liveChat.available,
	connectionStatus: liveChat.status,
	message: liveChat.message,
	timeline: liveChat.timeline,
	isCurrentUser: ( [ , meta ] ) => meta.user_id === currentUser.id,
	user: users.items[currentUser.id],
	autoscroll: liveChat.autoscroll
} ) ) )( container )
