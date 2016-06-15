import React from 'react';
import { connect } from 'react-redux';
import viewport from 'lib/viewport';
import ReactDOM from 'react-dom';

import { connectChat } from 'state/live-chat/actions';
import Timeline from './timeline';
import Composer from './composer';
import scrollbleed from './scrollbleed';

export const LiveChatPage = React.createClass( {
	mixins: [ scrollbleed ],

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
			<div className="live-chat-container"
				onMouseEnter={ this.scrollbleedLock }
				onMouseLeave={ this.scrollbleedUnlock }>
				<Timeline onScrollContainer={ this.setScrollbleedTarget } />
				<Composer onFocus={ this.onFocus } ref="composer" />
			</div>
		);
	}
} );

const mapState = () => ( {} );
const mapDispatch = dispatch => ( {
	openChat: () => dispatch( connectChat() )
} );
export default connect( mapState, mapDispatch )( LiveChatPage );
