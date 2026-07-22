import { useParams } from 'react-router';
import { ExternalRedirect } from './ExternalRedirect';
import { TICKETS_ALL_URL, TICKET_EVENTS } from '../data/ticketLinks';

export function TicketRedirect() {
  const { slug } = useParams();
  const key = slug?.toLowerCase();
  const to = key && TICKET_EVENTS[key] ? TICKET_EVENTS[key] : TICKETS_ALL_URL;
  return (
    <ExternalRedirect
      to={to}
      title="Tickets | SparkPoint"
      description="Purchase tickets for SparkPoint events."
      path="/tickets"
      heading="Opening ticket checkout…"
      body="You’re being sent to SparkPoint’s secure ticket checkout."
      linkText="Continue to ticket checkout"
    />
  );
}
