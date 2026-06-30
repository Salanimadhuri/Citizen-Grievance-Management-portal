package com.grievance.portal.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * SwaggerConfig — OpenAPI 3 / Swagger UI configuration.
 *
 * Swagger UI available at: http://localhost:5000/swagger-ui.html
 * OpenAPI JSON at:         http://localhost:5000/v3/api-docs
 *
 * All secured endpoints show a "Authorize" button in Swagger UI.
 * Paste your JWT token (without "Bearer ") to test protected routes.
 */
@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI openAPI() {
        final String securitySchemeName = "bearerAuth";

        return new OpenAPI()
                .info(new Info()
                        .title("Citizen Grievance Management Portal API")
                        .description("Spring Boot REST API — converted from Node.js/Express backend.\n\n" +
                                "**Default test credentials:**\n" +
                                "- Admin:   admin@example.com / admin123\n" +
                                "- Officer: officer@example.com / officer123\n" +
                                "- Citizen: citizen@example.com / citizen123\n\n" +
                                "Login via POST /api/auth/login to get a JWT token, then click Authorize.")
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("Grievance Portal Support")
                                .email("support@grievanceportal.gov")))
                .addSecurityItem(new SecurityRequirement().addList(securitySchemeName))
                .components(new Components()
                        .addSecuritySchemes(securitySchemeName,
                                new SecurityScheme()
                                        .name(securitySchemeName)
                                        .type(SecurityScheme.Type.HTTP)
                                        .scheme("bearer")
                                        .bearerFormat("JWT")
                                        .description("Enter JWT token obtained from POST /api/auth/login")));
    }
}
