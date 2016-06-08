import React from 'react';
import classnames from 'classnames';
import isEmpty from 'lodash/isEmpty';
import isArray from 'lodash/isArray';
import assign from 'lodash/assign';
import { connect } from 'react-redux';

import {
	first,
	when,
	compose,
	propExists
} from 'lib/functional';
import autoscroll from './autoscroll';
import AgentW from 'components/live-chat/agent-w';

const debug = require( 'debug' )( 'calypso:live-chat:timeline' );

const nick = ( [ , meta ] ) => <strong>{ meta.nick }</strong>;
const nickComma = ( ... args ) => ( <span>{ nick( ... args ) }, </span> );

const andRest = ( { rest } ) => <div>
	{ rest.slice( 0, -1 ).map( nickComma ) }
	and
	{ rest.slice( -1 ).map( nick ) }
	joined.
</div>;

const andRestWhenMoreThanOne = when( ( { rest } ) => rest.length > 0, andRest );
const linksNotEmpty = ( { links } ) => !isEmpty( links );

const messageParagraph = ( { message, key } ) => <p key={ key }>{ message }</p>;
const messageWithLinks = ( { message, key, links, onOpenChatUrl } ) => {
	// extract the links and replace with components?
	let children = links.reduce( ( { parts, last }, [ url, startIndex, length ] ) => {
		if ( last < startIndex ) {
			parts = parts.concat( <span>{ message.slice( last, startIndex ) }</span> );
		}
		parts = parts.concat( <a href="#" onClick={ compose( e => e.preventDefault(), () => onOpenChatUrl( url ) ) }>{ url }</a> );
		return { parts, last: startIndex + length };
	}, { parts: [], last: 0 } );

	if ( children.last < message.length ) {
		children.parts = children.parts.concat( <span>{ message.slice( children.last ) }</span> );
	}

	return <p key={ key }>{ children.parts }</p>;
};

const messageText = when( linksNotEmpty, messageWithLinks, messageParagraph );
const messageAvatar = when( propExists( 'meta.image' ), ( { meta } ) => <img alt={ meta.nick } src={ meta.image } /> );

const renderJoinMessage = ( { item }, index ) => {
	const [ initial, ... rest ] = item;
	return (
		<div className="live-chat-timeline-join-message" key={ index }>
			<div>{ nick( initial ) }{ andRestWhenMoreThanOne( { rest: rest } ) } joined.</div>
		</div>
	);
};

const renderGroupedMessages = ( { item, isCurrentUser, onOpenChatUrl }, index ) => {
	let [ initial, ... rest ] = item;
	let [ message, meta ] = initial;
	let userAvatar = messageAvatar( { meta } );
	return (
		<div className={ classnames( 'live-chat-timeline-message', { userMessage: isCurrentUser } ) } key={ meta.id || index }>
			<div className="message-text">
				{ messageText( {
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
				<div className="message-avatar">
				{ isCurrentUser ? userAvatar : <AgentW /> }
				</div>
			</div>
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

const welcomeMessage = () => (
	<div className="live-chat-welcome">
		This is the beginning of your chat history with WordPress.com support. A chat history will be stored here.
	</div>
);

const timelineHasContent = ( { timeline } ) => isArray( timeline ) && !isEmpty( timeline );

const renderTimeline = ( { timeline, isCurrentUser, onScrollContainer } ) => (
	<div className="live-chat-conversation" ref={ onScrollContainer }>
		{ groupMessages( timeline ).map( ( item ) => renderGroupedTimelineItem( {
			item,
			isCurrentUser: isCurrentUser( item[0] )
		} ) ) }
	</div>
);

const liveChatTimeline = when( timelineHasContent, renderTimeline, welcomeMessage );

const Timeline = React.createClass( {
	mixins: [ autoscroll ],
	render() {
		return liveChatTimeline( assign( { onScrollContainer: this.setupAutoscroll }, this.props ) );
	}
} );

const noop = () => {};
const mapProps = ( state ) => {
	const {
		liveChat: { timeline, available, status: connectionStatus },
		currentUser: { id: current_user_id }
	} = state;
	return {
		available,
		connectionStatus,
		timeline,
		isCurrentUser: ( [ , { user_id } ] ) => user_id === current_user_id,
		openChatUrl: noop,
		onScrollContainer: noop,
		onScroll: noop
	};
};
const mapDispatch = ( dispatch ) => {
	return {};
};

const ConnectedTimeline = connect( mapProps, mapDispatch )( Timeline );

export { ConnectedTimeline as default };
