// import eventRouter from './event.route'
// import ticketRouter from './ticket.route'
import userRoute from './user.route'
import authRoute from './auth.route'

export const routes = [
  { path: '/auth', router: authRoute},
  { path: '/users', router: userRoute }
  // { path: '/api/events', router: eventRouter },
  // { path: '/api/tickets', router: ticketRouter }
]
