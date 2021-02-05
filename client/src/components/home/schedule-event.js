import React from 'react';
import { getFormattedTime } from '../../functions/util';
import './schedule-event.scss';

class ScheduleEvent extends React.Component {
    render() {
        return (
            <div className="ScheduleEvent" onClick={this.props.onClick}>
                <div className={'event-type event-type-' + this.props.event.type}></div>
                <div className="event-time">{getFormattedTime(this.props.event)}</div>
                <div className="event-club-name">{this.props.event.club}</div>
                <div className="event-name">{this.props.event.name}</div>
            </div>
        );
    }
}

export default ScheduleEvent;
