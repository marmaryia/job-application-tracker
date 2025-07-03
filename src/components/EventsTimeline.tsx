import { VerticalTimeline, VerticalTimelineElement }  from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import type { TEvent } from '../types/eventTypes';
import { formatIsoTimestamp } from '../utils/dates';


function EventsTimeline({events}: {events: TEvent[]}) {
  return (
    <VerticalTimeline layout={"1-column-right"}>
        {events.map((appEvent) => {
            return <VerticalTimelineElement
            key={ appEvent.event_id}
    className="vertical-timeline-element--work"
    contentStyle={{ background: 'rgb(33, 150, 243)', color: '#fff' }}
    contentArrowStyle={{ borderRight: '7px solid  rgb(33, 150, 243)' }}
     date={formatIsoTimestamp( appEvent.date, false)}
   
  //iconStyle={{ background: 'rgb(33, 150, 243)', color: '#fff' }}
   // icon={<WorkIcon />}
  >
    <h3 className="vertical-timeline-element-title">{appEvent.title}</h3>
    <p>
      {appEvent.notes}
    </p>
  </VerticalTimelineElement>
        })}
  

  <VerticalTimelineElement
    iconStyle={{ background: 'rgb(16, 204, 82)', color: '#fff' }}
    //icon={<StarIcon />}
  />
</VerticalTimeline>
  )
}

export default EventsTimeline