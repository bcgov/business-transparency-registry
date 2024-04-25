import { BtrCountrySubdivisionI } from '~/interfaces/btr-address-i'

export interface Iso3166_1Country {
  alpha_2: string
  alpha_3: string
  flag: string
  name: string
  numeric: string
  official_name?: string
  common_name?: string
}

export const isoCountriesList: Array<Iso3166_1Country> = [
  {
    alpha_2: 'AW',
    alpha_3: 'ABW',
    flag: '🇦🇼',
    name: 'Aruba',
    numeric: '533'
  },
  {
    alpha_2: 'AF',
    alpha_3: 'AFG',
    flag: '🇦🇫',
    name: 'Afghanistan',
    numeric: '004',
    official_name: 'Islamic Republic of Afghanistan'
  },
  {
    alpha_2: 'AO',
    alpha_3: 'AGO',
    flag: '🇦🇴',
    name: 'Angola',
    numeric: '024',
    official_name: 'Republic of Angola'
  },
  {
    alpha_2: 'AI',
    alpha_3: 'AIA',
    flag: '🇦🇮',
    name: 'Anguilla',
    numeric: '660'
  },
  {
    alpha_2: 'AX',
    alpha_3: 'ALA',
    flag: '🇦🇽',
    name: 'Åland Islands',
    numeric: '248'
  },
  {
    alpha_2: 'AL',
    alpha_3: 'ALB',
    flag: '🇦🇱',
    name: 'Albania',
    numeric: '008',
    official_name: 'Republic of Albania'
  },
  {
    alpha_2: 'AD',
    alpha_3: 'AND',
    flag: '🇦🇩',
    name: 'Andorra',
    numeric: '020',
    official_name: 'Principality of Andorra'
  },
  {
    alpha_2: 'AE',
    alpha_3: 'ARE',
    flag: '🇦🇪',
    name: 'United Arab Emirates',
    numeric: '784'
  },
  {
    alpha_2: 'AR',
    alpha_3: 'ARG',
    flag: '🇦🇷',
    name: 'Argentina',
    numeric: '032',
    official_name: 'Argentine Republic'
  },
  {
    alpha_2: 'AM',
    alpha_3: 'ARM',
    flag: '🇦🇲',
    name: 'Armenia',
    numeric: '051',
    official_name: 'Republic of Armenia'
  },
  {
    alpha_2: 'AS',
    alpha_3: 'ASM',
    flag: '🇦🇸',
    name: 'American Samoa',
    numeric: '016'
  },
  {
    alpha_2: 'AQ',
    alpha_3: 'ATA',
    flag: '🇦🇶',
    name: 'Antarctica',
    numeric: '010'
  },
  {
    alpha_2: 'TF',
    alpha_3: 'ATF',
    flag: '🇹🇫',
    name: 'French Southern Territories',
    numeric: '260'
  },
  {
    alpha_2: 'AG',
    alpha_3: 'ATG',
    flag: '🇦🇬',
    name: 'Antigua and Barbuda',
    numeric: '028'
  },
  {
    alpha_2: 'AU',
    alpha_3: 'AUS',
    flag: '🇦🇺',
    name: 'Australia',
    numeric: '036'
  },
  {
    alpha_2: 'AT',
    alpha_3: 'AUT',
    flag: '🇦🇹',
    name: 'Austria',
    numeric: '040',
    official_name: 'Republic of Austria'
  },
  {
    alpha_2: 'AZ',
    alpha_3: 'AZE',
    flag: '🇦🇿',
    name: 'Azerbaijan',
    numeric: '031',
    official_name: 'Republic of Azerbaijan'
  },
  {
    alpha_2: 'BI',
    alpha_3: 'BDI',
    flag: '🇧🇮',
    name: 'Burundi',
    numeric: '108',
    official_name: 'Republic of Burundi'
  },
  {
    alpha_2: 'BE',
    alpha_3: 'BEL',
    flag: '🇧🇪',
    name: 'Belgium',
    numeric: '056',
    official_name: 'Kingdom of Belgium'
  },
  {
    alpha_2: 'BJ',
    alpha_3: 'BEN',
    flag: '🇧🇯',
    name: 'Benin',
    numeric: '204',
    official_name: 'Republic of Benin'
  },
  {
    alpha_2: 'BQ',
    alpha_3: 'BES',
    flag: '🇧🇶',
    name: 'Bonaire, Sint Eustatius and Saba',
    numeric: '535',
    official_name: 'Bonaire, Sint Eustatius and Saba'
  },
  {
    alpha_2: 'BF',
    alpha_3: 'BFA',
    flag: '🇧🇫',
    name: 'Burkina Faso',
    numeric: '854'
  },
  {
    alpha_2: 'BD',
    alpha_3: 'BGD',
    flag: '🇧🇩',
    name: 'Bangladesh',
    numeric: '050',
    official_name: "People's Republic of Bangladesh"
  },
  {
    alpha_2: 'BG',
    alpha_3: 'BGR',
    flag: '🇧🇬',
    name: 'Bulgaria',
    numeric: '100',
    official_name: 'Republic of Bulgaria'
  },
  {
    alpha_2: 'BH',
    alpha_3: 'BHR',
    flag: '🇧🇭',
    name: 'Bahrain',
    numeric: '048',
    official_name: 'Kingdom of Bahrain'
  },
  {
    alpha_2: 'BS',
    alpha_3: 'BHS',
    flag: '🇧🇸',
    name: 'Bahamas',
    numeric: '044',
    official_name: 'Commonwealth of the Bahamas'
  },
  {
    alpha_2: 'BA',
    alpha_3: 'BIH',
    flag: '🇧🇦',
    name: 'Bosnia and Herzegovina',
    numeric: '070',
    official_name: 'Republic of Bosnia and Herzegovina'
  },
  {
    alpha_2: 'BL',
    alpha_3: 'BLM',
    flag: '🇧🇱',
    name: 'Saint Barthélemy',
    numeric: '652'
  },
  {
    alpha_2: 'BY',
    alpha_3: 'BLR',
    flag: '🇧🇾',
    name: 'Belarus',
    numeric: '112',
    official_name: 'Republic of Belarus'
  },
  {
    alpha_2: 'BZ',
    alpha_3: 'BLZ',
    flag: '🇧🇿',
    name: 'Belize',
    numeric: '084'
  },
  {
    alpha_2: 'BM',
    alpha_3: 'BMU',
    flag: '🇧🇲',
    name: 'Bermuda',
    numeric: '060'
  },
  {
    alpha_2: 'BO',
    alpha_3: 'BOL',
    common_name: 'Bolivia',
    flag: '🇧🇴',
    name: 'Bolivia, Plurinational State of',
    numeric: '068',
    official_name: 'Plurinational State of Bolivia'
  },
  {
    alpha_2: 'BR',
    alpha_3: 'BRA',
    flag: '🇧🇷',
    name: 'Brazil',
    numeric: '076',
    official_name: 'Federative Republic of Brazil'
  },
  {
    alpha_2: 'BB',
    alpha_3: 'BRB',
    flag: '🇧🇧',
    name: 'Barbados',
    numeric: '052'
  },
  {
    alpha_2: 'BN',
    alpha_3: 'BRN',
    flag: '🇧🇳',
    name: 'Brunei Darussalam',
    numeric: '096'
  },
  {
    alpha_2: 'BT',
    alpha_3: 'BTN',
    flag: '🇧🇹',
    name: 'Bhutan',
    numeric: '064',
    official_name: 'Kingdom of Bhutan'
  },
  {
    alpha_2: 'BV',
    alpha_3: 'BVT',
    flag: '🇧🇻',
    name: 'Bouvet Island',
    numeric: '074'
  },
  {
    alpha_2: 'BW',
    alpha_3: 'BWA',
    flag: '🇧🇼',
    name: 'Botswana',
    numeric: '072',
    official_name: 'Republic of Botswana'
  },
  {
    alpha_2: 'CF',
    alpha_3: 'CAF',
    flag: '🇨🇫',
    name: 'Central African Republic',
    numeric: '140'
  },
  {
    alpha_2: 'CA',
    alpha_3: 'CAN',
    flag: '🇨🇦',
    name: 'Canada',
    numeric: '124'
  },
  {
    alpha_2: 'CC',
    alpha_3: 'CCK',
    flag: '🇨🇨',
    name: 'Cocos (Keeling) Islands',
    numeric: '166'
  },
  {
    alpha_2: 'CH',
    alpha_3: 'CHE',
    flag: '🇨🇭',
    name: 'Switzerland',
    numeric: '756',
    official_name: 'Swiss Confederation'
  },
  {
    alpha_2: 'CL',
    alpha_3: 'CHL',
    flag: '🇨🇱',
    name: 'Chile',
    numeric: '152',
    official_name: 'Republic of Chile'
  },
  {
    alpha_2: 'CN',
    alpha_3: 'CHN',
    flag: '🇨🇳',
    name: 'China',
    numeric: '156',
    official_name: "People's Republic of China"
  },
  {
    alpha_2: 'CI',
    alpha_3: 'CIV',
    flag: '🇨🇮',
    name: "Côte d'Ivoire",
    numeric: '384',
    official_name: "Republic of Côte d'Ivoire"
  },
  {
    alpha_2: 'CM',
    alpha_3: 'CMR',
    flag: '🇨🇲',
    name: 'Cameroon',
    numeric: '120',
    official_name: 'Republic of Cameroon'
  },
  {
    alpha_2: 'CD',
    alpha_3: 'COD',
    flag: '🇨🇩',
    name: 'Congo, The Democratic Republic of the',
    numeric: '180'
  },
  {
    alpha_2: 'CG',
    alpha_3: 'COG',
    flag: '🇨🇬',
    name: 'Congo',
    numeric: '178',
    official_name: 'Republic of the Congo'
  },
  {
    alpha_2: 'CK',
    alpha_3: 'COK',
    flag: '🇨🇰',
    name: 'Cook Islands',
    numeric: '184'
  },
  {
    alpha_2: 'CO',
    alpha_3: 'COL',
    flag: '🇨🇴',
    name: 'Colombia',
    numeric: '170',
    official_name: 'Republic of Colombia'
  },
  {
    alpha_2: 'KM',
    alpha_3: 'COM',
    flag: '🇰🇲',
    name: 'Comoros',
    numeric: '174',
    official_name: 'Union of the Comoros'
  },
  {
    alpha_2: 'CV',
    alpha_3: 'CPV',
    flag: '🇨🇻',
    name: 'Cabo Verde',
    numeric: '132',
    official_name: 'Republic of Cabo Verde'
  },
  {
    alpha_2: 'CR',
    alpha_3: 'CRI',
    flag: '🇨🇷',
    name: 'Costa Rica',
    numeric: '188',
    official_name: 'Republic of Costa Rica'
  },
  {
    alpha_2: 'CU',
    alpha_3: 'CUB',
    flag: '🇨🇺',
    name: 'Cuba',
    numeric: '192',
    official_name: 'Republic of Cuba'
  },
  {
    alpha_2: 'CW',
    alpha_3: 'CUW',
    flag: '🇨🇼',
    name: 'Curaçao',
    numeric: '531',
    official_name: 'Curaçao'
  },
  {
    alpha_2: 'CX',
    alpha_3: 'CXR',
    flag: '🇨🇽',
    name: 'Christmas Island',
    numeric: '162'
  },
  {
    alpha_2: 'KY',
    alpha_3: 'CYM',
    flag: '🇰🇾',
    name: 'Cayman Islands',
    numeric: '136'
  },
  {
    alpha_2: 'CY',
    alpha_3: 'CYP',
    flag: '🇨🇾',
    name: 'Cyprus',
    numeric: '196',
    official_name: 'Republic of Cyprus'
  },
  {
    alpha_2: 'CZ',
    alpha_3: 'CZE',
    flag: '🇨🇿',
    name: 'Czechia',
    numeric: '203',
    official_name: 'Czech Republic'
  },
  {
    alpha_2: 'DE',
    alpha_3: 'DEU',
    flag: '🇩🇪',
    name: 'Germany',
    numeric: '276',
    official_name: 'Federal Republic of Germany'
  },
  {
    alpha_2: 'DJ',
    alpha_3: 'DJI',
    flag: '🇩🇯',
    name: 'Djibouti',
    numeric: '262',
    official_name: 'Republic of Djibouti'
  },
  {
    alpha_2: 'DM',
    alpha_3: 'DMA',
    flag: '🇩🇲',
    name: 'Dominica',
    numeric: '212',
    official_name: 'Commonwealth of Dominica'
  },
  {
    alpha_2: 'DK',
    alpha_3: 'DNK',
    flag: '🇩🇰',
    name: 'Denmark',
    numeric: '208',
    official_name: 'Kingdom of Denmark'
  },
  {
    alpha_2: 'DO',
    alpha_3: 'DOM',
    flag: '🇩🇴',
    name: 'Dominican Republic',
    numeric: '214'
  },
  {
    alpha_2: 'DZ',
    alpha_3: 'DZA',
    flag: '🇩🇿',
    name: 'Algeria',
    numeric: '012',
    official_name: "People's Democratic Republic of Algeria"
  },
  {
    alpha_2: 'EC',
    alpha_3: 'ECU',
    flag: '🇪🇨',
    name: 'Ecuador',
    numeric: '218',
    official_name: 'Republic of Ecuador'
  },
  {
    alpha_2: 'EG',
    alpha_3: 'EGY',
    flag: '🇪🇬',
    name: 'Egypt',
    numeric: '818',
    official_name: 'Arab Republic of Egypt'
  },
  {
    alpha_2: 'ER',
    alpha_3: 'ERI',
    flag: '🇪🇷',
    name: 'Eritrea',
    numeric: '232',
    official_name: 'the State of Eritrea'
  },
  {
    alpha_2: 'EH',
    alpha_3: 'ESH',
    flag: '🇪🇭',
    name: 'Western Sahara',
    numeric: '732'
  },
  {
    alpha_2: 'ES',
    alpha_3: 'ESP',
    flag: '🇪🇸',
    name: 'Spain',
    numeric: '724',
    official_name: 'Kingdom of Spain'
  },
  {
    alpha_2: 'EE',
    alpha_3: 'EST',
    flag: '🇪🇪',
    name: 'Estonia',
    numeric: '233',
    official_name: 'Republic of Estonia'
  },
  {
    alpha_2: 'ET',
    alpha_3: 'ETH',
    flag: '🇪🇹',
    name: 'Ethiopia',
    numeric: '231',
    official_name: 'Federal Democratic Republic of Ethiopia'
  },
  {
    alpha_2: 'FI',
    alpha_3: 'FIN',
    flag: '🇫🇮',
    name: 'Finland',
    numeric: '246',
    official_name: 'Republic of Finland'
  },
  {
    alpha_2: 'FJ',
    alpha_3: 'FJI',
    flag: '🇫🇯',
    name: 'Fiji',
    numeric: '242',
    official_name: 'Republic of Fiji'
  },
  {
    alpha_2: 'FK',
    alpha_3: 'FLK',
    flag: '🇫🇰',
    name: 'Falkland Islands (Malvinas)',
    numeric: '238'
  },
  {
    alpha_2: 'FR',
    alpha_3: 'FRA',
    flag: '🇫🇷',
    name: 'France',
    numeric: '250',
    official_name: 'French Republic'
  },
  {
    alpha_2: 'FO',
    alpha_3: 'FRO',
    flag: '🇫🇴',
    name: 'Faroe Islands',
    numeric: '234'
  },
  {
    alpha_2: 'FM',
    alpha_3: 'FSM',
    flag: '🇫🇲',
    name: 'Micronesia, Federated States of',
    numeric: '583',
    official_name: 'Federated States of Micronesia'
  },
  {
    alpha_2: 'GA',
    alpha_3: 'GAB',
    flag: '🇬🇦',
    name: 'Gabon',
    numeric: '266',
    official_name: 'Gabonese Republic'
  },
  {
    alpha_2: 'GB',
    alpha_3: 'GBR',
    flag: '🇬🇧',
    name: 'United Kingdom',
    numeric: '826',
    official_name: 'United Kingdom of Great Britain and Northern Ireland'
  },
  {
    alpha_2: 'GE',
    alpha_3: 'GEO',
    flag: '🇬🇪',
    name: 'Georgia',
    numeric: '268'
  },
  {
    alpha_2: 'GG',
    alpha_3: 'GGY',
    flag: '🇬🇬',
    name: 'Guernsey',
    numeric: '831'
  },
  {
    alpha_2: 'GH',
    alpha_3: 'GHA',
    flag: '🇬🇭',
    name: 'Ghana',
    numeric: '288',
    official_name: 'Republic of Ghana'
  },
  {
    alpha_2: 'GI',
    alpha_3: 'GIB',
    flag: '🇬🇮',
    name: 'Gibraltar',
    numeric: '292'
  },
  {
    alpha_2: 'GN',
    alpha_3: 'GIN',
    flag: '🇬🇳',
    name: 'Guinea',
    numeric: '324',
    official_name: 'Republic of Guinea'
  },
  {
    alpha_2: 'GP',
    alpha_3: 'GLP',
    flag: '🇬🇵',
    name: 'Guadeloupe',
    numeric: '312'
  },
  {
    alpha_2: 'GM',
    alpha_3: 'GMB',
    flag: '🇬🇲',
    name: 'Gambia',
    numeric: '270',
    official_name: 'Republic of the Gambia'
  },
  {
    alpha_2: 'GW',
    alpha_3: 'GNB',
    flag: '🇬🇼',
    name: 'Guinea-Bissau',
    numeric: '624',
    official_name: 'Republic of Guinea-Bissau'
  },
  {
    alpha_2: 'GQ',
    alpha_3: 'GNQ',
    flag: '🇬🇶',
    name: 'Equatorial Guinea',
    numeric: '226',
    official_name: 'Republic of Equatorial Guinea'
  },
  {
    alpha_2: 'GR',
    alpha_3: 'GRC',
    flag: '🇬🇷',
    name: 'Greece',
    numeric: '300',
    official_name: 'Hellenic Republic'
  },
  {
    alpha_2: 'GD',
    alpha_3: 'GRD',
    flag: '🇬🇩',
    name: 'Grenada',
    numeric: '308'
  },
  {
    alpha_2: 'GL',
    alpha_3: 'GRL',
    flag: '🇬🇱',
    name: 'Greenland',
    numeric: '304'
  },
  {
    alpha_2: 'GT',
    alpha_3: 'GTM',
    flag: '🇬🇹',
    name: 'Guatemala',
    numeric: '320',
    official_name: 'Republic of Guatemala'
  },
  {
    alpha_2: 'GF',
    alpha_3: 'GUF',
    flag: '🇬🇫',
    name: 'French Guiana',
    numeric: '254'
  },
  {
    alpha_2: 'GU',
    alpha_3: 'GUM',
    flag: '🇬🇺',
    name: 'Guam',
    numeric: '316'
  },
  {
    alpha_2: 'GY',
    alpha_3: 'GUY',
    flag: '🇬🇾',
    name: 'Guyana',
    numeric: '328',
    official_name: 'Republic of Guyana'
  },
  {
    alpha_2: 'HK',
    alpha_3: 'HKG',
    flag: '🇭🇰',
    name: 'Hong Kong',
    numeric: '344',
    official_name: 'Hong Kong Special Administrative Region of China'
  },
  {
    alpha_2: 'HM',
    alpha_3: 'HMD',
    flag: '🇭🇲',
    name: 'Heard Island and McDonald Islands',
    numeric: '334'
  },
  {
    alpha_2: 'HN',
    alpha_3: 'HND',
    flag: '🇭🇳',
    name: 'Honduras',
    numeric: '340',
    official_name: 'Republic of Honduras'
  },
  {
    alpha_2: 'HR',
    alpha_3: 'HRV',
    flag: '🇭🇷',
    name: 'Croatia',
    numeric: '191',
    official_name: 'Republic of Croatia'
  },
  {
    alpha_2: 'HT',
    alpha_3: 'HTI',
    flag: '🇭🇹',
    name: 'Haiti',
    numeric: '332',
    official_name: 'Republic of Haiti'
  },
  {
    alpha_2: 'HU',
    alpha_3: 'HUN',
    flag: '🇭🇺',
    name: 'Hungary',
    numeric: '348',
    official_name: 'Hungary'
  },
  {
    alpha_2: 'ID',
    alpha_3: 'IDN',
    flag: '🇮🇩',
    name: 'Indonesia',
    numeric: '360',
    official_name: 'Republic of Indonesia'
  },
  {
    alpha_2: 'IM',
    alpha_3: 'IMN',
    flag: '🇮🇲',
    name: 'Isle of Man',
    numeric: '833'
  },
  {
    alpha_2: 'IN',
    alpha_3: 'IND',
    flag: '🇮🇳',
    name: 'India',
    numeric: '356',
    official_name: 'Republic of India'
  },
  {
    alpha_2: 'IO',
    alpha_3: 'IOT',
    flag: '🇮🇴',
    name: 'British Indian Ocean Territory',
    numeric: '086'
  },
  {
    alpha_2: 'IE',
    alpha_3: 'IRL',
    flag: '🇮🇪',
    name: 'Ireland',
    numeric: '372'
  },
  {
    alpha_2: 'IR',
    alpha_3: 'IRN',
    flag: '🇮🇷',
    name: 'Iran, Islamic Republic of',
    numeric: '364',
    official_name: 'Islamic Republic of Iran'
  },
  {
    alpha_2: 'IQ',
    alpha_3: 'IRQ',
    flag: '🇮🇶',
    name: 'Iraq',
    numeric: '368',
    official_name: 'Republic of Iraq'
  },
  {
    alpha_2: 'IS',
    alpha_3: 'ISL',
    flag: '🇮🇸',
    name: 'Iceland',
    numeric: '352',
    official_name: 'Republic of Iceland'
  },
  {
    alpha_2: 'IL',
    alpha_3: 'ISR',
    flag: '🇮🇱',
    name: 'Israel',
    numeric: '376',
    official_name: 'State of Israel'
  },
  {
    alpha_2: 'IT',
    alpha_3: 'ITA',
    flag: '🇮🇹',
    name: 'Italy',
    numeric: '380',
    official_name: 'Italian Republic'
  },
  {
    alpha_2: 'JM',
    alpha_3: 'JAM',
    flag: '🇯🇲',
    name: 'Jamaica',
    numeric: '388'
  },
  {
    alpha_2: 'JE',
    alpha_3: 'JEY',
    flag: '🇯🇪',
    name: 'Jersey',
    numeric: '832'
  },
  {
    alpha_2: 'JO',
    alpha_3: 'JOR',
    flag: '🇯🇴',
    name: 'Jordan',
    numeric: '400',
    official_name: 'Hashemite Kingdom of Jordan'
  },
  {
    alpha_2: 'JP',
    alpha_3: 'JPN',
    flag: '🇯🇵',
    name: 'Japan',
    numeric: '392'
  },
  {
    alpha_2: 'KZ',
    alpha_3: 'KAZ',
    flag: '🇰🇿',
    name: 'Kazakhstan',
    numeric: '398',
    official_name: 'Republic of Kazakhstan'
  },
  {
    alpha_2: 'KE',
    alpha_3: 'KEN',
    flag: '🇰🇪',
    name: 'Kenya',
    numeric: '404',
    official_name: 'Republic of Kenya'
  },
  {
    alpha_2: 'KG',
    alpha_3: 'KGZ',
    flag: '🇰🇬',
    name: 'Kyrgyzstan',
    numeric: '417',
    official_name: 'Kyrgyz Republic'
  },
  {
    alpha_2: 'KH',
    alpha_3: 'KHM',
    flag: '🇰🇭',
    name: 'Cambodia',
    numeric: '116',
    official_name: 'Kingdom of Cambodia'
  },
  {
    alpha_2: 'KI',
    alpha_3: 'KIR',
    flag: '🇰🇮',
    name: 'Kiribati',
    numeric: '296',
    official_name: 'Republic of Kiribati'
  },
  {
    alpha_2: 'KN',
    alpha_3: 'KNA',
    flag: '🇰🇳',
    name: 'Saint Kitts and Nevis',
    numeric: '659'
  },
  {
    alpha_2: 'KR',
    alpha_3: 'KOR',
    common_name: 'South Korea',
    flag: '🇰🇷',
    name: 'Korea, Republic of',
    numeric: '410'
  },
  {
    alpha_2: 'KW',
    alpha_3: 'KWT',
    flag: '🇰🇼',
    name: 'Kuwait',
    numeric: '414',
    official_name: 'State of Kuwait'
  },
  {
    alpha_2: 'LA',
    alpha_3: 'LAO',
    flag: '🇱🇦',
    name: "Lao People's Democratic Republic",
    numeric: '418'
  },
  {
    alpha_2: 'LB',
    alpha_3: 'LBN',
    flag: '🇱🇧',
    name: 'Lebanon',
    numeric: '422',
    official_name: 'Lebanese Republic'
  },
  {
    alpha_2: 'LR',
    alpha_3: 'LBR',
    flag: '🇱🇷',
    name: 'Liberia',
    numeric: '430',
    official_name: 'Republic of Liberia'
  },
  {
    alpha_2: 'LY',
    alpha_3: 'LBY',
    flag: '🇱🇾',
    name: 'Libya',
    numeric: '434',
    official_name: 'Libya'
  },
  {
    alpha_2: 'LC',
    alpha_3: 'LCA',
    flag: '🇱🇨',
    name: 'Saint Lucia',
    numeric: '662'
  },
  {
    alpha_2: 'LI',
    alpha_3: 'LIE',
    flag: '🇱🇮',
    name: 'Liechtenstein',
    numeric: '438',
    official_name: 'Principality of Liechtenstein'
  },
  {
    alpha_2: 'LK',
    alpha_3: 'LKA',
    flag: '🇱🇰',
    name: 'Sri Lanka',
    numeric: '144',
    official_name: 'Democratic Socialist Republic of Sri Lanka'
  },
  {
    alpha_2: 'LS',
    alpha_3: 'LSO',
    flag: '🇱🇸',
    name: 'Lesotho',
    numeric: '426',
    official_name: 'Kingdom of Lesotho'
  },
  {
    alpha_2: 'LT',
    alpha_3: 'LTU',
    flag: '🇱🇹',
    name: 'Lithuania',
    numeric: '440',
    official_name: 'Republic of Lithuania'
  },
  {
    alpha_2: 'LU',
    alpha_3: 'LUX',
    flag: '🇱🇺',
    name: 'Luxembourg',
    numeric: '442',
    official_name: 'Grand Duchy of Luxembourg'
  },
  {
    alpha_2: 'LV',
    alpha_3: 'LVA',
    flag: '🇱🇻',
    name: 'Latvia',
    numeric: '428',
    official_name: 'Republic of Latvia'
  },
  {
    alpha_2: 'MO',
    alpha_3: 'MAC',
    flag: '🇲🇴',
    name: 'Macao',
    numeric: '446',
    official_name: 'Macao Special Administrative Region of China'
  },
  {
    alpha_2: 'MF',
    alpha_3: 'MAF',
    flag: '🇲🇫',
    name: 'Saint Martin (French part)',
    numeric: '663'
  },
  {
    alpha_2: 'MA',
    alpha_3: 'MAR',
    flag: '🇲🇦',
    name: 'Morocco',
    numeric: '504',
    official_name: 'Kingdom of Morocco'
  },
  {
    alpha_2: 'MC',
    alpha_3: 'MCO',
    flag: '🇲🇨',
    name: 'Monaco',
    numeric: '492',
    official_name: 'Principality of Monaco'
  },
  {
    alpha_2: 'MD',
    alpha_3: 'MDA',
    common_name: 'Moldova',
    flag: '🇲🇩',
    name: 'Moldova, Republic of',
    numeric: '498',
    official_name: 'Republic of Moldova'
  },
  {
    alpha_2: 'MG',
    alpha_3: 'MDG',
    flag: '🇲🇬',
    name: 'Madagascar',
    numeric: '450',
    official_name: 'Republic of Madagascar'
  },
  {
    alpha_2: 'MV',
    alpha_3: 'MDV',
    flag: '🇲🇻',
    name: 'Maldives',
    numeric: '462',
    official_name: 'Republic of Maldives'
  },
  {
    alpha_2: 'MX',
    alpha_3: 'MEX',
    flag: '🇲🇽',
    name: 'Mexico',
    numeric: '484',
    official_name: 'United Mexican States'
  },
  {
    alpha_2: 'MH',
    alpha_3: 'MHL',
    flag: '🇲🇭',
    name: 'Marshall Islands',
    numeric: '584',
    official_name: 'Republic of the Marshall Islands'
  },
  {
    alpha_2: 'MK',
    alpha_3: 'MKD',
    flag: '🇲🇰',
    name: 'North Macedonia',
    numeric: '807',
    official_name: 'Republic of North Macedonia'
  },
  {
    alpha_2: 'ML',
    alpha_3: 'MLI',
    flag: '🇲🇱',
    name: 'Mali',
    numeric: '466',
    official_name: 'Republic of Mali'
  },
  {
    alpha_2: 'MT',
    alpha_3: 'MLT',
    flag: '🇲🇹',
    name: 'Malta',
    numeric: '470',
    official_name: 'Republic of Malta'
  },
  {
    alpha_2: 'MM',
    alpha_3: 'MMR',
    flag: '🇲🇲',
    name: 'Myanmar',
    numeric: '104',
    official_name: 'Republic of Myanmar'
  },
  {
    alpha_2: 'ME',
    alpha_3: 'MNE',
    flag: '🇲🇪',
    name: 'Montenegro',
    numeric: '499',
    official_name: 'Montenegro'
  },
  {
    alpha_2: 'MN',
    alpha_3: 'MNG',
    flag: '🇲🇳',
    name: 'Mongolia',
    numeric: '496'
  },
  {
    alpha_2: 'MP',
    alpha_3: 'MNP',
    flag: '🇲🇵',
    name: 'Northern Mariana Islands',
    numeric: '580',
    official_name: 'Commonwealth of the Northern Mariana Islands'
  },
  {
    alpha_2: 'MZ',
    alpha_3: 'MOZ',
    flag: '🇲🇿',
    name: 'Mozambique',
    numeric: '508',
    official_name: 'Republic of Mozambique'
  },
  {
    alpha_2: 'MR',
    alpha_3: 'MRT',
    flag: '🇲🇷',
    name: 'Mauritania',
    numeric: '478',
    official_name: 'Islamic Republic of Mauritania'
  },
  {
    alpha_2: 'MS',
    alpha_3: 'MSR',
    flag: '🇲🇸',
    name: 'Montserrat',
    numeric: '500'
  },
  {
    alpha_2: 'MQ',
    alpha_3: 'MTQ',
    flag: '🇲🇶',
    name: 'Martinique',
    numeric: '474'
  },
  {
    alpha_2: 'MU',
    alpha_3: 'MUS',
    flag: '🇲🇺',
    name: 'Mauritius',
    numeric: '480',
    official_name: 'Republic of Mauritius'
  },
  {
    alpha_2: 'MW',
    alpha_3: 'MWI',
    flag: '🇲🇼',
    name: 'Malawi',
    numeric: '454',
    official_name: 'Republic of Malawi'
  },
  {
    alpha_2: 'MY',
    alpha_3: 'MYS',
    flag: '🇲🇾',
    name: 'Malaysia',
    numeric: '458'
  },
  {
    alpha_2: 'YT',
    alpha_3: 'MYT',
    flag: '🇾🇹',
    name: 'Mayotte',
    numeric: '175'
  },
  {
    alpha_2: 'NA',
    alpha_3: 'NAM',
    flag: '🇳🇦',
    name: 'Namibia',
    numeric: '516',
    official_name: 'Republic of Namibia'
  },
  {
    alpha_2: 'NC',
    alpha_3: 'NCL',
    flag: '🇳🇨',
    name: 'New Caledonia',
    numeric: '540'
  },
  {
    alpha_2: 'NE',
    alpha_3: 'NER',
    flag: '🇳🇪',
    name: 'Niger',
    numeric: '562',
    official_name: 'Republic of the Niger'
  },
  {
    alpha_2: 'NF',
    alpha_3: 'NFK',
    flag: '🇳🇫',
    name: 'Norfolk Island',
    numeric: '574'
  },
  {
    alpha_2: 'NG',
    alpha_3: 'NGA',
    flag: '🇳🇬',
    name: 'Nigeria',
    numeric: '566',
    official_name: 'Federal Republic of Nigeria'
  },
  {
    alpha_2: 'NI',
    alpha_3: 'NIC',
    flag: '🇳🇮',
    name: 'Nicaragua',
    numeric: '558',
    official_name: 'Republic of Nicaragua'
  },
  {
    alpha_2: 'NU',
    alpha_3: 'NIU',
    flag: '🇳🇺',
    name: 'Niue',
    numeric: '570',
    official_name: 'Niue'
  },
  {
    alpha_2: 'NL',
    alpha_3: 'NLD',
    flag: '🇳🇱',
    name: 'Netherlands',
    numeric: '528',
    official_name: 'Kingdom of the Netherlands'
  },
  {
    alpha_2: 'NO',
    alpha_3: 'NOR',
    flag: '🇳🇴',
    name: 'Norway',
    numeric: '578',
    official_name: 'Kingdom of Norway'
  },
  {
    alpha_2: 'NP',
    alpha_3: 'NPL',
    flag: '🇳🇵',
    name: 'Nepal',
    numeric: '524',
    official_name: 'Federal Democratic Republic of Nepal'
  },
  {
    alpha_2: 'NR',
    alpha_3: 'NRU',
    flag: '🇳🇷',
    name: 'Nauru',
    numeric: '520',
    official_name: 'Republic of Nauru'
  },
  {
    alpha_2: 'NZ',
    alpha_3: 'NZL',
    flag: '🇳🇿',
    name: 'New Zealand',
    numeric: '554'
  },
  {
    alpha_2: 'OM',
    alpha_3: 'OMN',
    flag: '🇴🇲',
    name: 'Oman',
    numeric: '512',
    official_name: 'Sultanate of Oman'
  },
  {
    alpha_2: 'PK',
    alpha_3: 'PAK',
    flag: '🇵🇰',
    name: 'Pakistan',
    numeric: '586',
    official_name: 'Islamic Republic of Pakistan'
  },
  {
    alpha_2: 'PA',
    alpha_3: 'PAN',
    flag: '🇵🇦',
    name: 'Panama',
    numeric: '591',
    official_name: 'Republic of Panama'
  },
  {
    alpha_2: 'PN',
    alpha_3: 'PCN',
    flag: '🇵🇳',
    name: 'Pitcairn',
    numeric: '612'
  },
  {
    alpha_2: 'PE',
    alpha_3: 'PER',
    flag: '🇵🇪',
    name: 'Peru',
    numeric: '604',
    official_name: 'Republic of Peru'
  },
  {
    alpha_2: 'PH',
    alpha_3: 'PHL',
    flag: '🇵🇭',
    name: 'Philippines',
    numeric: '608',
    official_name: 'Republic of the Philippines'
  },
  {
    alpha_2: 'PW',
    alpha_3: 'PLW',
    flag: '🇵🇼',
    name: 'Palau',
    numeric: '585',
    official_name: 'Republic of Palau'
  },
  {
    alpha_2: 'PG',
    alpha_3: 'PNG',
    flag: '🇵🇬',
    name: 'Papua New Guinea',
    numeric: '598',
    official_name: 'Independent State of Papua New Guinea'
  },
  {
    alpha_2: 'PL',
    alpha_3: 'POL',
    flag: '🇵🇱',
    name: 'Poland',
    numeric: '616',
    official_name: 'Republic of Poland'
  },
  {
    alpha_2: 'PR',
    alpha_3: 'PRI',
    flag: '🇵🇷',
    name: 'Puerto Rico',
    numeric: '630'
  },
  {
    alpha_2: 'KP',
    alpha_3: 'PRK',
    common_name: 'North Korea',
    flag: '🇰🇵',
    name: "Korea, Democratic People's Republic of",
    numeric: '408',
    official_name: "Democratic People's Republic of Korea"
  },
  {
    alpha_2: 'PT',
    alpha_3: 'PRT',
    flag: '🇵🇹',
    name: 'Portugal',
    numeric: '620',
    official_name: 'Portuguese Republic'
  },
  {
    alpha_2: 'PY',
    alpha_3: 'PRY',
    flag: '🇵🇾',
    name: 'Paraguay',
    numeric: '600',
    official_name: 'Republic of Paraguay'
  },
  {
    alpha_2: 'PS',
    alpha_3: 'PSE',
    flag: '🇵🇸',
    name: 'Palestine, State of',
    numeric: '275',
    official_name: 'the State of Palestine'
  },
  {
    alpha_2: 'PF',
    alpha_3: 'PYF',
    flag: '🇵🇫',
    name: 'French Polynesia',
    numeric: '258'
  },
  {
    alpha_2: 'QA',
    alpha_3: 'QAT',
    flag: '🇶🇦',
    name: 'Qatar',
    numeric: '634',
    official_name: 'State of Qatar'
  },
  {
    alpha_2: 'RE',
    alpha_3: 'REU',
    flag: '🇷🇪',
    name: 'Réunion',
    numeric: '638'
  },
  {
    alpha_2: 'RO',
    alpha_3: 'ROU',
    flag: '🇷🇴',
    name: 'Romania',
    numeric: '642'
  },
  {
    alpha_2: 'RU',
    alpha_3: 'RUS',
    flag: '🇷🇺',
    name: 'Russian Federation',
    numeric: '643'
  },
  {
    alpha_2: 'RW',
    alpha_3: 'RWA',
    flag: '🇷🇼',
    name: 'Rwanda',
    numeric: '646',
    official_name: 'Rwandese Republic'
  },
  {
    alpha_2: 'SA',
    alpha_3: 'SAU',
    flag: '🇸🇦',
    name: 'Saudi Arabia',
    numeric: '682',
    official_name: 'Kingdom of Saudi Arabia'
  },
  {
    alpha_2: 'SD',
    alpha_3: 'SDN',
    flag: '🇸🇩',
    name: 'Sudan',
    numeric: '729',
    official_name: 'Republic of the Sudan'
  },
  {
    alpha_2: 'SN',
    alpha_3: 'SEN',
    flag: '🇸🇳',
    name: 'Senegal',
    numeric: '686',
    official_name: 'Republic of Senegal'
  },
  {
    alpha_2: 'SG',
    alpha_3: 'SGP',
    flag: '🇸🇬',
    name: 'Singapore',
    numeric: '702',
    official_name: 'Republic of Singapore'
  },
  {
    alpha_2: 'GS',
    alpha_3: 'SGS',
    flag: '🇬🇸',
    name: 'South Georgia and the South Sandwich Islands',
    numeric: '239'
  },
  {
    alpha_2: 'SH',
    alpha_3: 'SHN',
    flag: '🇸🇭',
    name: 'Saint Helena, Ascension and Tristan da Cunha',
    numeric: '654'
  },
  {
    alpha_2: 'SJ',
    alpha_3: 'SJM',
    flag: '🇸🇯',
    name: 'Svalbard and Jan Mayen',
    numeric: '744'
  },
  {
    alpha_2: 'SB',
    alpha_3: 'SLB',
    flag: '🇸🇧',
    name: 'Solomon Islands',
    numeric: '090'
  },
  {
    alpha_2: 'SL',
    alpha_3: 'SLE',
    flag: '🇸🇱',
    name: 'Sierra Leone',
    numeric: '694',
    official_name: 'Republic of Sierra Leone'
  },
  {
    alpha_2: 'SV',
    alpha_3: 'SLV',
    flag: '🇸🇻',
    name: 'El Salvador',
    numeric: '222',
    official_name: 'Republic of El Salvador'
  },
  {
    alpha_2: 'SM',
    alpha_3: 'SMR',
    flag: '🇸🇲',
    name: 'San Marino',
    numeric: '674',
    official_name: 'Republic of San Marino'
  },
  {
    alpha_2: 'SO',
    alpha_3: 'SOM',
    flag: '🇸🇴',
    name: 'Somalia',
    numeric: '706',
    official_name: 'Federal Republic of Somalia'
  },
  {
    alpha_2: 'PM',
    alpha_3: 'SPM',
    flag: '🇵🇲',
    name: 'Saint Pierre and Miquelon',
    numeric: '666'
  },
  {
    alpha_2: 'RS',
    alpha_3: 'SRB',
    flag: '🇷🇸',
    name: 'Serbia',
    numeric: '688',
    official_name: 'Republic of Serbia'
  },
  {
    alpha_2: 'SS',
    alpha_3: 'SSD',
    flag: '🇸🇸',
    name: 'South Sudan',
    numeric: '728',
    official_name: 'Republic of South Sudan'
  },
  {
    alpha_2: 'ST',
    alpha_3: 'STP',
    flag: '🇸🇹',
    name: 'Sao Tome and Principe',
    numeric: '678',
    official_name: 'Democratic Republic of Sao Tome and Principe'
  },
  {
    alpha_2: 'SR',
    alpha_3: 'SUR',
    flag: '🇸🇷',
    name: 'Suriname',
    numeric: '740',
    official_name: 'Republic of Suriname'
  },
  {
    alpha_2: 'SK',
    alpha_3: 'SVK',
    flag: '🇸🇰',
    name: 'Slovakia',
    numeric: '703',
    official_name: 'Slovak Republic'
  },
  {
    alpha_2: 'SI',
    alpha_3: 'SVN',
    flag: '🇸🇮',
    name: 'Slovenia',
    numeric: '705',
    official_name: 'Republic of Slovenia'
  },
  {
    alpha_2: 'SE',
    alpha_3: 'SWE',
    flag: '🇸🇪',
    name: 'Sweden',
    numeric: '752',
    official_name: 'Kingdom of Sweden'
  },
  {
    alpha_2: 'SZ',
    alpha_3: 'SWZ',
    flag: '🇸🇿',
    name: 'Eswatini',
    numeric: '748',
    official_name: 'Kingdom of Eswatini'
  },
  {
    alpha_2: 'SX',
    alpha_3: 'SXM',
    flag: '🇸🇽',
    name: 'Sint Maarten (Dutch part)',
    numeric: '534',
    official_name: 'Sint Maarten (Dutch part)'
  },
  {
    alpha_2: 'SC',
    alpha_3: 'SYC',
    flag: '🇸🇨',
    name: 'Seychelles',
    numeric: '690',
    official_name: 'Republic of Seychelles'
  },
  {
    alpha_2: 'SY',
    alpha_3: 'SYR',
    flag: '🇸🇾',
    name: 'Syrian Arab Republic',
    numeric: '760'
  },
  {
    alpha_2: 'TC',
    alpha_3: 'TCA',
    flag: '🇹🇨',
    name: 'Turks and Caicos Islands',
    numeric: '796'
  },
  {
    alpha_2: 'TD',
    alpha_3: 'TCD',
    flag: '🇹🇩',
    name: 'Chad',
    numeric: '148',
    official_name: 'Republic of Chad'
  },
  {
    alpha_2: 'TG',
    alpha_3: 'TGO',
    flag: '🇹🇬',
    name: 'Togo',
    numeric: '768',
    official_name: 'Togolese Republic'
  },
  {
    alpha_2: 'TH',
    alpha_3: 'THA',
    flag: '🇹🇭',
    name: 'Thailand',
    numeric: '764',
    official_name: 'Kingdom of Thailand'
  },
  {
    alpha_2: 'TJ',
    alpha_3: 'TJK',
    flag: '🇹🇯',
    name: 'Tajikistan',
    numeric: '762',
    official_name: 'Republic of Tajikistan'
  },
  {
    alpha_2: 'TK',
    alpha_3: 'TKL',
    flag: '🇹🇰',
    name: 'Tokelau',
    numeric: '772'
  },
  {
    alpha_2: 'TM',
    alpha_3: 'TKM',
    flag: '🇹🇲',
    name: 'Turkmenistan',
    numeric: '795'
  },
  {
    alpha_2: 'TL',
    alpha_3: 'TLS',
    flag: '🇹🇱',
    name: 'Timor-Leste',
    numeric: '626',
    official_name: 'Democratic Republic of Timor-Leste'
  },
  {
    alpha_2: 'TO',
    alpha_3: 'TON',
    flag: '🇹🇴',
    name: 'Tonga',
    numeric: '776',
    official_name: 'Kingdom of Tonga'
  },
  {
    alpha_2: 'TT',
    alpha_3: 'TTO',
    flag: '🇹🇹',
    name: 'Trinidad and Tobago',
    numeric: '780',
    official_name: 'Republic of Trinidad and Tobago'
  },
  {
    alpha_2: 'TN',
    alpha_3: 'TUN',
    flag: '🇹🇳',
    name: 'Tunisia',
    numeric: '788',
    official_name: 'Republic of Tunisia'
  },
  {
    alpha_2: 'TR',
    alpha_3: 'TUR',
    flag: '🇹🇷',
    name: 'Turkey',
    numeric: '792',
    official_name: 'Republic of Turkey'
  },
  {
    alpha_2: 'TV',
    alpha_3: 'TUV',
    flag: '🇹🇻',
    name: 'Tuvalu',
    numeric: '798'
  },
  {
    alpha_2: 'TW',
    alpha_3: 'TWN',
    common_name: 'Taiwan',
    flag: '🇹🇼',
    name: 'Taiwan, Province of China',
    numeric: '158',
    official_name: 'Taiwan, Province of China'
  },
  {
    alpha_2: 'TZ',
    alpha_3: 'TZA',
    common_name: 'Tanzania',
    flag: '🇹🇿',
    name: 'Tanzania, United Republic of',
    numeric: '834',
    official_name: 'United Republic of Tanzania'
  },
  {
    alpha_2: 'UG',
    alpha_3: 'UGA',
    flag: '🇺🇬',
    name: 'Uganda',
    numeric: '800',
    official_name: 'Republic of Uganda'
  },
  {
    alpha_2: 'UA',
    alpha_3: 'UKR',
    flag: '🇺🇦',
    name: 'Ukraine',
    numeric: '804'
  },
  {
    alpha_2: 'UM',
    alpha_3: 'UMI',
    flag: '🇺🇲',
    name: 'United States Minor Outlying Islands',
    numeric: '581'
  },
  {
    alpha_2: 'UY',
    alpha_3: 'URY',
    flag: '🇺🇾',
    name: 'Uruguay',
    numeric: '858',
    official_name: 'Eastern Republic of Uruguay'
  },
  {
    alpha_2: 'US',
    alpha_3: 'USA',
    flag: '🇺🇸',
    name: 'United States',
    numeric: '840',
    official_name: 'United States of America'
  },
  {
    alpha_2: 'UZ',
    alpha_3: 'UZB',
    flag: '🇺🇿',
    name: 'Uzbekistan',
    numeric: '860',
    official_name: 'Republic of Uzbekistan'
  },
  {
    alpha_2: 'VA',
    alpha_3: 'VAT',
    flag: '🇻🇦',
    name: 'Holy See (Vatican City State)',
    numeric: '336'
  },
  {
    alpha_2: 'VC',
    alpha_3: 'VCT',
    flag: '🇻🇨',
    name: 'Saint Vincent and the Grenadines',
    numeric: '670'
  },
  {
    alpha_2: 'VE',
    alpha_3: 'VEN',
    common_name: 'Venezuela',
    flag: '🇻🇪',
    name: 'Venezuela, Bolivarian Republic of',
    numeric: '862',
    official_name: 'Bolivarian Republic of Venezuela'
  },
  {
    alpha_2: 'VG',
    alpha_3: 'VGB',
    flag: '🇻🇬',
    name: 'Virgin Islands, British',
    numeric: '092',
    official_name: 'British Virgin Islands'
  },
  {
    alpha_2: 'VI',
    alpha_3: 'VIR',
    flag: '🇻🇮',
    name: 'Virgin Islands, U.S.',
    numeric: '850',
    official_name: 'Virgin Islands of the United States'
  },
  {
    alpha_2: 'VN',
    alpha_3: 'VNM',
    common_name: 'Vietnam',
    flag: '🇻🇳',
    name: 'Viet Nam',
    numeric: '704',
    official_name: 'Socialist Republic of Viet Nam'
  },
  {
    alpha_2: 'VU',
    alpha_3: 'VUT',
    flag: '🇻🇺',
    name: 'Vanuatu',
    numeric: '548',
    official_name: 'Republic of Vanuatu'
  },
  {
    alpha_2: 'WF',
    alpha_3: 'WLF',
    flag: '🇼🇫',
    name: 'Wallis and Futuna',
    numeric: '876'
  },
  {
    alpha_2: 'WS',
    alpha_3: 'WSM',
    flag: '🇼🇸',
    name: 'Samoa',
    numeric: '882',
    official_name: 'Independent State of Samoa'
  },
  {
    alpha_2: 'YE',
    alpha_3: 'YEM',
    flag: '🇾🇪',
    name: 'Yemen',
    numeric: '887',
    official_name: 'Republic of Yemen'
  },
  {
    alpha_2: 'ZA',
    alpha_3: 'ZAF',
    flag: '🇿🇦',
    name: 'South Africa',
    numeric: '710',
    official_name: 'Republic of South Africa'
  },
  {
    alpha_2: 'ZM',
    alpha_3: 'ZMB',
    flag: '🇿🇲',
    name: 'Zambia',
    numeric: '894',
    official_name: 'Republic of Zambia'
  },
  {
    alpha_2: 'ZW',
    alpha_3: 'ZWE',
    flag: '🇿🇼',
    name: 'Zimbabwe',
    numeric: '716',
    official_name: 'Republic of Zimbabwe'
  }
]

