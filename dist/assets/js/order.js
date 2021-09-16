window.xrocket = window.xrocket || {};

function initCountryAndStateSelect($country, $state) {
  var opts = [];
  for (var code in countryData) {
    var label = countryData[code];
    opts.push(`<option value="${code}">${label}</option>`);;
  }
  $country.innerHTML = opts.join('');

  function refreshStates($state, countryCode) {
    var states = stateData[countryCode];
    if (states) {
      var stateOpts = [];
      for (var code in states) {
        var label = states[code];
        stateOpts.push(`<option value="${code}">${label}</option>`);
      }      
      $state.style.display = 'block';
      $state.innerHTML = stateOpts.join('');
    } else {
      $state.style.display = 'none';
    }
  }
  refreshStates($state, 'US');

  $country.onchange = function (e) {
    refreshStates($state, e.target.value)
  }
}

function validateFormField($input, errorMsg, pattern) {
  var isError = false;

  var value = $input.value.trim();
  if (!pattern) { // 默认检查空
    if (!value) {
      isError = true;
    }
  } else if (pattern instanceof RegExp) {
    if (!pattern.test(value)) {
      isError = true;
    }
  }

  var $error = $input.parentNode.querySelector('.validation-error');
  if ($error) $error.remove();
  $input.style['border-color'] = "#d9d9d9";
  if (isError) {
    $input.parentNode.appendChild(createNodeFromHtml(errorMsg, 'validation-error'));
    $input.style['border-color'] = "red";
  }

  $input.focus();

  return {
    isError: isError,
    value: value, 
  }
}

var ORDER_ENUM = {
  status: {
    1: '待支付',
    2: '已支付',
  },
  shippingMethod: {
    1: {
      label: 'Shipping - UPS Home Delivery®',
      amount: 38.00
    },
    2: {
      label: 'Shipping - Fedex Home Delivery® (Slow)',
      amount: 47.00
    },
  },
  billingAddressType: {
    1: 'Same as shipping address',
    2: 'Use a different billing address',
  }
};

