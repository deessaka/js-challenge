import { ANSI, padRight, renderProgressBar, THEME, truncate, } from './ansi.js';
export class ExerciseTree {
    challenges = [];
    selectedIndex = 0;
    scrollOffset = 0;
    searchQuery = '';
    isSearching = false;
    filterMode = 'all';
    setChallenges(challenges) {
        this.challenges = challenges;
        if (this.selectedIndex >= this.getFilteredChallenges().length) {
            this.selectedIndex = Math.max(0, this.getFilteredChallenges().length - 1);
        }
    }
    cycleFilter() {
        const modes = ['all', 'available', 'completed', 'locked'];
        const curIdx = modes.indexOf(this.filterMode);
        this.filterMode = modes[(curIdx + 1) % modes.length];
        this.selectedIndex = 0;
        this.scrollOffset = 0;
    }
    startSearch() {
        this.isSearching = true;
        this.searchQuery = '';
        this.selectedIndex = 0;
        this.scrollOffset = 0;
    }
    cancelSearch() {
        this.isSearching = false;
        this.searchQuery = '';
    }
    insertSearchChar(char) {
        this.searchQuery += char;
        this.selectedIndex = 0;
        this.scrollOffset = 0;
    }
    backspaceSearch() {
        if (this.searchQuery.length > 0) {
            this.searchQuery = this.searchQuery.slice(0, -1);
            this.selectedIndex = 0;
            this.scrollOffset = 0;
        }
    }
    getFilteredChallenges() {
        return this.challenges.filter((c) => {
            // 1. Status filter
            if (this.filterMode === 'available' && (!c.isUnlocked || c.isCompleted))
                return false;
            if (this.filterMode === 'completed' && !c.isCompleted)
                return false;
            if (this.filterMode === 'locked' && c.isUnlocked)
                return false;
            // 2. Search query filter
            if (this.searchQuery.trim()) {
                const q = this.searchQuery.toLowerCase();
                const matchTitle = c.title.toLowerCase().includes(q);
                const matchSlug = c.slug.toLowerCase().includes(q);
                const matchNum = String(c.number).includes(q);
                const matchCat = (c.category || '').toLowerCase().includes(q);
                return matchTitle || matchSlug || matchNum || matchCat;
            }
            return true;
        });
    }
    getSelectedChallenge() {
        const list = this.getFilteredChallenges();
        return list[this.selectedIndex] || null;
    }
    moveUp() {
        if (this.selectedIndex > 0) {
            this.selectedIndex -= 1;
        }
    }
    moveDown() {
        const list = this.getFilteredChallenges();
        if (this.selectedIndex < list.length - 1) {
            this.selectedIndex += 1;
        }
    }
    pageUp(pageSize) {
        this.selectedIndex = Math.max(0, this.selectedIndex - pageSize);
    }
    pageDown(pageSize) {
        const list = this.getFilteredChallenges();
        this.selectedIndex = Math.min(list.length - 1, this.selectedIndex + pageSize);
    }
    ensureSelectionVisible(height) {
        if (this.selectedIndex < this.scrollOffset) {
            this.scrollOffset = this.selectedIndex;
        }
        else if (this.selectedIndex >= this.scrollOffset + height) {
            this.scrollOffset = this.selectedIndex - height + 1;
        }
    }
    render(height, width, isFocused) {
        const lines = [];
        const innerWidth = Math.max(10, width - 2);
        // 1. Compute stats
        const total = this.challenges.length || 1;
        const completed = this.challenges.filter((c) => c.isCompleted).length;
        const pointsEarned = this.challenges
            .filter((c) => c.isCompleted)
            .reduce((sum, c) => sum + (c.points || 0), 0);
        const totalPoints = this.challenges.reduce((sum, c) => sum + (c.points || 0), 0);
        const percent = Math.round((completed / total) * 100);
        // 2. Render Progress Bar Widget (2 lines)
        const pBarWidth = Math.max(5, innerWidth - 8);
        const pBar = renderProgressBar(percent, pBarWidth, THEME.success, THEME.borderDim);
        const statsText = `${THEME.textBold}${completed}/${total}${ANSI.reset} ${THEME.textMuted}(${percent}% · ${pointsEarned} pts)${ANSI.reset}`;
        lines.push(` ${statsText}`);
        lines.push(` [${pBar}]`);
        // 3. Render Search / Filter Bar (1 line)
        const filterTag = this.filterMode === 'all'
            ? `${THEME.textMuted}[Tous]${ANSI.reset}`
            : this.filterMode === 'available'
                ? `${THEME.cyan}[Disponibles]${ANSI.reset}`
                : this.filterMode === 'completed'
                    ? `${THEME.success}[Terminés]${ANSI.reset}`
                    : `${THEME.warning}[Verrouillés]${ANSI.reset}`;
        if (this.isSearching) {
            const searchBox = `${THEME.borderFocus}🔍 ${this.searchQuery}█${ANSI.reset}`;
            lines.push(` ${searchBox}`);
        }
        else {
            lines.push(` ${THEME.textMuted}/:Rech ${filterTag} ${THEME.textDim}f:filtre${ANSI.reset}`);
        }
        lines.push(`${THEME.borderDim}${'─'.repeat(innerWidth)}${ANSI.reset}`);
        // 4. Calculate list height
        const headerLinesCount = 4;
        const listHeight = Math.max(1, height - headerLinesCount);
        this.ensureSelectionVisible(listHeight);
        const list = this.getFilteredChallenges();
        if (list.length === 0) {
            lines.push(`${THEME.textMuted} Aucun challenge trouvé.${ANSI.reset}`);
            lines.push(`${THEME.textDim} [Échap] Effacer le filtre${ANSI.reset}`);
        }
        else {
            for (let i = 0; i < listHeight; i += 1) {
                const itemIndex = this.scrollOffset + i;
                if (itemIndex < list.length) {
                    const c = list[itemIndex];
                    const isSelected = itemIndex === this.selectedIndex;
                    let icon = `${THEME.textMuted}🔒${ANSI.reset}`;
                    if (c.isCompleted) {
                        icon = `${THEME.success}✓${ANSI.reset}`;
                    }
                    else if (c.isUnlocked) {
                        icon = `${THEME.cyan}●${ANSI.reset}`;
                    }
                    const numStr = `${THEME.textMuted}#${String(c.number).padStart(2, ' ')}${ANSI.reset}`;
                    const pointsStr = `${THEME.textDim}${c.points}p${ANSI.reset}`;
                    const maxTitleWidth = Math.max(5, innerWidth - 11);
                    const title = truncate(c.title, maxTitleWidth);
                    let itemText = ` ${icon} ${numStr} ${title}`;
                    if (isSelected) {
                        const itemBg = isFocused ? THEME.surfaceHighlight : THEME.surface;
                        const pointer = isFocused ? `${THEME.primary}▎${ANSI.reset}` : ' ';
                        const selectedTitle = `${THEME.textBold}${truncate(c.title, maxTitleWidth)}${ANSI.reset}`;
                        itemText = `${pointer}${icon} ${numStr} ${selectedTitle}`;
                        lines.push(padRight(`${itemBg}${itemText} ${pointsStr}${ANSI.reset}`, innerWidth + 1));
                    }
                    else {
                        lines.push(` ${padRight(`${itemText} ${pointsStr}`, innerWidth)}`);
                    }
                }
                else {
                    lines.push(' '.repeat(innerWidth));
                }
            }
        }
        while (lines.length < height) {
            lines.push(' '.repeat(innerWidth));
        }
        return lines.map((l) => padRight(l, width));
    }
}
//# sourceMappingURL=exercise_tree.js.map