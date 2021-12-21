import React from 'react';
import { Calendar, Views, momentLocalizer } from 'react-big-calendar';

import moment from 'moment';
const localizer = momentLocalizer(moment);

let Resource = ({ data, onSelect }: { data: any; onSelect: Function }) => (
  <Calendar
    events={data?.events}
    localizer={localizer}
    defaultView={Views.MONTH}
    views={['work_week', 'month']}
    step={30}
    startAccessor="start"
    endAccessor="end"
    style={{ height: 700 }}
    defaultDate={new Date(Date.now())}
    onSelectEvent={(data) => onSelect(data)}
    resources={data?.resourceMap}
    resourceIdAccessor="resourceId"
    resourceTitleAccessor="resourceTitle"
    popup={true}
  />
);

export default Resource;