var countryData = {
  US: 'United States',
  CA: 'Canada',
  GB: 'United Kingdom',
  DE: 'Germany',
  AF: 'Afghanistan',
  AX: 'Ålan Islands',
  AL: 'Albania',
  DZ: 'Algeria',
  AD: 'Andorra',
  AO: 'Angola',
  AI: 'Anguilla',
  AG: 'Antigua &amp Barbuda',
  AR: 'Argentina',
  AM: 'Armenia',
  AW: 'Aruba',
  AC: 'Ascension Island">Ascensio',
  AU: 'Australia',
  AT: 'Austria',
  AZ: 'Azerbaijan',
  BS: 'Bahamas',
  BH: 'Bahrain',
  BD: 'Bangladesh',
  BB: 'Barbados',
  BY: 'Belarus',
  BE: 'Belgium',
  BZ: 'Belize',
  BJ: 'Benin',
  BM: 'Bermuda',
  BT: 'Bhutan',
  BO: 'Bolivia',
  BA: 'Bosnia &amp Herzegovina',
  BW: 'Botswana',
  BR: 'Brazil',
  IO: 'British Indian Ocean Territory',
  VG: 'Virgin Islands, British',
  BN: 'Brunei',
  BG: 'Bulgaria',
  BF: 'Burkina Faso',
  BI: 'Burundi',
  KH: 'Cambodia',
  CM: 'Republic of Cameroon',
  CV: 'Cape Verde',
  BQ: 'Caribbean Netherlands',
  KY: 'Cayman Islands',
  CF: 'Central African Republic',
  TD: 'Chad',
  CL: 'Chile',
  CN: 'China',
  CX: 'Christmas Island',
  CC: 'Cocos (Keeling) Islands',
  CO: 'Colombia',
  KM: 'Comoros',
  CG: 'Congo',
  CD: 'Congo - Kinshasa',
  CK: 'Cook Islands',
  CR: 'Costa Rica',
  HR: 'Croatia',
  CW: 'Curaçao',
  CY: 'Cyprus',
  CZ: 'Czech Republic',
  CI: 'Côte d\'Ivoire',
  DK: 'Denmark',
  DJ: 'Djibouti',
  DM: 'Dominica',
  DO: 'Dominican Republic',
  EC: 'Ecuador',
  EG: 'Egypt',
  SV: 'El Salvador',
  GQ: 'Equatorial Guinea',
  ER: 'Eritrea',
  EE: 'Estonia',
  SZ: 'Eswatini',
  ET: 'Ethiopia',
  FK: 'Falkland Islands (Malvinas)',
  FO: 'Faroe Islands',
  FJ: 'Fiji',
  FI: 'Finland',
  FR: 'France',
  GF: 'French Guiana',
  PF: 'French Polynesia',
  TF: 'French Southern Territories',
  GA: 'Gabon',
  GM: 'Gambia',
  GE: 'Georgia',
  GH: 'Ghana',
  GI: 'Gibraltar',
  GR: 'Greece',
  GL: 'Greenland',
  GD: 'Grenada',
  GP: 'Guadeloupe',
  GT: 'Guatemala',
  GG: 'Guernsey',
  GN: 'Guinea',
  GW: 'Guinea Bissau',
  GY: 'Guyana',
  HT: 'Haiti',
  HN: 'Honduras',
  HK: 'Hong Kong',
  HU: 'Hungary',
  IS: 'Iceland',
  IN: 'India',
  ID: 'Indonesia',
  IQ: 'Iraq',
  IE: 'Ireland',
  IM: 'Isle Of Man',
  IL: 'Israel',
  IT: 'Italy',
  JM: 'Jamaica',
  JP: 'Japan',
  JE: 'Jersey',
  JO: 'Jordan',
  KZ: 'Kazakhstan',
  KE: 'Kenya',
  KI: 'Kiribati',
  XK: 'Kosovo',
  KW: 'Kuwait',
  KG: 'Kyrgyzstan',
  LA: 'Lao People\'s Democratic Republic',
  LV: 'Latvia',
  LB: 'Lebanon',
  LS: 'Lesotho',
  LR: 'Liberia',
  LY: 'Libyan Arab Jamahiriya',
  LI: 'Liechtenstein',
  LT: 'Lithuania',
  LU: 'Luxembourg',
  MO: 'Macao',
  MG: 'Madagascar',
  MW: 'Malawi',
  MY: 'Malaysia',
  MV: 'Maldives',
  ML: 'Mali',
  MT: 'Malta',
  MQ: 'Martinique',
  MR: 'Mauritania',
  MU: 'Mauritius',
  YT: 'Mayotte',
  MX: 'Mexico',
  MD: 'Moldova, Republic of',
  MC: 'Monaco',
  MN: 'Mongolia',
  ME: 'Montenegro',
  MS: 'Montserrat',
  MA: 'Morocco',
  MZ: 'Mozambique',
  MM: 'Myanmar',
  NA: 'Namibia',
  NR: 'Nauru',
  NP: 'Nepal',
  NL: 'Netherlands',
  NC: 'New Caledonia',
  NZ: 'New Zealand',
  NI: 'Nicaragua',
  NE: 'Niger',
  NG: 'Nigeria',
  NU: 'Niue',
  NF: 'Norfolk Island',
  MK: 'North Macedonia',
  NO: 'Norway',
  OM: 'Oman',
  PK: 'Pakistan',
  PS: 'Palestinian Territory, Occupied',
  PA: 'Panama',
  PG: 'Papua New Guinea',
  PY: 'Paraguay',
  PE: 'Peru',
  PH: 'Philippines',
  PN: 'Pitcairn',
  PL: 'Poland',
  PT: 'Portugal',
  QA: 'Qatar',
  RE: 'Reunion',
  RO: 'Romania',
  RU: 'Russia',
  RW: 'Rwanda',
  WS: 'Samoa',
  SM: 'San Marino',
  ST: 'Sao Tome And Principe',
  SA: 'Saudi Arabia',
  SN: 'Senegal',
  RS: 'Serbia',
  SC: 'Seychelles',
  SL: 'Sierra Leone',
  SG: 'Singapore',
  SX: 'Sint Maarten',
  SK: 'Slovakia',
  SI: 'Slovenia',
  SB: 'Solomon Islands',
  SO: 'Somalia',
  ZA: 'South Africa',
  GS: 'South Georgia And The South Sandwich Islands',
  KR: 'South Korea',
  SS: 'South Sudan',
  ES: 'Spain',
  LK: 'Sri Lanka',
  BL: 'Saint Barthélemy',
  SH: 'Saint Helena',
  KN: 'Saint Kitts And Nevis',
  LC: 'Saint Lucia',
  MF: 'Saint Martin',
  PM: 'Saint Pierre And Miquelon',
  VC: 'St. Vincent',
  SD: 'Sudan',
  SR: 'Suriname',
  SJ: 'Svalbard &amp; Jan Mayen',
  SE: 'Sweden',
  CH: 'Switzerland',
  TW: 'Taiwan',
  TJ: 'Tajikistan',
  TZ: 'Tanzania, United Republic Of',
  TH: 'Thailand',
  TL: 'Timor Leste',
  TG: 'Togo',
  TK: 'Tokelau',
  TO: 'Tonga',
  TT: 'Trinidad and Tobago',
  TA: 'Tristan da Cunha',
  TN: 'Tunisia',
  TR: 'Turkey',
  TM: 'Turkmenistan',
  TC: 'Turks &amp; Caicos Islands',
  TV: 'Tuvalu',
  UM: 'United States Minor Outlying Islands',
  UG: 'Uganda',
  UA: 'Ukraine',
  AE: 'United Arab Emirates',
  UY: 'Uruguay',
  UZ: 'Uzbekistan',
  VU: 'Vanuatu',
  VA: 'Holy See (Vatican City State)',
  VE: 'Venezuela',
  VN: 'Vietnam',
  WF: 'Wallis &amp Futuna',
  EH: 'Western Sahara',
  YE: 'Yemen',
  ZM: 'Zambia',
  ZW: 'Zimbabwe'
}

