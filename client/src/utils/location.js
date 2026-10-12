/**
 * Anchor Solution - Official Verified Campus & Contact Details
 * Address: Mesrat Yaskeberal Building, Kebele 04, 4th Floor, Bahir Dar, Ethiopia
 * Amharic: ባሕር ዳር ከተማ፣ ቀበሌ 04፣ መስራት ያስከብራል ህንፃ፣ 4ኛ ፎቅ
 */

export const LOCATION_DATA = {
  address: {
    en: 'Mesrat Yaskeberal Building, Kebele 04, 4th Floor, Bahir Dar, Ethiopia',
    am: 'ባሕር ዳር ከተማ፣ ቀበሌ 04፣ መስራት ያስከብራል ህንፃ፣ 4ኛ ፎቅ',
    buildingEn: 'Mesrat Yaskeberal Building, 4th Floor',
    buildingAm: 'መስራት ያስከብራል ህንፃ፣ 4ኛ ፎቅ',
    kebele: 'Kebele 04 / ቀበሌ 04',
    cityEn: 'Bahir Dar, Ethiopia',
    cityAm: 'ባሕር ዳር፣ ኢትዮጵያ',
  },
  phones: [
    {
      display: '0902 18 44 40',
      displayIntl: '+251 902 18 44 40',
      href: 'tel:+251902184440',
      isPrimary: true,
    },
    {
      display: '0952 58 77 50',
      displayIntl: '+251 952 58 77 50',
      href: 'tel:+251952587750',
      isPrimary: false,
    },
  ],
  maps: {
    // Official Google Maps Search URL for verified building and Kebele 04 Bahir Dar
    searchQuery: 'Mesrat Yaskeberal Building, Kebele 04, Bahir Dar, Ethiopia',
    viewUrl: 'https://www.google.com/maps/search/?api=1&query=Mesrat+Yaskeberal+Building%2C+Kebele+04%2C+Bahir+Dar%2C+Ethiopia',
    directionsUrl: 'https://www.google.com/maps/dir/?api=1&destination=Mesrat+Yaskeberal+Building%2C+Kebele+04%2C+Bahir+Dar%2C+Ethiopia',
    embedUrl: 'https://maps.google.com/maps?q=Mesrat%20Yaskeberal%20Building%2C%20Kebele%2004%2C%20Bahir%20Dar%2C%20Ethiopia&t=&z=16&ie=UTF8&iwloc=&output=embed',
  },
  hours: {
    en: 'Monday – Saturday: 8:30 AM – 6:30 PM (EAT)',
    am: 'ከሰኞ – ቅዳሜ፡ ከጠዋቱ 2:30 – ማታ 12:30 (የኢትዮጵያ ሰዓት)',
  },
};

export default LOCATION_DATA;
