export const formatDate = function (date: string, includeTime?: boolean) {
  let options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }
  if (typeof includeTime !== 'boolean' || includeTime === true) {
    options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      timeZoneName: 'long'
    }
  }
  return new Date(date).toLocaleDateString('en-US', options)
}