var stateData = {
  US: {
    AL : 'Alabama',
    AK : 'Alaska',
    AS : 'American Samoa',
    AZ : 'Arizona',
    AR : 'Arkansas',
    CA : 'California',
    CO : 'Colorado',
    CT : 'Connecticut',
    DE : 'Delaware',
    FL : 'Florida',
    GA : 'Georgia',
    GU : 'Guam',
    HI : 'Hawaii',
    ID : 'Idaho',
    IL : 'Illinois',
    IN : 'Indiana',
    IA : 'Iowa',
    KS : 'Kansas',
    KY : 'Kentucky',
    LA : 'Louisiana',
    ME : 'Maine',
    MH : 'Marshall Islands',
    MD : 'Maryland',
    MA : 'Massachusetts',
    MI : 'Michigan',
    FM : 'Micronesia',
    MN : 'Minnesota',
    MS : 'Mississippi',
    MO : 'Missouri',
    MT : 'Montana',
    NE : 'Nebraska',
    NV : 'Nevada',
    NH : 'New Hampshire',
    NJ : 'New Jersey',
    NM : 'New Mexico',
    NY : 'New York',
    NC : 'North Carolina',
    ND : 'North Dakota',
    MP : 'Northern Mariana Islands',
    OH : 'Ohio',
    OK : 'Oklahoma',
    OR : 'Oregon',
    PW : 'Palau',
    PA : 'Pennsylvania',
    PR : 'Puerto Rico',
    RI : 'Rhode Island',
    SC : 'South Carolina',
    SD : 'South Dakota',
    TN : 'Tennessee',
    TX : 'Texas',
    VI : 'U.S. Virgin Islands',
    UT : 'Utah',
    VT : 'Vermont',
    VA : 'Virginia',
    WA : 'Washington',
    DC : 'Washington DC',
    WV : 'West Virginia',
    WI : 'Wisconsin',
    WY : 'Wyoming',
    AA : 'Armed Forces Americas',
    AE : 'Armed Forces Europe',
    AP : 'Armed Forces Pacific',
  },
  AU: {
    ACT : 'Australian Capital Territory',
    NSW : 'New South Wales',
    NT : 'Northern Territory',
    QLD : 'Queensland',
    SA : 'South Australia',
    TAS : 'Tasmania',
    VIC : 'Victoria',
    WA : 'Western Australia',   
  },
  CA: {
    AB : 'Alberta',
    BC : 'British Columbia',
    MB : 'Manitoba',
    NB : 'New Brunswick',
    NL : 'Newfoundland and Labrador',
    NT : 'Northwest Territories',
    NS : 'Nova Scotia',
    NU : 'Nunavut',
    ON : 'Ontario',
    PE : 'Prince Edward Island',
    QC : 'Quebec',
    SK : 'Saskatchewan',
    YT : 'Yukon',
  },
  CN: {
    AH : 'Anhui',
    BJ : 'Beijing',
    CQ : 'Chongqing',
    FJ : 'Fujian',
    GS : 'Gansu',
    GD : 'Guangdong',
    GX : 'Guangxi',
    GZ : 'Guizhou',
    HI : 'Hainan',
    HE : 'Hebei',
    HL : 'Heilongjiang',
    HA : 'Henan',
    HB : 'Hubei',
    HN : 'Hunan',
    NM : 'Inner Mongolia',
    JS : 'Jiangsu',
    JX : 'Jiangxi',
    JL : 'Jilin',
    LN : 'Liaoning',
    NX : 'Ningxia',
    QH : 'Qinghai',
    SN : 'Shaanxi',
    SD : 'Shandong',
    SH : 'Shanghai',
    SX : 'Shanxi',
    SC : 'Sichuan',
    TJ : 'Tianjin',
    YZ : 'Tibet',
    XJ : 'Xinjiang',
    YN : 'Yunnan',
    ZJ : 'Zhejiang',    
  },
  ZA: {
    EC : 'Eastern Cape',
    FS : 'Free State',
    GT : 'Gauteng',
    NL : 'KwaZulu-Natal',
    LP : 'Limpopo',
    MP : 'Mpumalanga',
    NW : 'North West',
    NC : 'Northern Cape',
    WC : 'Western Cape',    
  },
  AR: {
    C : 'Buenos Aires (Autonomous City)',
    B : 'Buenos Aires Province',
    K : 'Catamarca',
    H : 'Chaco',
    U : 'Chubut',
    X : 'Córdoba',
    W : 'Corrientes',
    E : 'Entre Ríos',
    P : 'Formosa',
    Y : 'Jujuy',
    L : 'La Pampa',
    F : 'La Rioja',
    M : 'Mendoza',
    N : 'Misiones',
    Q : 'Neuquén',
    R : 'Río Negro',
    A : 'Salta',
    J : 'San Juan',
    D : 'San Luis',
    Z : 'Santa Cruz',
    S : 'Santa Fe',
    G : 'Santiago del Estero',
    V : 'Tierra del Fuego',
    T : 'Tucumán',    
  },
  BR: {
    AC : 'Acre',
    AL : 'Alagoas',
    AP : 'Amapá',
    AM : 'Amazonas',
    BA : 'Bahia',
    CE : 'Ceará',
    ES : 'Espírito Santo',
    DF : 'Federal District',
    GO : 'Goiás',
    MA : 'Maranhão',
    MT : 'Mato Grosso',
    MS : 'Mato Grosso do Sul',
    MG : 'Minas Gerais',
    PA : 'Pará',
    PB : 'Paraíba',
    PR : 'Paraná',
    PE : 'Pernambuco',
    PI : 'Piauí',
    RN : 'Rio Grande do Norte',
    RS : 'Rio Grande do Sul',
    RJ : 'Rio de Janeiro',
    RO : 'Rondônia',
    RR : 'Roraima',
    SC : 'Santa Catarina',
    SP : 'São Paulo',
    SE : 'Sergipe',
    TO : 'Tocantins'    
  },
  CO: {
    DC : 'Capital District',
    AMA : 'Amazonas',
    ANT : 'Antioquia',
    ARA : 'Arauca',
    ATL : 'Atlántico',
    BOL : 'Bolívar',
    BOY : 'Boyacá',
    CAL : 'Caldas',
    CAQ : 'Caquetá',
    CAS : 'Casanare',
    CAU : 'Cauca',
    CES : 'Cesar',
    CHO : 'Chocó',
    COR : 'Córdoba',
    CUN : 'Cundinamarca',
    GUA : 'Guainía',
    GUV : 'Guaviare',
    HUI : 'Huila',
    LAG : 'La Guajira',
    MAG : 'Magdalena',
    MET : 'Meta',
    NAR : 'Nariño',
    NSA : 'Norte de Santander',
    PUT : 'Putumayo',
    QUI : 'Quindío',
    RIS : 'Risaralda',
    SAP : 'San Andrés &amp; Providencia',
    SAN : 'Santander',
    SUC : 'Sucre',
    TOL : 'Tolima',
    VAC : 'Valle del Cauca',
    VAU : 'Vaupés',
    VID : 'Vichada'   
  },
  GT: {
    AVE : 'Alta Verapaz',
    BVE : 'Baja Verapaz',
    CMT : 'Chimaltenango',
    CQM : 'Chiquimula',
    EPR : 'El Progreso',
    ESC : 'Escuintla',
    GUA : 'Guatemala',
    HUE : 'Huehuetenango',
    IZA : 'Izabal',
    JAL : 'Jalapa',
    JUT : 'Jutiapa',
    PET : 'Petén',
    QUE : 'Quetzaltenango',
    QUI : 'Quiché',
    RET : 'Retalhuleu',
    SAC : 'Sacatepéquez',
    SMA : 'San Marcos',
    SRO : 'Santa Rosa',
    SOL : 'Sololá',
    SUC : 'Suchitepéquez',
    TOT : 'Totonicapán',
    ZAC : 'Zacapa',   
  },
  IN: {
    AN : 'Andaman and Nicobar Islands',
    AP : 'Andhra Pradesh',
    AR : 'Arunachal Pradesh',
    AS : 'Assam',
    BR : 'Bihar',
    CH : 'Chandigarh',
    CG : 'Chhattisgarh',
    DN : 'Dadra and Nagar Haveli',
    DD : 'Daman and Diu',
    DL : 'Delhi',
    GA : 'Goa',
    GJ : 'Gujarat',
    HR : 'Haryana',
    HP : 'Himachal Pradesh',
    JK : 'Jammu and Kashmir',
    JH : 'Jharkhand',
    KA : 'Karnataka',
    KL : 'Kerala',
    LA : 'Ladakh',
    LD : 'Lakshadweep',
    MP : 'Madhya Pradesh',
    MH : 'Maharashtra',
    MN : 'Manipur',
    ML : 'Meghalaya',
    MZ : 'Mizoram',
    NL : 'Nagaland',
    OR : 'Odisha',
    PY : 'Puducherry',
    PB : 'Punjab',
    RJ : 'Rajasthan',
    SK : 'Sikkim',
    TN : 'Tamil Nadu',
    TS : 'Telangana',
    TR : 'Tripura',
    UP : 'Uttar Pradesh',
    UK : 'Uttarakhand',
    WB : 'West Bengal',   
  },
  ID: {
    AC : 'Aceh',
    BA : 'Bali',
    BB : 'Bangka–Belitung Islands',
    BT : 'Banten',
    BE : 'Bengkulu',
    JT : 'Central Java',
    KT : 'Central Kalimantan',
    ST : 'Central Sulawesi',
    JI : 'East Java',
    KI : 'East Kalimantan',
    NT : 'East Nusa Tenggara',
    GO : 'Gorontalo',
    JK : 'Jakarta',
    JA : 'Jambi',
    LA : 'Lampung',
    MA : 'Maluku',
    KU : 'North Kalimantan',
    MU : 'North Maluku',
    SA : 'North Sulawesi',
    SU : 'North Sumatra',
    PA : 'Papua',
    RI : 'Riau',
    KR : 'Riau Islands',
    KS : 'South Kalimantan',
    SN : 'South Sulawesi',
    SS : 'South Sumatra',
    SG : 'Southeast Sulawesi',
    JB : 'West Java',
    KB : 'West Kalimantan',
    NB : 'West Nusa Tenggara',
    PB : 'West Papua',
    SR : 'West Sulawesi',
    SB : 'West Sumatra',
    YO : 'Yogyakarta',    
  },  
  IE: {
    CW : 'Carlow',
    CN : 'Cavan',
    CE : 'Clare',
    CO : 'Cork',
    DL : 'Donegal',
    D : 'Dublin',
    G : 'Galway',
    KY : 'Kerry',
    KE : 'Kildare',
    KK : 'Kilkenny',
    LS : 'Laois',
    LM : 'Leitrim',
    LK : 'Limerick',
    LD : 'Longford',
    LH : 'Louth',
    MO : 'Mayo',
    MH : 'Meath',
    MN : 'Monaghan',
    OY : 'Offaly',
    RN : 'Roscommon',
    SO : 'Sligo',
    TA : 'Tipperary',
    WD : 'Waterford',
    WH : 'Westmeath',
    WX : 'Wexford',
    WW : 'Wicklow',   
  },
  MY: {
    JHR : 'Johor',
    KDH : 'Kedah',
    KTN : 'Kelantan',
    KUL : 'Kuala Lumpur',
    LBN : 'Labuan',
    MLK : 'Malacca',
    NSN : 'Negeri Sembilan',
    PHG : 'Pahang',
    PNG : 'Penang',
    PRK : 'Perak',
    PLS : 'Perlis',
    PJY : 'Putrajaya',
    SBH : 'Sabah',
    SWK : 'Sarawak',
    SGR : 'Selangor',
    TRG : 'Terengganu',
  },
  MX: {
    AGS : 'Aguascalientes',
    BC : 'Baja California',
    BCS : 'Baja California Sur',
    CAMP : 'Campeche',
    CHIS : 'Chiapas',
    CHIH : 'Chihuahua',
    DF : 'Ciudad de Mexico',
    COAH : 'Coahuila',
    COL : 'Colima',
    DGO : 'Durango',
    GTO : 'Guanajuato',
    GRO : 'Guerrero',
    HGO : 'Hidalgo',
    JAL : 'Jalisco',
    MEX : 'Mexico State',
    MICH : 'Michoacán',
    MOR : 'Morelos',
    NAY : 'Nayarit',
    NL : 'Nuevo León',
    OAX : 'Oaxaca',
    PUE : 'Puebla',
    QRO : 'Querétaro',
    'Q ROO' : 'Quintana Roo',
    SLP : 'San Luis Potosí',
    SIN : 'Sinaloa',
    SON : 'Sonora',
    TAB : 'Tabasco',
    TAMPS : 'Tamaulipas',
    TLAX : 'Tlaxcala',
    VER : 'Veracruz',
    YUC : 'Yucatán',
    ZAC : 'Zacatecas',
  },
  NZ: {
    AUK : 'Auckland',
    BOP : 'Bay of Plenty',
    CAN : 'Canterbury',
    CIT : 'Chatham Islands',
    GIS : 'Gisborne',
    HKB : 'Hawke’s Bay',
    MWT : 'Manawatu-Wanganui',
    MBH : 'Marlborough',
    NSN : 'Nelson',
    NTL : 'Northland',
    OTA : 'Otago',
    STL : 'Southland',
    TKI : 'Taranaki',
    TAS : 'Tasman',
    WKO : 'Waikato',
    WGN : 'Wellington',
    WTC : 'West Coast',
  },
  NG: {
    AB : 'Abia',
    AD : 'Adamawa',
    AK : 'Akwa Ibom',
    AN : 'Anambra',
    BA : 'Bauchi',
    BY : 'Bayelsa',
    BE : 'Benue',
    BO : 'Borno',
    CR : 'Cross River',
    DE : 'Delta',
    EB : 'Ebonyi',
    ED : 'Edo',
    EK : 'Ekiti',
    EN : 'Enugu',
    FC : 'Federal Capital Territory',
    GO : 'Gombe',
    IM : 'Imo',
    JI : 'Jigawa',
    KD : 'Kaduna',
    KN : 'Kano',
    KT : 'Katsina',
    KE : 'Kebbi',
    KO : 'Kogi',
    KW : 'Kwara',
    LA : 'Lagos',
    NA : 'Nasarawa',
    NI : 'Niger',
    OG : 'Ogun',
    ON : 'Ondo',
    OS : 'Osun',
    OY : 'Oyo',
    PL : 'Plateau',
    RI : 'Rivers',
    SO : 'Sokoto',
    TA : 'Taraba',
    YO : 'Yobe',
    ZA : 'Zamfara',
  },
}