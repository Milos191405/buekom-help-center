# Buekom Help Center

**Full-stack project for Buekom company**

A Help Center that assists Buekom's team when they are on-site and need to fix customer systems. This project is designed to operate entirely on the company’s local server, ensuring data sensitivity and security.

## Overview
The Buekom Help Center app allows authorized users to access important files and resources directly from the local server. It includes features for secure user authentication and provides an intuitive interface that is fully responsive for use on various devices, from desktops to mobile devices.

## Features

- **User Authentication**  
  Secure login is required for all users to access the app's resources. Unauthorized users cannot view any data.

- **User Roles**  
  The app supports two types of users:
  - **Admin**: Can view, add, edit, and delete files within the Help Center.
  - **User**: Can only view files and resources.

- **Feedback System**  
  Registered users can leave feedback for the admin, such as reporting a problem with a resource or suggesting improvements to a file. This ensures that issues can be resolved efficiently.

- **Fully Responsive Design**  
  The app is optimized for seamless use across a range of devices. Whether the team is accessing it from a laptop in the office or a smartphone while working on-site, the Help Center remains user-friendly and accessible.

## Tech Stack

- **Frontend**  
  - HTML, CSS, Tailwind, JavaScript  
  - Framework: React for building a dynamic and responsive user interface.
  
- **Backend**  
  - Node.js with Express for handling server-side logic.
  - Local database (e.g., SQLite or PostgreSQL) for secure data storage and easy integration with the company's local servers.

- **Authentication**  
  - JWT (JSON Web Tokens) for secure user sessions.
  
- **Deployment**  
  - Designed to run on a local server to ensure data privacy and security.

## Usage

- **Admins** can manage resources through the Admin Panel, accessible after login.
- **Registered users** can view files and resources and leave feedback if they encounter issues.
- The app provides a simple and intuitive interface to access technical documentation, guides, and other support files necessary for on-site work.

## Security

- All user data and session information are encrypted using JWT.
- The app is designed to run on a local server to keep sensitive information within the company’s internal network.
- Regular audits of the codebase are recommended to ensure continued security.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

## Contact

For any issues or questions, please contact the project maintainer at:  
**Email**: [Your Email Here]  
**Phone**: [Your Phone Here]

---

### Made by Miloš Mirković
