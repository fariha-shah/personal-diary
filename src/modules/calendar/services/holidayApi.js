const NAGER_API = 'https://date.nager.at/api/v4';

export async function fetchPublicHolidays(
  countryCode = 'PK',
  year = new Date().getFullYear()
) {
  if (countryCode === 'PK') {
    return [];
  }

  const response = await fetch(`${NAGER_API}/Holidays/${countryCode}/${year}`);

  if (!response.ok) {
    throw new Error(`Holiday API failed with status ${response.status}`);
  }

  const data = await response.json();

  return data
    .filter(
      (holiday) =>
        holiday.nationalHoliday || holiday.holidayTypes?.includes('Public')
    )
    .map((holiday) => ({
      id: `holiday-${holiday.date}-${holiday.name}`,
      title: holiday.name,
      date: holiday.date,
      type: 'holiday',
      isNationalHoliday: holiday.nationalHoliday,
      countryCode: holiday.countryCode,
    }));
}
