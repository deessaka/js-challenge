// Note: the source spec's final worked example ("Mark called Anthony from Dan's
// phone(202-555-0166)") mixes the owner name of one phone object with the number of a
// DIFFERENT phone object passed in a separate call — inconsistent with a direct reading
// of the described Person/NSA API, and consistent with the OCR corruption already found
// elsewhere in this document. That specific step is dropped here in favor of the
// unambiguous parts of the same worked example.

describe('Exercice 142', () => {
  it('cas fixes (scenario NSA)', () => {
    const dan = new Person('Dan');
    const mark = new Person('Mark');
    const phone = { owner: dan, number: '202-555-0199' };
    dan.call(phone, mark);
    expect(NSA.log(dan)).toBe("Dan called Mark from Dan's phone(202-555-0199)");
    // records are erased once read
    expect(NSA.log(dan)).toBe('No Entries');

    const anthony = new Person('Anthony');
    anthony.call(phone, dan);
    expect(NSA.log(anthony)).toBe("Anthony called Dan from Dan's phone(202-555-0199)");

    const alex = new Person('Alex');
    const mobile = { owner: mark, number: '202-555-0166' };
    mark.text(mobile, dan, anthony);
    expect(NSA.log(mark)).toBe(
      "Mark texted Dan from Mark's phone(202-555-0166)\nMark texted Anthony from Mark's phone(202-555-0166)"
    );

    const erin = new Person('Erin');
    expect(NSA.log(erin)).toBe('No Entries');
  });
});
