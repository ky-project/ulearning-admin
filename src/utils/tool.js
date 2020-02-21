export const isEmpty = function(a) {
  if (a === undefined || a === null) {
    return true
  } else if (typeof a === 'string' && a.trim() === '') {
    return true
  // eslint-disable-next-line no-self-compare
  } else if (a !== a) {
    return true
  } else if (a.constructor.name === 'Array' && a.length === 0) {
    return true
  } else if (a instanceof Object && Object.keys(a).length === 0) {
    return true
  } else {
    return false
  }
}
