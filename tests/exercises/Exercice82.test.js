describe('Exercice 82', () => {
  it("should return [{ firstName: 'Gabriel', lastName: 'X.', country: 'Monaco', continent: 'Europe', age: 49, language: 'PHP' }, { firstName: 'Sou', lastName: 'B.', country: 'Japan', continent: 'Asia', age: 49, language: 'PHP' }] for [{ firstName: 'Gabriel', lastName: 'X.', country: 'Monaco', continent: 'Europe', age: 49, language: 'PHP' }, { firstName: 'Odval', lastName: 'F.', country: 'Mongolia', continent: 'Asia', age: 38, language: 'Python' }, { firstName: 'Emilija', lastName: 'S.', country: 'Lithuania', continent: 'Europe', age: 19, language: 'Python' }, { firstName: 'Sou', lastName: 'B.', country: 'Japan', continent: 'Asia', age: 49, language: 'PHP' }]", () => {
    expect(
      findSenior([
        {
          firstName: 'Gabriel',
          lastName: 'X.',
          country: 'Monaco',
          continent: 'Europe',
          age: 49,
          language: 'PHP',
        },
        {
          firstName: 'Odval',
          lastName: 'F.',
          country: 'Mongolia',
          continent: 'Asia',
          age: 38,
          language: 'Python',
        },
        {
          firstName: 'Emilija',
          lastName: 'S.',
          country: 'Lithuania',
          continent: 'Europe',
          age: 19,
          language: 'Python',
        },
        {
          firstName: 'Sou',
          lastName: 'B.',
          country: 'Japan',
          continent: 'Asia',
          age: 49,
          language: 'PHP',
        },
      ])
    ).toEqual([
      {
        firstName: 'Gabriel',
        lastName: 'X.',
        country: 'Monaco',
        continent: 'Europe',
        age: 49,
        language: 'PHP',
      },
      {
        firstName: 'Sou',
        lastName: 'B.',
        country: 'Japan',
        continent: 'Asia',
        age: 49,
        language: 'PHP',
      },
    ])
  })
})
