Section 1: Architecture Summary
The Smart Clinic application follows a layered Spring Boot architecture that combines both MVC and REST-based interactions. The MVC controllers work with Thymeleaf templates to render the Admin and Doctor dashboards, while the rest of the system exposes REST APIs for modules such as patients, appointments, and prescriptions. All incoming requests—whether from a web page or an API client—are routed through a shared service layer that centralizes business logic and ensures consistent processing.
The application uses two different databases. MySQL, accessed through Spring Data JPA, stores relational data such as patients, doctors, admins, and appointments. MongoDB, accessed through Spring Data MongoDB, stores prescription documents that benefit from a flexible schema. Each service delegates to the appropriate repository depending on the type of data being accessed. This separation of concerns keeps the architecture clean, modular, and easy to maintain.

Section 2: Numbered Flow of Data and Control
- The user interacts with the system through a Thymeleaf page (Admin/Doctor dashboard) or a REST client (mobile app, frontend script, etc.).
- The request is sent to the appropriate controller—either an MVC controller or a REST controller.
- The controller validates the request and forwards it to the corresponding service class.
- The service layer applies business logic and decides which database needs to be accessed.
- If the request involves relational data, the service calls a JPA repository connected to MySQL.
- If the request involves prescription data, the service calls a MongoDB repository using Spring Data MongoDB.
- The repository returns the data to the service, which sends it back to the controller, and the controller responds with either a rendered HTML page (MVC) or JSON data (REST).