// canada
const subdivisionsCa: BtrCountrySubdivisionI[] = [
  { code: 'AB', name: 'Alberta' },
  { code: 'BC', name: 'British Columbia' },
  { code: 'MB', name: 'Manitoba' },
  { code: 'NB', name: 'New Brunswick' },
  { code: 'NL', name: 'Newfoundland and Labrador' },
  { code: 'NT', name: 'Northwest Territories' },
  { code: 'NS', name: 'Nova Scotia' },
  { code: 'NU', name: 'Nunavut' },
  { code: 'ON', name: 'Ontario' },
  { code: 'PE', name: 'Prince Edward Island' },
  { code: 'QC', name: 'Quebec' },
  { code: 'SK', name: 'Saskatchewan' },
  { code: 'YT', name: 'Yukon' }
]

// us
const subdivisionsUs: BtrCountrySubdivisionI[] = [
  { name: 'Alabama', code: 'AL' },
  { name: 'Alaska', code: 'AK' },
  { name: 'American Samoa', code: 'AS' },
  { name: 'Arizona', code: 'AZ' },
  { name: 'Arkansas', code: 'AR' },
  { name: 'California', code: 'CA' },
  { name: 'Colorado', code: 'CO' },
  { name: 'Connecticut', code: 'CT' },
  { name: 'Delaware', code: 'DE' },
  { name: 'District of Columbia', code: 'DC' },
  { name: 'Federated States of Micronesia', code: 'FM' },
  { name: 'Florida', code: 'FL' },
  { name: 'Georgia', code: 'GA' },
  { name: 'Guam', code: 'GU' },
  { name: 'Hawaii', code: 'HI' },
  { name: 'Idaho', code: 'ID' },
  { name: 'Illinois', code: 'IL' },
  { name: 'Indiana', code: 'IN' },
  { name: 'Iowa', code: 'IA' },
  { name: 'Kansas', code: 'KS' },
  { name: 'Kentucky', code: 'KY' },
  { name: 'Louisiana', code: 'LA' },
  { name: 'Maine', code: 'ME' },
  { name: 'Marshall Islands', code: 'MH' },
  { name: 'Maryland', code: 'MD' },
  { name: 'Massachusetts', code: 'MA' },
  { name: 'Michigan', code: 'MI' },
  { name: 'Minnesota', code: 'MN' },
  { name: 'Mississippi', code: 'MS' },
  { name: 'Missouri', code: 'MO' },
  { name: 'Montana', code: 'MT' },
  { name: 'Nebraska', code: 'NE' },
  { name: 'Nevada', code: 'NV' },
  { name: 'New Hampshire', code: 'NH' },
  { name: 'New Jersey', code: 'NJ' },
  { name: 'New Mexico', code: 'NM' },
  { name: 'New York', code: 'NY' },
  { name: 'North Carolina', code: 'NC' },
  { name: 'North Dakota', code: 'ND' },
  { name: 'Northern Mariana Islands', code: 'MP' },
  { name: 'Ohio', code: 'OH' },
  { name: 'Oklahoma', code: 'OK' },
  { name: 'Oregon', code: 'OR' },
  { name: 'Palau', code: 'PW' },
  { name: 'Pennsylvania', code: 'PA' },
  { name: 'Puerto Rico', code: 'PR' },
  { name: 'Rhode Island', code: 'RI' },
  { name: 'South Carolina', code: 'SC' },
  { name: 'South Dakota', code: 'SD' },
  { name: 'Tennessee', code: 'TN' },
  { name: 'Texas', code: 'TX' },
  { name: 'Utah', code: 'UT' },
  { name: 'Vermont', code: 'VT' },
  { name: 'Virgin Islands', code: 'VI' },
  { name: 'Virginia', code: 'VA' },
  { name: 'Washington', code: 'WA' },
  { name: 'West Virginia', code: 'WV' },
  { name: 'Wisconsin', code: 'WI' },
  { name: 'Wyoming', code: 'WY' }
]
export const countrySubdivisions = {
  ca: subdivisionsCa,
  us: subdivisionsUs
}
export const iscCountriesListSortedByName = isoCountriesList.toSorted(
  (c1, c2) => {
    if (c1.name < c2.name) {
      return -1
    }
    if (c1 > c2) {
      return 1
    }
    return 0
  }
)

// three options that will be placed on the top of the citizenship dropdown menu
const canadaUS: Array<BtrCountryI> = [
  { name: 'Canada (Citizen)', alpha_2: 'CA' },
  { name: 'Canada (Permanent Resident)', alpha_2: 'CA_PR' },
  { name: 'United States', alpha_2: 'US' }
]

const otherCountries: Array<BtrCountryI> = iscCountriesListSortedByName.filter(
  country => country.alpha_2 !== 'CA' && country.alpha_2 !== 'US'
)

export const citizenshipOptions = canadaUS.concat(otherCountries)
