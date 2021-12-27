import React from 'react';
import { Calendar, Views, momentLocalizer } from 'react-big-calendar';

import moment from 'moment';
const localizer = momentLocalizer(moment);

let Resource = ({
  data,
  onSelect,
  onRangeChange,
}: {
  data: any;
  onSelect: Function;
  onRangeChange: Function;
}) => (
  <Calendar
    events={data?.events}
    localizer={localizer}
    defaultView={Views.MONTH}
    views={['month']}
    step={30}
    startAccessor="start"
    endAccessor="end"
    style={{ height: 700 }}
    defaultDate={new Date()}
    onSelectEvent={(data) => onSelect(data)}
    resources={data?.resourceMap}
    resourceIdAccessor="resourceId"
    resourceTitleAccessor="resourceTitle"
    popup={true}
    onRangeChange={(data) => {
      onRangeChange(data);
    }}
    eventPropGetter={(event) => {
      const backgroundColor = event.color;
      return { style: { backgroundColor, padding: '5px 10px' } };
    }}
  />
);

export default Resource;
