describe('evilCodeMedal', () => {
  it('should return the medal', () => {
    expect(evilCodeMedal('00:30:00', '00:15:00', '00:45:00', '01:15:00')).toEqual('Silver')
    expect(evilCodeMedal('01:15:00', '00:15:00', '00:45:00', '01:15:00')).toEqual('None')
    expect(evilCodeMedal('00:00:01', '00:00:10', '00:01:40', '01:00:00')).toEqual('Gold')
    expect(evilCodeMedal('90:00:01', '60:00:02', '70:00:03', '80:00:04')).toEqual('None')
    expect(evilCodeMedal('03:15:00', '03:15:00', '03:15:01', '03:15:02')).toEqual('Silver')
    expect(evilCodeMedal('99:59:58', '99:59:57', '99:59:58', '99:59:59')).toEqual('Bronze')
  })
})
