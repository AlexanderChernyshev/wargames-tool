# Wargame Assistance Tool

[🚀 **Live Demo: wargames-tool.pages.dev**](https://wargames-tool.pages.dev)

A comprehensive, offline-ready companion tool for tabletop wargaming. Designed to streamline game management so you can focus on the strategy.

## 🕹 Key Features

- **Dynamic Game Tracker:** Support for 1 to 6+ players. Track Victory Points (VP), Command Points (CP), and game turns in a clean, responsive grid.
- **Army Builder:** Create and save multiple rosters. Add units with names, point values, and custom notes/wargear.
- **Floating Quick Reference:** A non-disruptive side drawer on the tracker page that lets you view your active army roster or your custom rules without leaving the score screen.
- **Advanced Dice Roller:** Roll single or batch dice (up to 100 at once) for any standard die type (D4–D100). Includes roll history and automatic sum calculation.
- **Rules Reference:** A searchable digital notebook to store your most-used rules or complex edge cases.
- **Adaptive Themes:** High-contrast Gold & Slate Blue theme available in both **Dark** and **Light** modes.

## 📖 How to Use

1.  **Build Your Roster:** Head to the **Builder** tab to create a new roster and add your units. The total points will calculate automatically.
2.  **Add Rules:** Use the **Rules** tab to save any special rules or reminders you often forget during a match.
3.  **Track the Game:** On the **Tracker** tab, add the number of players and enter their names. Use the "+" and "-" buttons to manage scores and turns.
4.  **Quick Lookups:** While on the Tracker, click the **"REF"** tab on the far left to slide out your roster or rules for a quick check mid-turn.
5.  **Roll Dice:** Enter the number of dice needed in the right sidebar and click the die type to see your results and their total sum instantly.

> **Note:** Currently, game rules and units in your rosters do not automatically affect the tools (such as dice rolls or scores) and are intended for reference only.

---

## 🛠 Local Development

If you want to run this tool locally or contribute to its development:

### Setup
Make sure to install dependencies:
```bash
npm install
```

### Development Server
Start the development server on `http://localhost:3000`:
```bash
npm run dev
```

### Production
Build the application for production:
```bash
npm run build
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
