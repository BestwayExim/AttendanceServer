const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Food Delivery API",
            version: "0.1.0",
            description: "Food delivery API documentation",
            contact: {
                name: "Mushthak VP",
                url: "https://mushthakvp.github.io/PersonalWebsite/",
                email: ""
            },
        },
        servers: [
            { url: "http://localhost:4880/" },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT"
                }
            }
        },
        security: [
            {
                bearerAuth: []
            }
        ],
    },
    apis: ["./routes/*.js", "./routes/**/*.js", "./schema/*.js", "./schema/**/*.js", "./docs/*.js", "./docs/**/*.js"],
};

const specs = swaggerJsdoc(options);

const uiOptions = {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: "Food Delivery API Docs",
    explorer: true,
    swaggerOptions: {
        docExpansion: 'list',
        filter: true,
        showRequestHeaders: true
    },
};


module.exports = { swaggerUi, specs, uiOptions };
