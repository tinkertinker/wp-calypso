import React from 'react';
import { connect } from 'react-redux';
import viewport from 'lib/viewport';
import ReactDOM from 'react-dom';

import { openChat } from 'state/live-chat/actions';
import Timeline from './timeline';
import Composer from './composer';

export const LiveChatPage = React.createClass( {
	componentDidMount() {
		this.props.openChat();
	},

	onFocus() {
		var composerNode = ReactDOM.findDOMNode( this.refs.composer );

		if ( viewport.isMobile() ) {
			/* User tapped textfield on a phone. This shows the keyboard. Unless we scroll to the bottom, the chatbox will be invisible */
			setTimeout( () => composerNode.scrollIntoView(), 500 );	/* Wait for the keyboard to appear */
		}
	},

	render() {
		return (
			<div className="live-chat-container">
				<Timeline />
				<Composer onFocus={ this.onFocus } ref="composer" />
			</div>
		);
	}
} );

const mapState = () => ( {} );
const mapDispatch = dispatch => ( {
	openChat: () => dispatch( openChat() )
} );
export default connect( mapState, mapDispatch )( LiveChatPage );
