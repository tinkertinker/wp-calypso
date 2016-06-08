import React from 'react';
import { connect } from 'react-redux';
import viewport from 'lib/viewport';
import ReactDOM from 'react-dom';

import { openChat } from 'state/live-chat/actions';
import Timeline from './timeline';
import Composer from './composer';
import {
	first,
	any,
	all,
	when
} from 'lib/functional';
import {
	isConnected,
	isConnecting,
	isAvailable
} from './helpers';

const debug = require( 'debug' )( 'calypso:live-chat:page' );

const liveChatComposer = ( props ) => <Composer { ... props } />;

export const LiveChatPage = React.createClass( {
	componentDidMount() {
		this.props.openChat();
	},

	onFocus() {

		var composerNode = ReactDOM.findDOMNode( this.refs.composer );

		if ( viewport.isMobile() ) {
			/* User tapped textfield on a phone. This shows the keyboard. Unless we scroll to the bottom, the chatbox will be invisible */
			setTimeout( function () {
				/* On iOS we need to move the  keyboard up, this is a hack to do so */
				composerNode.scrollIntoView();
			}, 600 );	/* Wait for the keyboard to appear */
		}
	},

	render() {
		return (
			<div className="live-chat-container">
				<Timeline />
				{ liveChatComposer( {
					onFocus: this.onFocus,
					ref: "composer"
				} ) }
			</div>
		);
	}
} );

const mapState = () => ( {} );
const mapDispatch = dispatch => ( {
	openChat: () => dispatch( openChat() )
} );
export default connect( mapState, mapDispatch )( LiveChatPage );
