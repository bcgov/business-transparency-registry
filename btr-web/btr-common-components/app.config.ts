export default defineAppConfig({
  ui: {
    primary: 'bcGovBlue',
    gray: 'bcGovGray',
    button: {
      variant: {
        solid: 'hover:bg-opacity-[.92] hover:bg-{color}-500'
      }
    },
    formGroup: {
      label: { base: 'block text-base font-bold py-3 text-gray-900' }
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
    },
    table: {
      th: {
        color: 'text-gray-900'
      }
    },
    radio: {
      border: 'border-gray-500'
    },
    checkbox: {
      wrapper: 'flex items-center',
      border: 'border-gray-500',
      label: 'text-base text-gray-900 ml-2'
    },
    tooltip: {
      wrapper: "relative inline-flex",
      container: "z-20 group",
      width: "max-w-xs",
      background: "bg-gray-700",
      color: "text-white",
      shadow: "shadow",
      rounded: "rounded",
      ring: "ring-1 ring-gray-700",
      base: "[@media(pointer:coarse)]:hidden h-24 px-2 py-1 text-base",
      shortcuts: "hidden md:inline-flex flex-shrink-0 gap-0.5",
      transition: {
        enterActiveClass: "transition ease-out duration-200",
        enterFromClass: "opacity-0 translate-y-1",
        enterToClass: "opacity-100 translate-y-0",
        leaveActiveClass: "transition ease-in duration-150",
        leaveFromClass: "opacity-100 translate-y-0",
        leaveToClass: "opacity-0 translate-y-1"
      },
      arrow: {
        base: "before:w-3 before:h-3",
        ring: "before:ring-1 before:ring-gray-700",
        rounded: "before:rounded-sm",
        background: "before:bg-gray-700",
        shadow: "before:shadow",
        placement: "group-data-[popper-placement*=\"right\"]:-left-1 group-data-[popper-placement*=\"left\"]:-right-1 group-data-[popper-placement*=\"top\"]:-bottom-1 group-data-[popper-placement*=\"bottom\"]:-top-1"
      }
    }
  }
})
