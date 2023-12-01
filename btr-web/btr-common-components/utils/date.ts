import moment from 'moment'

/** Return the date string in the desired format */
export function dateToString (date: Date, format?: string) {
  // default format: YYYY-MM-DDT:HH:mm:ss+-HH:mm
  return (date) ? moment(date).local().format(format) : ''
}

/** Return the date string in date format from datetime string format */
export function datetimeStringToDateString (dateString: string) {
  // expecting dateString in the following format: YYYY-MM-DDT:HH:mm:ss+-HH:mm
  const date = new Date(dateString)
  // convert to date and back so that it returns correctly for the timezone
  return (date) ? moment(date).local().format('YYYY-MM-DD') : ''
}
