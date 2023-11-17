export default defineAppConfig({
  ui: {
    primary: 'bcGovBlue',
    gray: 'bcGovGray',
    formGroup: {
      label: { base: 'block text-base font-bold py-3 text-black-700 dark:text-black-200' }
    },
    input: {
      rounded: 'rounded-none',
      variant: {
        bcGov: 'bg-gray-100 h-12 border-b-2 focus:ring-0'
      }
    },
    select: {
      rounded: 'rounded-none',
      variant: {
        bcGov: 'bg-gray-100 h-12 border-b-2 border-b-gray-500 focus:ring-0'
      }
    },
    selectMenu: {
      rounded: 'rounded-none',
      option: {
        rounded: 'rounded-none text-gray-900'
      },
      variant: {
        bcGov: 'bg-gray-100 border-b-2 focus:ring-0 text-gray-900'
      }
    },
    textarea: {
      rounded: 'rounded-none',
      variant: {
        bcGov: 'bg-gray-100 border-b-2 h-20 focus:ring-0 text-gray-900'
      }
    }
  }
})
