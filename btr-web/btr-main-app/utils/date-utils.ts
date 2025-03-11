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

export const yearsOfAge = (birthDate: string) => {
  const birthDateObj = new Date(birthDate)
  const today = new Date()
  const age = today.getFullYear() - birthDateObj.getFullYear()
  const monthDiff = today.getMonth() - birthDateObj.getMonth()
  const dayDiff = today.getDate() - birthDateObj.getDate()

  // Adjust age if current month and day are before birth month and day
  return monthDiff < 0 || (monthDiff === 0 && dayDiff < 0) ? age - 1 : age
}

export const isMinor = function (birthDate: string) {
  return yearsOfAge(birthDate) < 19
}
