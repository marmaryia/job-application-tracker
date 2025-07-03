import { VerticalTimeline, VerticalTimelineElement }  from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import type { TEvent } from '../types/eventTypes';


function EventsTimeline({events}: {events: TEvent[]}) {
  return (
    <VerticalTimeline layout={"1-column-right"}>
        {events.map((event) => {
            return <VerticalTimelineElement
            key={event.event_id}
    className="vertical-timeline-element--work"
    contentStyle={{ background: 'rgb(33, 150, 243)', color: '#fff' }}
    contentArrowStyle={{ borderRight: '7px solid  rgb(33, 150, 243)' }}
    date={event.date}
  //iconStyle={{ background: 'rgb(33, 150, 243)', color: '#fff' }}
   // icon={<WorkIcon />}
  >
    <h3 className="vertical-timeline-element-title">{event.title}</h3>
    
    <p>
      {event.notes}
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