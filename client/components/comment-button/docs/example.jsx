/**
 * External dependencies
 */
import React from 'react';

/**
 * Internal dependencies
 */
import CommentButton from 'components/comment-button';
import Card from 'components/card';

const CommentButtonExample = () => (
	<div className="design-assets__group">
		<h2>
			<a href="/devdocs/app-components/comment-button">Comment Buttons</a>
		</h2>
		<Card>
			<span>No comments:</span>
			<CommentButton commentCount={ 0 } />
		</Card>
		<Card>
			<span>With comments:</span>
			<CommentButton commentCount={ 42 } />
		</Card>
	</div>
);

export default CommentButtonExample;
