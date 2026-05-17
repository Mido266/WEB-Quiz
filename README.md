# WEB-Quiz Platform

A web-based interactive quiz application designed to test core web development knowledge. The project features a custom-built quiz engine that evaluates answers in real-time, tracks user progress, and provides a gamified learning experience.

## Live Demo
You can view and test the live application here:
[https://mido266.github.io/WEB-Quiz/](https://mido266.github.io/WEB-Quiz/)

---

## Features
* **Multiple Modules:** Includes structured question banks for Intro to Web, HTML, CSS, JavaScript, and PHP.
* **Custom Quiz Engine:** Built entirely from scratch to handle state management, score calculation, and dynamic rendering.
* **Gamification:** Integrates a live timer, progress tracking, and an XP system based on user accuracy.
* **Instant Feedback:** Validates user input immediately and displays detailed explanations for specific or tricky questions.
* **Responsive UI:** Clean interface using CSS grid/flexbox and glassmorphism styling, optimized for desktop and mobile displays.

---

## Tech Stack
This application is developed using standard web technologies without reliance on external libraries or frameworks (e.g., React):
* **HTML5:** Semantic document structure.
* **CSS3:** Custom styling, UI animations, and responsive layout handling.
* **Vanilla JavaScript (ES6+):** Core application logic, DOM manipulation, event handling, and data validation.

---

## Project Structure
```text
WEB-Quiz/
│
├── index.html       # Main entry point and layout
├── style.css        # Stylesheets and visual effects
├── app.js           # Quiz logic, state management, and DOM updates
├── data.js          # Data structure containing all modules and questions
└── README.md        # Project documentation
