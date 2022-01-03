import React from 'react';
import { Calendar, Views, momentLocalizer } from 'react-big-calendar';
import { BookingEvent } from '@/interfaces/index';
import moment from 'moment';
const localizer = momentLocalizer(moment);

const Resource = ({
  data,
  onSelect,
  onRangeChange,
}: {
  data: any;
  onSelect: (event: any) => void;
  onRangeChange: (dateRanges: any) => void;
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
    eventPropGetter={(event: BookingEvent) => {
      return {
        style: {
          backgroundColor: event.color,
          padding: '5px 10px',
          fontSize: '14px',
        },
      };
    }}
  />
);

export default Resource;
