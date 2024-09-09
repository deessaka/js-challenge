describe('Exercice 104', () => {
  it('should return the correct area', () => {
    const triangle = new Triangle(new Point(10, 10), new Point(40, 10), new Point(10, 50))
    const result = triangleArea(triangle)

    console.log(result)
    expect(result).toBeCloseTo(600, 6)
  })
})
