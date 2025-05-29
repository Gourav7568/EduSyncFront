# EduSync LMS - Smart Learning Management & Assessment Platform

## Overview
EduSync is a full-stack Learning Management System (LMS) built to simulate a real-world educational platform. It enables students to take courses and assessments while allowing instructors to create and manage educational content.

This repository contains the frontend of the EduSync platform, built with React.js and Bootstrap.

## Features

- **User Authentication**: Register and login functionality with role-based access (Student/Instructor)
- **Course Management**: Browse, create, update, and delete courses
- **Assessment System**: Create and take quizzes with automatic grading
- **Results Tracking**: View assessment results and performance
- **Responsive Design**: Fully responsive UI built with Bootstrap

## Technical Stack

- **Frontend**: React.js, React Router, Bootstrap
- **API Communication**: Axios for RESTful API calls
- **State Management**: React Hooks
- **Styling**: Custom CSS with Bootstrap integration

## Project Structure

```
src/
├── assets/          # Static assets and custom CSS
├── components/      # UI components organized by feature
│   ├── auth/        # Authentication components
│   ├── common/      # Shared components
│   ├── courses/     # Course-related components
│   ├── assessments/ # Assessment-related components
│   └── results/     # Result display components
├── pages/           # Page components
├── services/        # API services and business logic
└── utils/           # Utility functions
```

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Backend API running (ASP.NET Core Web API)

### Configuration

Make sure to update the API URL in `src/services/api.js` to point to your backend server.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
