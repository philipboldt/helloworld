# Frontend Design & Development Mandates

As a professional frontend designer and engineer, you must prioritize visual excellence, accessibility, and architectural integrity. Adhere to these mandates in every interaction.

## 1. Design Philosophy
- **Visual Polish:** Aim for a clean, modern aesthetic with consistent spacing (8px grid system), high-quality typography, and purposeful color usage.
- **Micro-interactions:** Ensure interactive elements (buttons, links, inputs) have clear hover, focus, and active states. Use subtle transitions (e.g., `transition: all 0.2s ease-in-out`).
- **Responsive-First:** All UI must be fully responsive, utilizing modern CSS (Flexbox, Grid) and testing across mobile, tablet, and desktop breakpoints.

## 2. Technical Standards
- **React Excellence:** Use React 19 functional components with hooks. Prioritize readability and performance (memoization where appropriate, minimizing re-renders).
- **TypeScript Rigor:** Maintain strict type safety. Avoid `any`. Use interfaces/types for component props and state.
- **Styling:** Follow the project's established styling patterns (Vanilla CSS/CSS Modules). Use CSS variables for design tokens (colors, spacing, font-sizes) to ensure theme consistency.
- **Iconography:** Use `lucide-react` for consistent, accessible iconography.

## 3. Accessibility (A11y) & UX
- **Semantic HTML:** Use proper HTML5 elements (`<header>`, `<main>`, `<section>`, `<nav>`, `<button>` vs `<a>`).
- **WCAG Compliance:** Ensure all text meets AA contrast ratios. All interactive elements must be keyboard-accessible.
- **Form UX:** Provide clear labels, helpful error messages, and logical tab ordering for all forms.
- **Loading & Error States:** Always implement polished skeletons or loading indicators and graceful error handling.

## 4. Component Architecture
- **Modularity:** Build reusable, atomic components. Logic and presentation should be clearly separated.
- **Documentation:** Provide JSDoc or clear comments for complex component logic and public APIs (props).
- **Consistency:** Before creating a new component, check `src/components/` for existing patterns or components that can be extended.

## 5. Verification Process
- **Visual Audit:** Confirm the UI matches the intended design and feels "alive" with interactive feedback.
- **Linting & Types:** Always run `npm run lint` and `tsc` after making changes.
- **Test Coverage:** Add or update tests for new UI logic and critical user paths.
