<br />
<br />
<div align="center">
    <a href="https://github.com/D3W10/FOCCACIA">
        <img src="https://raw.githubusercontent.com/D3W10/FOCCACIA/main/.github/logo.svg" alt="Logo" width="60" height="60">
    </a>
    <br />
    <br />
    <h2 align="center">FOCCACIA</h2>
    <h3 align="center">FOCCACIA Team Management</h3>
    <br />
    <p align="center">
        <a href="https://github.com/D3W10/FOCCACIA/issues">Report Bug</a>
        ·
        <a href="https://github.com/D3W10/FOCCACIA/issues">Request Feature</a>
    </p>
</div>
<br />

### Table of Contents
1. [About](#about)
    - [Built With](#built-with)
2. [Development](#development)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation-1)
3. [License](#license)
4. [Credits](#credits)

<br />
<br />

## About

FOCCACIA is a web application that helps you organize your favourite teams, leagues and seasons into groups. This project is the result of a team project for the PI course ("Programação na Internet") at ISEL.

<br />

### Built With

- [Express.js](https://expressjs.com/)
- [Handlebars](https://handlebarsjs.com/)
- [TailwindCSS](https://tailwindcss.com/)
- [Passport.js](https://www.passportjs.org/)
- [ElasticSearch](https://www.elastic.co/)

<br />
<br />

## Development

In order to deploy a copy of FOCCACIA on your device to develop a feature or fix a bug, follow the steps below to get started.

<br />

### Prerequisites

In order to run the application, you will need the following tools:
- Node.JS (`18.0.0` or higher)
- npm
- git (*optional*)

<br />

### Installation

1. Clone the repository
    ```sh
    git clone https://github.com/D3W10/FOCCACIA.git
    ```
2. Download and setup ElasticSearch
3. Run the ElasticSearch executable
4. Go to [Football API](https://www.api-football.com/), create an account and get your API key
5. Open the project folder using your prefered code editor (ex: VS Code)
6. Go to `src/data/fapi-teams-data.js` and replace `YOUR_API_KEY` with your API key
7. Install the npm packages
    ```sh
    npm i
    ```
8. Run the application
    ```sh
    npm run start
    ```

<br />
<br />

## License

Distributed under the MIT license. Check `LICENSE` for more details.

<br />
<br />

## Credits

- Made by [D3W10](https://d3w10.netlify.app/)