export default defineAppConfig({
  ui: {
    primary: 'bcGovBlue',
    gray: 'bcGovGray',
    input: {
      rounded: 'rounded-none',
      variant: {
        bcGov: 'bg-gray-100 border-b-2 focus:ring-0'
      }
    },
    select: {
      rounded: 'rounded-none',
      variant: {
        bcGov: 'bg-gray-100 border-b-2 focus:ring-0'
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
        bcGov: 'bg-gray-100 border-b-2 focus:ring-0 text-gray-900'
      }
    }
  }
})
