import { Person } from '../types/Person';

export const getFilteredPeople = (
  people: Person[],
  searchParams: URLSearchParams,
) => {
  let filteringPeople = [...people];

  if (searchParams.has('sex')) {
    switch (searchParams.get('sex')) {
      case 'm':
        filteringPeople = filteringPeople.filter(person => person.sex === 'm');
        break;
      case 'f':
        filteringPeople = filteringPeople.filter(person => person.sex === 'f');
        break;
      default:
        throw new Error('Invalid filter value');
    }
  }

  if (searchParams.has('query')) {
    const normalizedQuery = searchParams.get('query')?.toLowerCase() || '';

    filteringPeople = filteringPeople.filter(person => {
      const { name, fatherName, motherName } = person;

      return (
        name.toLowerCase().includes(normalizedQuery) ||
        fatherName?.toLowerCase().includes(normalizedQuery) ||
        motherName?.toLowerCase().includes(normalizedQuery)
      );
    });
  }

  if (searchParams.has('centuries')) {
    filteringPeople = filteringPeople.filter(person => {
      const century = String(Math.ceil(person.born / 100));

      return searchParams.getAll('centuries')?.includes(century);
    });
  }

  if (searchParams.has('sort')) {
    const sortColumn = searchParams.get('sort') as keyof Person;
    const isDescending = searchParams.has('order');

    filteringPeople.sort((personA, personB) => {
      const direction: number = isDescending ? -1 : 1;

      switch (sortColumn) {
        case 'name':
        case 'sex':
          return (
            personA[sortColumn].localeCompare(personB[sortColumn]) * direction
          );
        case 'born':
        case 'died':
          return personB[sortColumn] - personA[sortColumn] * direction;
        default:
          throw new Error('Unknown sort field');
      }
    });
  }

  return filteringPeople;
};
