/**
 * External dependencies
 */
import React from 'react';
import Button from 'components/button';

/**
 * Internal dependencies
 */
import { localize } from 'i18n-calypso';
import Gridicon from 'components/gridicon';
import Card from 'components/card';
import analytics from 'lib/analytics';

export default localize( ( props ) => {
	const {
		date,
		registrationUrl,
		isBusinessPlanUser,
		translate
	} = props;

	const trackRegistrationClick = () => {
		analytics.tracks.recordEvent( 'calypso_help_course_registration_click', { registrationUrl, isBusinessPlanUser } );
	};

	return (
		<Card compact className="help-courses__course-schedule-item">
			<p className="help-courses__course-schedule-item-date">
				<Gridicon className="help-courses__course-schedule-item-icon" icon="time" size={ 18 } />
				{
					translate( '%(date)s at %(time)s', {
						args: {
							date: date.format( 'dddd, MMMM D' ),
							time: date.format( 'LT zz' )
						}
					} )
				}
			</p>
			<div className="help-courses__course-schedule-item-buttons">
				{ isBusinessPlanUser
					? ( <Button className="help-courses__course-schedule-item-register-button"
						onClick={ trackRegistrationClick }
						target="_blank"
						rel="noopener noreferrer"
						href={ registrationUrl }>
						{ translate( 'Register' ) }
					</Button> )
					: ( <div className="help-courses__course-schedule-item-businessplan-button">
						{ translate( 'Only on Business Plan' ) }
					</div> )
				}
			</div>
		</Card>
	);
} );
