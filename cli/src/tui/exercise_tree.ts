import type { Challenge } from '../types.js'
import { ANSI, padRight, truncate } from './ansi.js'

export class ExerciseTree {
  challenges: Challenge[] = []
  selectedIndex = 0
  scrollOffset = 0
  filterText = ''

  setChallenges(challenges: Challenge[]): void {
    this.challenges = challenges
    if (this.selectedIndex >= this.challenges.length) {
      this.selectedIndex = Math.max(0, this.challenges.length - 1)
    }
  }

  getFilteredChallenges(): Challenge[] {
    if (!this.filterText) return this.challenges
    const query = this.filterText.toLowerCase()
    return this.challenges.filter(
      (c) =>
        c.title.toLowerCase().includes(query) ||
        c.slug.toLowerCase().includes(query) ||
        String(c.number).includes(query)
    )
  }

  getSelectedChallenge(): Challenge | null {
    const list = this.getFilteredChallenges()
    return list[this.selectedIndex] || null
  }

  moveUp(): void {
    const list = this.getFilteredChallenges()
    if (list.length === 0) return
    this.selectedIndex = Math.max(0, this.selectedIndex - 1)
  }

  moveDown(): void {
    const list = this.getFilteredChallenges()
    if (list.length === 0) return
    this.selectedIndex = Math.min(list.length - 1, this.selectedIndex + 1)
  }

  pageUp(pageSize: number): void {
    const list = this.getFilteredChallenges()
    if (list.length === 0) return
    this.selectedIndex = Math.max(0, this.selectedIndex - pageSize)
  }

  pageDown(pageSize: number): void {
    const list = this.getFilteredChallenges()
    if (list.length === 0) return
    this.selectedIndex = Math.min(list.length - 1, this.selectedIndex + pageSize)
  }

  selectBySlug(slug: string): void {
    const list = this.getFilteredChallenges()
    const index = list.findIndex((c) => c.slug === slug || String(c.number) === slug)
    if (index !== -1) {
      this.selectedIndex = index
    }
  }

  render(height: number, width: number, isFocused: boolean): string[] {
    const list = this.getFilteredChallenges()
    const lines: string[] = []

    // Header info with counts
    const completedCount = this.challenges.filter((c) => c.isCompleted).length
    const unlockedCount = this.challenges.filter((c) => c.isUnlocked).length
    const total = this.challenges.length

    const header = `${ANSI.bold}${ANSI.cyan}📂 Exercices (${completedCount}/${total})${ANSI.reset}`
    lines.push(` ${padRight(header, width - 2)}`)

    const subHeader = `${ANSI.dim}${unlockedCount} débloqués | ${total - unlockedCount} verrouillés${ANSI.reset}`
    lines.push(` ${padRight(subHeader, width - 2)}`)
    lines.push(`${ANSI.gray}${'─'.repeat(width)}${ANSI.reset}`)

    const availableHeight = Math.max(1, height - 3)

    // Adjust scroll offset
    if (this.selectedIndex < this.scrollOffset) {
      this.scrollOffset = this.selectedIndex
    } else if (this.selectedIndex >= this.scrollOffset + availableHeight) {
      this.scrollOffset = this.selectedIndex - availableHeight + 1
    }

    for (let i = 0; i < availableHeight; i += 1) {
      const itemIndex = this.scrollOffset + i
      if (itemIndex < list.length) {
        const item = list[itemIndex]
        const isSelected = itemIndex === this.selectedIndex

        // Status badge
        let statusBadge = ''
        if (item.isCompleted) {
          statusBadge = `${ANSI.brightGreen}✓${ANSI.reset}`
        } else if (item.isUnlocked) {
          statusBadge = `${ANSI.brightYellow}●${ANSI.reset}`
        } else {
          statusBadge = `${ANSI.gray}🔒${ANSI.reset}`
        }

        // Title and number
        const numStr = `${item.number}.`.padEnd(4, ' ')
        const rawTitle = `${numStr}${item.title}`
        const maxTitleWidth = Math.max(5, width - 10)
        const truncatedTitle = truncate(rawTitle, maxTitleWidth)

        let lineText = `${statusBadge} ${truncatedTitle}`

        if (isSelected) {
          if (isFocused) {
            lineText = `${ANSI.bgBlue}${ANSI.white}${ANSI.bold} ${statusBadge} ${padRight(truncatedTitle, width - 6)} ${ANSI.reset}`
          } else {
            lineText = `${ANSI.bgDarkGray}${ANSI.white} ${statusBadge} ${padRight(truncatedTitle, width - 6)} ${ANSI.reset}`
          }
        } else {
          lineText = `  ${lineText}`
        }

        lines.push(padRight(lineText, width))
      } else {
        lines.push(' '.repeat(width))
      }
    }

    return lines
  }
}
