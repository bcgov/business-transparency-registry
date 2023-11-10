import type { Config } from 'tailwindcss'

export default <Partial<Config>>{
  theme: {
    extend: {
      colors: {
        bcGovColor: {
          // these colors are as defined in styleguide:
          // https://preview.uxpin.com/73eb31e6346bc2863a066f02218a3af289325619#/pages/138840439/simulate/sitemap?mode=i
          // for more details see previous link
          // last updated on (2023-10-16)
          // PRIMARY COLOURS
          footer: '#003366',
          header: '#003366',
          navDivider: '#FCBA19',
          // LINK COLOURS
          activeBlue: '#1669BB',
          // TEXT/NON-CLICKABLE COLOURS
          darkGray: '#212529',
          midGray: '#495057',
          lightGray: '#757575',
          nonClickable: '#38598A',
          // BACKGROUND COLOURS
          white: '#FFFFFF',
          gray1: '#F1F3F5',
          gray2: '#E2E8EE',
          lightBlue: '#E4EDF7',
          // LINES
          hairlinesOnWhite: '#DEE2E6',
          specialityDottedLines: '#899EB2',
          formFieldLines: '#6F7780',
          // RESULT COLOURS
          caution: '#F8661A', // use on Caution Icon or Large 19px bold+ text only (on white backgrounds only). Not for small text.
          error: '#d3272c' // ok for error text or icons)

        },
        outcomes: {
          approved: '#2E8540',
          error: '#D3272C',
          caution: '#F8661A' // caution icon or large text
        },
        // aka "gray"... nuxt-ui renames gray to cool
        // due to the fact that it is using gray itself
        // so, we need to set bcGray and apply it to the gray in nuxt-ui
        bcGovGray: {
          50: '#f8f9fa',
          100: '#f1f3f5',
          200: '#e9ecef',
          300: '#dee2e6',
          400: '#ced4da',
          500: '#adb5bd',
          600: '#868e96',
          700: '#495057',
          800: '#343a40',
          900: '#212529'
        },
        bcGovBlue: {
          50: '#e0e7ed',
          100: '#b3c2d1',
          200: '#8099b3',
          300: '#4d7094',
          350: '#38598a',
          400: '#26527d',
          500: '#1669bb', // '#003366',
          600: '#002e5e',
          700: '#002753',
          800: '#002049',
          900: '#001438'
        }
      }
    }
  }
}
