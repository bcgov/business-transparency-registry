export default defineAppConfig({
  ui: {
    primary: 'blue',
    gray: 'bcGovGray',
    red: 'red',
    button: {
      variant: {
        ghost: 'hover:bg-inherit',
        solid: 'hover:bg-opacity-[.92] hover:bg-{color}-500',
        combobox: 'bg-gray-100 hover:bg-gray-200 border-b-[1px] rounded-none rounded-t-md'
      }
    },
    formGroup: {
      label: { base: 'block text-base font-bold py-3 text-gray-900' },
      help: 'ml-2 text-gray-700'
    },
    input: {
      base: 'bg-gray-100 hover:bg-gray-200 h-[56px] border-b-[1px] focus:border-b-2 focus:ring-0',
      rounded: 'rounded-none rounded-t-md',
      variant: {
        bcGov: 'border-gray-700 placeholder-gray-700 focus:border-primary-500 focus:placeholder-primary-500',
        error: 'border-red-500 focus:border-red-500 placeholder-red-500 focus:placeholder-red-500',
        primary: 'border-primary-500 placeholder-primary-500 border-b-2'
      }
    },
    select: {
      base: 'bg-gray-100 hover:bg-gray-200 h-[56px] border-b-[1px] focus:border-b-2 focus:ring-0',
      rounded: 'rounded-none rounded-t-md',
      variant: {
        bcGov: 'border-gray-700',
        error: 'border-red-500'
      },
      icon: {
        base: 'text-gray-700'
      }
    },
    selectMenu: {
      label: 'text-gray-700',
      rounded: 'rounded-none',
      input: 'bg-gray-100 text-gray-700 placeholder-primary h-10 -mt-2 border-b-[1.5px] border-b-primary',
      popper: { offsetDistance: '0', placement: 'bottom-start', locked: true },
      base: 'overflow-x-hidden',
      padding: 'p-0',
      ring: 'ring-0',
      option: {
        rounded: 'rounded-none',
        active: 'text-primary-500',
        selected: 'text-primary-500 bg-gray-100 pe-0',
        container: 'w-full',
        icon: {
          active: 'text-primary-500'
        },
        selectedIcon: {
          base: 'text-primary-500'
        },
        empty: 'text-gray-700'
      }
    },
    textarea: {
      base: 'bg-gray-100 hover:bg-gray-200 border-b-[1px] focus:border-b-2 h-20 focus:ring-0 text-gray-900',
      rounded: 'rounded-none rounded-t-md',
      variant: {
        bcGov: 'border-gray-700 placeholder-gray-700 focus:border-primary-500 focus:placeholder-primary-500',
        error: 'border-red-500 focus:border-red-500 placeholder-red-500 focus:placeholder-red-500'
      }
    },
    table: {
      th: {
        color: 'text-gray-900'
      },
      td: {
        base: 'align-text-top whitespace-normal',
        color: 'text-gray-700'
      }
    },
    radio: {
      border: 'border-gray-500'
    },
    checkbox: {
      wrapper: 'flex items-start',
      base: 'mt-1 mr-2',
      border: 'border-gray-500',
      label: 'text-base text-gray-900'
    },
    tooltip: {
      base: 'h-full p-3',
      background: 'bg-gray-700',
      color: 'text-white',
      ring: 'ring-0',
      width: 'max-w-none',
      arrow: {
        ring: 'before:ring-0',
        background: 'before:bg-gray-700'
      }
    }
  }
})
