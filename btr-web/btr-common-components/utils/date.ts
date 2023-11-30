import moment from 'moment'

/**  Return the date string in the desired format */
export function displayDate (date: Date, format?: string) {
  return (date) ? moment(date).local().format(format || 'YYYY-MM-DD') : ''
}
