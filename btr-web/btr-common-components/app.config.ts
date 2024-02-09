export default defineAppConfig({
  ui: {
    primary: 'bcGovBlue',
    gray: 'bcGovGray',
    red: 'bcGovRed',
    button: {
      variant: {
        solid: 'hover:bg-opacity-[.92] hover:bg-{color}-500',
        editButton: 'text-primary border-0 border-r-2 border-gray focus-visible:border-2 focus-visible:border-primary',
        removeButton: 'text-primary border-0 focus-visible:border-2 focus-visible:border-primary'
      }
    },
    formGroup: {
      label: { base: 'block text-base font-bold py-3 text-gray-900' }
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
      rounded: 'rounded-none',
      placeholder: 'text-gray-700',
      option: {
        rounded: 'rounded-none',
        active: 'text-primary-500',
        selected: 'text-primary-500 bg-gray-100',
        icon: {
          active: 'text-primary-500'
        },
        selectedIcon: {
          base: 'text-primary-500'
        }
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
      background: 'bg-gray-700',
      color: 'text-white',
      ring: 'ring-1 ring-gray-700',
      rounded: 'rounded-none',
      base: 'h-auto text-base p-3',
      arrow: {
        base: 'before:w-3 before:h-3',
        ring: 'before:ring-1 before:ring-gray-700',
        background: 'before:bg-gray-700'
      }
    }
  }
})
