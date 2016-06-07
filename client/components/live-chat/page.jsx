import React from 'react';
import { connect } from 'react-redux';

import { openChat } from 'state/live-chat/actions';
import Timeline from './timeline';
import Composer from './composer';

const debug = require( 'debug' )( 'calypso:live-chat:page' );

export const LiveChatPage = React.createClass( {
	componentDidMount() {
		this.props.openChat();
	},

	render() {
		return (
			<div>
				<Timeline />
				<Composer />
			</div>
		);
	}
} );

const mapState = () => ( {} );
const mapDispatch = dispatch => ( {
	openChat: () => dispatch( openChat() )
} );
export default connect( mapState, mapDispatch )( LiveChatPage );
