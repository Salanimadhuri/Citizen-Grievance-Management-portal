package com.grievance.portal.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.Path;
import java.nio.file.Paths;

/**
 * FileUploadConfig — serves uploaded complaint images as static resources.
 *
 * Replaces Express static file serving:
 *   app.use('/uploads', express.static(path.join(__dirname, 'uploads')))
 *
 * After this config, files saved to ./uploads/filename.jpg
 * are accessible at: http://localhost:5000/uploads/filename.jpg
 *
 * The React frontend renders complaint images using these URLs directly.
 */
@Slf4j
@Configuration
public class FileUploadConfig implements WebMvcConfigurer {

    @Value("${app.upload.dir:uploads}")
    private String uploadDir;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        Path uploadPath = Paths.get(uploadDir).toAbsolutePath().normalize();
        String resourceLocation = "file:" + uploadPath.toString() + "/";

        log.info("Serving uploaded files from: {}", resourceLocation);

        // Map /uploads/** URL pattern to the local uploads directory
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations(resourceLocation)
                .setCachePeriod(3600); // Cache for 1 hour
    }
}
