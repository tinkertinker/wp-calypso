import React from 'react'
import { connect } from 'react-redux'
import classnames from 'classnames'
import { isEmpty } from 'lodash/lang'
import { openChatURL } from 'state/live-chat/actions'
import GridIcon from 'components/gridicon'

const closeBrowser = ( { dispatch } ) => ( e ) => {
	e.preventDefault()
	dispatch( openChatURL( null ) )
}

const browser = ( { url, dispatch } ) => (
	<div className={ classnames( 'support-browser', { disabled: isEmpty( url ) } ) }>
		<div className="browser-bar">
			{ url }
			<div onClick={ closeBrowser( { dispatch } ) }><GridIcon icon="cross" /></div>
		</div>
		<iframe src={ url } />
	</div>
)

export default connect( ( { liveChat } ) => ( { url: liveChat.supportURL } ) )( browser )
