export function debounce (func: Function, timeout = 250) {
  let timer: string | number | NodeJS.Timeout | undefined
  return (...args: any) => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      // @ts-ignore
      func.apply(this, args)
    }, timeout)
  }
}

// example
// function saveInput(){
//   console.log('Saving data');
// }
// const processChange = debounce(() => saveInput());
