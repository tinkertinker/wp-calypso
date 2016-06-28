import React from 'react';
import { connect } from 'react-redux';
import isEmpty from 'lodash/isEmpty';

import {
	when,
	forEach,
	compose,
	propEquals,
	call,
	prop
} from 'lib/functional';
import {
	updateChatMessage,
	sendChatMessage
} from 'state/live-chat/actions';
import scrollbleed from './scrollbleed';

const returnPressed = propEquals( 'which', 13 );
const preventDefault = call( 'preventDefault' );

/*
 * Renders a textarea to be used to comopose a message for the chat.
 */
export const Composer = React.createClass( {
	mixins: [ scrollbleed ],

	render() {
		const { message, onUpdateChatMessage, onSendChatMessage, onFocus } = this.props;
		const sendMessage = when( () => ! isEmpty( message ), () => onSendChatMessage( message ) );
		const onChange = compose( prop( 'target.value' ), onUpdateChatMessage );
		const onKeyDown = when( returnPressed, forEach( preventDefault, sendMessage ) );
		return (
			<div className="live-chat__composer"
				onMouseEnter={ this.scrollbleedLock }
				onMouseLeave={ this.scrollbleedUnlock }
				>
				<div className="live-chat__message">
					<textarea
						ref={ this.setScrollbleedTarget }
						onFocus={ onFocus }
						type="text"
						placeholder="Ask a question..."
						onChange={ onChange }
						onKeyDown={ onKeyDown }
						value={ message } />
				</div>
				<div className="live-chat__submit"
						tabIndex="-1"
						onClick={ sendMessage }>
						<svg viewBox="0 0 24 24" width="24" height="24"><path d="M2 21l21-9L2 3v7l15 2-15 2z"/></svg>
				</div>
			</div>
		);
	}
} );

const mapState = ( { liveChat: { message } } ) => ( { message } );

const mapDispatch = ( dispatch ) => ( {
	onUpdateChatMessage( message ) {
		dispatch( updateChatMessage( message ) );
	},
	onSendChatMessage( message ) {
		dispatch( sendChatMessage( message ) );
	}
} );

export default connect( mapState, mapDispatch )( Composer );
