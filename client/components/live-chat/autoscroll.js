const debug = require( 'debug' )( 'calypso:live-chat:autoscroll' );

export default {
	componentWillMount() {
		this._autoscroll_enabled = true;
		window.addEventListener( 'resize', this.scrollToBottom );
		this.scrollToBottom();
	},

	componentWillUnmount() {
		window.removeEventListener( 'resize', this.scrollToBottom );
		this._autoscroll_stop_listening();
	},

	componentDidUpdate() {
		this.scrollToBottom();
	},

	setupAutoscroll( node ) {
		this._autoscroll_stop_listening();
		this._autoscroll_node = node;

		if ( !this._autoscroll_node ) {
			return;
		}

		debug( 'start listening', this._autoscroll_node );
		this._autoscroll_node.addEventListener( 'scroll', this._autoscroll_detectScroll );
	},

	_autoscroll_stop_listening() {
		if ( ! this._autoscroll_node ) {
			return;
		}
		debug( 'stop listening', this._autoscroll_node );
		this._autoscroll_node.removeEventListener( 'scroll', this._autoscroll_detectScroll );
	},

	scrollToBottom() {
		debug( 'scroll it' );
		if ( ! this._autoscroll_enabled ) {
			return;
		}
		if ( ! this._autoscroll_node ) {
			return;
		}
		const { scrollHeight, offsetHeight } = this._autoscroll_node;
		this._autoscroll_node.scrollTop = Math.max( 0, scrollHeight - offsetHeight );
	},

	_autoscroll_detectScroll() {
		if ( ! this._autoscroll_node ) {
			return;
		}

		const { scrollTop, offsetHeight, scrollHeight } = this._autoscroll_node;
		const enable = scrollTop + offsetHeight >= scrollHeight;
		if ( this._autoscroll_enabled !== enable ) {
			this._autoscroll_enabled = enable;
			debug( 'flip autoscroll', enable );
		}
	}
};
